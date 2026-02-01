# Admin Guide - Superuser/Superadmin Features

This guide explains how to use the admin features for database visibility and management.

## Quick Start

### 1. Create a Superuser

You have two options:

**Option A: Using Django's built-in command**
```bash
docker exec -it priceradar-django python manage.py createsuperuser
```

**Option B: Using the helper script**
```bash
docker exec -it priceradar-django python create_superuser.py
```

### 2. Access Django Admin Panel

1. Open your browser and go to: **http://localhost:8000/admin/**
2. Login with your superuser credentials
3. You'll see all registered models with enhanced admin interfaces

## Admin Features

### Django Admin Panel

The admin panel provides:

- **User Management**: View, search, and filter all users
- **Product Management**: Browse products, offers, and prices
- **Category Management**: View vendor categories and subcategories
- **Price Tracking**: View price history and latest prices
- **Read-only Views**: All pricing data is read-only (managed by dbt/Airflow)

### Admin API Endpoints (Superuser Only)

All admin API endpoints require:
- JWT authentication (Bearer token)
- Superuser permissions (`is_superuser=True`)

#### 1. Admin Dashboard
**GET** `/api/admin/dashboard/`

Returns comprehensive statistics:
- User statistics (total, active, staff, new users)
- Product statistics (total, with/without offers)
- Offer statistics (total, active, inactive)
- Price statistics (average, min, max, recent activity)
- Category statistics

**Example:**
```bash
curl -X GET http://localhost:8000/api/admin/dashboard/ \
  -H "Authorization: Bearer YOUR_SUPERUSER_TOKEN"
```

#### 2. List All Users
**GET** `/api/admin/users/`

Query parameters:
- `search` - Search by username, email, first name, last name
- `is_active` - Filter by active status (true/false)
- `is_staff` - Filter by staff status (true/false)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)

**Example:**
```bash
curl -X GET "http://localhost:8000/api/admin/users/?search=john&is_active=true&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_SUPERUSER_TOKEN"
```

#### 3. Get User Details
**GET** `/api/admin/users/<user_id>/`

Returns detailed information about a specific user including groups and permissions.

**Example:**
```bash
curl -X GET http://localhost:8000/api/admin/users/1/ \
  -H "Authorization: Bearer YOUR_SUPERUSER_TOKEN"
```

#### 4. Database Statistics
**GET** `/api/admin/database/stats/`

Returns:
- Table sizes (top 20 largest tables)
- Record counts by model
- Database name

**Example:**
```bash
curl -X GET http://localhost:8000/api/admin/database/stats/ \
  -H "Authorization: Bearer YOUR_SUPERUSER_TOKEN"
```

## Testing Admin Features

### Using Swagger UI

1. Go to **http://localhost:8000/api/docs/**
2. Click "Authorize" button
3. Enter: `Bearer YOUR_SUPERUSER_TOKEN`
4. Navigate to `/api/admin/` endpoints
5. Test each endpoint directly in the browser

### Using Python Script

```python
import requests

BASE_URL = "http://localhost:8000"

# Login as superuser
response = requests.post(
    f"{BASE_URL}/api/auth/login/",
    json={"username": "admin", "password": "your_password"}
)
token = response.json()["access"]

headers = {"Authorization": f"Bearer {token}"}

# Get dashboard stats
dashboard = requests.get(f"{BASE_URL}/api/admin/dashboard/", headers=headers)
print("Dashboard:", dashboard.json())

# List users
users = requests.get(f"{BASE_URL}/api/admin/users/", headers=headers)
print("Users:", users.json())

# Get database stats
db_stats = requests.get(f"{BASE_URL}/api/admin/database/stats/", headers=headers)
print("DB Stats:", db_stats.json())
```

## Admin Models in Django Admin

### Users
- **List View**: Username, email, first name, last name, staff status, active status, date joined
- **Filters**: Staff status, active status, date joined
- **Search**: Username, email, first name, last name

### Products (DimProduct)
- **List View**: Product ID, display name, image URL
- **Search**: Product ID, display name
- **Read-only**: Yes (managed by dbt)

### Offers (CoreOffers)
- **List View**: Offer ID, vendor, product name, category, subcategory
- **Filters**: Vendor, category
- **Search**: Offer ID, product name, vendor
- **Read-only**: Yes

### Prices (CorePrices)
- **List View**: Offer ID, price value, currency, observed at
- **Filters**: Currency, observed at
- **Date Hierarchy**: By observed_at
- **Read-only**: Yes

### Latest Prices (VLastestOfferPrices)
- **List View**: Offer ID, price value, currency, observed at
- **Filters**: Currency, observed at
- **Read-only**: Yes

### Categories (DimVendorCategory)
- **List View**: Category ID, vendor, category name
- **Filters**: Vendor
- **Search**: Category ID, category name, vendor
- **Read-only**: Yes

### Subcategories (DimVendorSubcategory)
- **List View**: Subcategory ID, vendor, category name, subcategory name
- **Filters**: Vendor, category name
- **Read-only**: Yes

## Security Notes

- All admin API endpoints require superuser permissions
- Regular users cannot access admin endpoints even with a valid JWT token
- Django admin panel also requires superuser or staff permissions
- All pricing/product models are read-only in admin (data managed by dbt/Airflow)

## Troubleshooting

### "Permission denied" error
- Ensure your user has `is_superuser=True`
- Check that you're using the correct JWT token
- Verify the token hasn't expired

### Models not showing in admin
- Ensure models are registered in `pricing/admin.py` or `accounts/admin.py`
- Check that the app is in `INSTALLED_APPS` in settings.py

### API endpoints returning 403
- Verify you're logged in as a superuser
- Check the JWT token is valid and not expired
- Ensure the `IsSuperUser` permission class is working
