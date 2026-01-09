import pandas as pd
from sentence_transformers import SentenceTransformer, util
from sqlalchemy import text
from scripts.utils_pkg import get_engine, get_db_url 
import dotenv

dotenv.load_dotenv()

SIM_HIGH = 0.88   # auto-match threshold
SIM_LOW  = 0.70   

model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")





def load_data():
    db_url = get_db_url()
    engine = get_engine(db_url)


    conn = engine.raw_connection()
    try:
        q_candidates = """
        SELECT
            offer_id_a,
            offer_id_b,
            vendor_a,
            vendor_b,
            brand_key,
            name_a,
            name_b,
            overlap_count
        FROM public_core.core_offer_candidates
        """
        df_c = pd.read_sql(q_candidates, conn)

        q_offers = """
        SELECT
            offer_id,
            vendor,
            product_name_clean,
            image_url
        FROM public_core.core_offers
        """
        df_offers = pd.read_sql(q_offers, conn)
    finally:
        conn.close()

    return df_c, df_offers, engine


def build_embeddings(df_offers: pd.DataFrame):
    # one embedding per offer_id
    offer_texts = df_offers.set_index("offer_id")["product_name_clean"].to_dict()
    offer_ids = list(offer_texts.keys())
    sentences = list(offer_texts.values())

    emb_matrix = model.encode(sentences, convert_to_tensor=True, show_progress_bar=True)
    id_to_idx = {oid: i for i, oid in enumerate(offer_ids)}

    return emb_matrix, id_to_idx


def score_pairs(df_c: pd.DataFrame, emb_matrix, id_to_idx):
    rows = []

    for _, row in df_c.iterrows():
        aid = row.offer_id_a
        bid = row.offer_id_b

        if aid not in id_to_idx or bid not in id_to_idx:
            continue

        emb_a = emb_matrix[id_to_idx[aid]]
        emb_b = emb_matrix[id_to_idx[bid]]
        sim_embed = float(util.cos_sim(emb_a, emb_b))

        overlap = int(row.overlap_count)
        overlap_norm = min(overlap, 5) / 5.0

        name_a = row.name_a or ""
        name_b = row.name_b or ""
        len_a = len(name_a)
        len_b = len(name_b)
        len_ratio = (min(len_a, len_b) / max(len_a, len_b)) if max(len_a, len_b) > 0 else 0.0

        final_score = (
            0.6 * sim_embed +
            0.3 * overlap_norm +
            0.1 * len_ratio
        )

        rows.append(
            {
                "offer_id_a": aid,
                "offer_id_b": bid,
                "sim_embed": sim_embed,
                "overlap_count": overlap,
                "len_ratio": len_ratio,
                "final_score": final_score,
            }
        )

    return pd.DataFrame(rows)


def cluster_matches(df_scores: pd.DataFrame, df_offers: pd.DataFrame):
    # Guard: if scoring produced no rows (or schema changed), avoid KeyError
    if df_scores is None or df_scores.empty:
        # No scored pairs -> every offer becomes its own product
        all_offers = set(df_offers["offer_id"]) if not df_offers.empty else set()
        return {oid: i + 1 for i, oid in enumerate(sorted(all_offers))}

    if "final_score" not in df_scores.columns:
        raise KeyError(
            f"df_scores is missing 'final_score'. Columns: {list(df_scores.columns)}"
        )
    # for now: only auto-match strong ones
    df_match = df_scores[df_scores["final_score"] >= SIM_HIGH].copy()

    parent = {}

    def find(x):
        parent.setdefault(x, x)
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(a, b):
        pa, pb = find(a), find(b)
        if pa != pb:
            parent[pb] = pa

    # union all high-confidence pairs
    for _, row in df_match.iterrows():
        union(row.offer_id_a, row.offer_id_b)

    root_to_pid = {}
    offer_to_pid = {}
    next_pid = 1

    # 1) assign product_ids for offers that are in any matched pair
    matched_offers = set(df_match.offer_id_a).union(set(df_match.offer_id_b))
    for oid in matched_offers:
        root = find(oid)
        if root not in root_to_pid:
            root_to_pid[root] = next_pid
            next_pid += 1
        offer_to_pid[oid] = root_to_pid[root]

    # 2) assign singleton product_ids for offers that never matched any other offer
    all_offers = set(df_offers["offer_id"])
    for oid in all_offers:
        if oid not in offer_to_pid:
            offer_to_pid[oid] = next_pid
            next_pid += 1

    return offer_to_pid


def write_results(offer_to_pid: dict, df_offers: pd.DataFrame, engine):
    if not offer_to_pid:
        print("No matches to write.")
        return

    # Build clusters from the temporary product ids (cluster labels)
    clusters = {}
    for oid, temp_pid in offer_to_pid.items():
        clusters.setdefault(temp_pid, []).append(oid)

    # --- Load existing mapping and products to preserve/extend product_ids ---
    with engine.begin() as conn:
        conn.exec_driver_sql("CREATE SCHEMA IF NOT EXISTS public_core;")

        conn.exec_driver_sql(
            """
            CREATE TABLE IF NOT EXISTS public_core.offer_product_map (
                offer_id TEXT PRIMARY KEY,
                product_id INTEGER NOT NULL,
                confidence TEXT
            );
            """
        )

        conn.exec_driver_sql(
            """
            CREATE TABLE IF NOT EXISTS public_core.dim_product (
                product_id INTEGER PRIMARY KEY,
                display_name TEXT,
                display_image_url TEXT
            );
            """
        )

        # Existing mapping offer -> product_id
        res_map = conn.execute(text("SELECT offer_id, product_id FROM public_core.offer_product_map"))
        existing_map = pd.DataFrame(res_map.fetchall(), columns=res_map.keys()) if res_map.returns_rows else pd.DataFrame(columns=["offer_id", "product_id"])

        # Existing products (for max product_id)
        res_max = conn.execute(text("SELECT COALESCE(MAX(product_id), 0) AS max_pid FROM public_core.dim_product"))
        row_max = res_max.fetchone()
        max_pid = row_max[0] if row_max is not None else 0

    existing_map_dict = existing_map.set_index("offer_id")["product_id"].to_dict() if not existing_map.empty else {}

    # --- Assign stable product_ids per cluster ---
    cluster_to_pid: dict[int, int] = {}
    next_pid = max_pid + 1

    for temp_pid, offer_ids in clusters.items():
        # Check if any offer in this cluster already has a product_id
        existing_pids = {existing_map_dict[oid] for oid in offer_ids if oid in existing_map_dict}

        if existing_pids:
            # Reuse the smallest existing product_id in the cluster
            final_pid = min(existing_pids)
        else:
            # New cluster, assign a new product_id
            final_pid = next_pid
            next_pid += 1

        cluster_to_pid[temp_pid] = final_pid

    # Build the final mapping offer_id -> stable product_id
    rows_map = []
    for oid, temp_pid in offer_to_pid.items():
        final_pid = cluster_to_pid[temp_pid]
        rows_map.append({"offer_id": oid, "product_id": final_pid, "confidence": "auto_score"})

    df_map = pd.DataFrame(rows_map)

    # Build dim_product rows from offers + mapping
    df_join = df_map.merge(df_offers, on="offer_id", how="left")
    df_products = (
        df_join.groupby("product_id")
        .agg(
            display_name=("product_name_clean", "first"),
            display_image_url=("image_url", "first"),
        )
        .reset_index()
    )

  
    with engine.begin() as conn:
        conn.exec_driver_sql("CREATE SCHEMA IF NOT EXISTS public_core;")
        conn.exec_driver_sql(
            """
            CREATE TABLE IF NOT EXISTS public_core.offer_product_map (
                offer_id TEXT PRIMARY KEY,
                product_id INTEGER NOT NULL,
                confidence TEXT
            );
            """
        )
        conn.exec_driver_sql(
            """
            CREATE TABLE IF NOT EXISTS public_core.dim_product (
                product_id INTEGER PRIMARY KEY,
                display_name TEXT,
                display_image_url TEXT
            );
            """
        )

    # --- Upsert into Postgres (no truncate, keep stable product_ids) ---
    with engine.begin() as conn:
        # Upsert mapping
        conn.execute(
            text(
                """
                INSERT INTO public_core.offer_product_map (offer_id, product_id, confidence)
                VALUES (:offer_id, :product_id, :confidence)
                ON CONFLICT (offer_id) DO UPDATE
                SET product_id = EXCLUDED.product_id,
                    confidence = EXCLUDED.confidence;
                """
            ),
            df_map.to_dict(orient="records"),
        )

        # Upsert products
        conn.execute(
            text(
                """
                INSERT INTO public_core.dim_product (product_id, display_name, display_image_url)
                VALUES (:product_id, :display_name, :display_image_url)
                ON CONFLICT (product_id) DO UPDATE
                SET display_name = EXCLUDED.display_name,
                    display_image_url = EXCLUDED.display_image_url;
                """
            ),
            df_products.to_dict(orient="records"),
        )

    print("Upserted public_core.offer_product_map and public_core.dim_product")

def match_products():
    df_c, df_offers, engine = load_data()
    print(f"Loaded {len(df_c)} candidate pairs, {len(df_offers)} offers")

    emb_matrix, id_to_idx = build_embeddings(df_offers)
    df_scores = score_pairs(df_c, emb_matrix, id_to_idx)
    print(f"df_scores columns: {list(df_scores.columns)}")
    print(f"df_scores rows: {len(df_scores)}")
    print("Scored pairs sample:")
    print(df_scores.head())

    offer_to_pid = cluster_matches(df_scores, df_offers)
    print(f"Found {len(set(offer_to_pid.values()))} product clusters")

    write_results(offer_to_pid, df_offers, engine)
    print("Wrote core.offer_product_map and core.dim_product")
