import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PriceHistory } from "@/types/product";
import { format, subDays, parseISO, isAfter } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface PriceHistoryChartProps {
  priceHistory: PriceHistory | undefined;
  currency?: string;
  isLoading?: boolean;
}

type TimePeriod = "7d" | "30d" | "90d" | "all";

export function PriceHistoryChart({
  priceHistory,
  currency = "TND",
  isLoading = false,
}: PriceHistoryChartProps) {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d");
  const [chartType, setChartType] = useState<"line" | "area">("area");

  // Filter and format data based on time period
  const chartData = useMemo(() => {
    if (!priceHistory || !priceHistory.history || priceHistory.history.length === 0) {
      return [];
    }

    const now = new Date();
    let cutoffDate: Date | null = null;

    switch (timePeriod) {
      case "7d":
        cutoffDate = subDays(now, 7);
        break;
      case "30d":
        cutoffDate = subDays(now, 30);
        break;
      case "90d":
        cutoffDate = subDays(now, 90);
        break;
      case "all":
        cutoffDate = null;
        break;
    }

    // Filter data by date
    let filtered = priceHistory.history;
    if (cutoffDate) {
      filtered = priceHistory.history.filter((point) => {
        const pointDate = parseISO(point.scraped_at);
        return isAfter(pointDate, cutoffDate!) || pointDate.getTime() === cutoffDate!.getTime();
      });
    }

    // Format data for chart
    return filtered.map((point) => {
      // Handle different date formats
      let date: Date;
      try {
        date = parseISO(point.scraped_at);
        // If parseISO fails, try Date constructor
        if (isNaN(date.getTime())) {
          date = new Date(point.scraped_at);
        }
      } catch {
        date = new Date(point.scraped_at);
      }

      const price = typeof point.price === "string" ? parseFloat(point.price) : point.price;

      // Determine date label format based on time period
      let dateLabel: string;
      if (timePeriod === "7d") {
        dateLabel = format(date, "MMM dd");
      } else if (timePeriod === "30d") {
        dateLabel = format(date, "MMM dd");
      } else if (timePeriod === "90d") {
        dateLabel = format(date, "MMM dd");
      } else {
        dateLabel = format(date, "MMM yyyy");
      }

      return {
        date: date,
        dateLabel: dateLabel,
        fullDate: format(date, "MMM dd, yyyy"),
        price: price,
        priceFormatted: price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        vendor: point.vendor,
      };
    });
  }, [priceHistory, timePeriod]);

  // Calculate price statistics
  const stats = useMemo(() => {
    if (chartData.length === 0) {
      return null;
    }

    const prices = chartData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const currentPrice = chartData[chartData.length - 1]?.price || 0;
    const oldestPrice = chartData[0]?.price || 0;
    const priceChange = currentPrice - oldestPrice;
    const priceChangePercent =
      oldestPrice > 0 ? ((priceChange / oldestPrice) * 100).toFixed(1) : "0";

    return {
      minPrice,
      maxPrice,
      currentPrice,
      oldestPrice,
      priceChange,
      priceChangePercent,
      isPositive: priceChange > 0,
      isNegative: priceChange < 0,
      isNeutral: priceChange === 0,
    };
  }, [chartData]);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-semibold text-foreground mb-1">{data.fullDate}</p>
          <p className="text-lg font-bold text-primary">
            {data.priceFormatted} {currency}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{data.vendor}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>Loading price history data...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <div className="text-muted-foreground">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!priceHistory || chartData.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>No price history available for this product</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-muted-foreground">No historical price data available yet.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Price History</CardTitle>
            <CardDescription>
              Track price changes over time for {priceHistory.product_name}
            </CardDescription>
          </div>
          <Tabs value={chartType} onValueChange={(v) => setChartType(v as "line" | "area")}>
            <TabsList>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="line">Line</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {/* Statistics */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Current Price</p>
              <p className="text-lg font-bold text-foreground">
                {stats.currentPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currency}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Lowest Price</p>
              <p className="text-lg font-bold text-foreground">
                {stats.minPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currency}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Highest Price</p>
              <p className="text-lg font-bold text-foreground">
                {stats.maxPrice.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currency}
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground mb-1">Price Change</p>
              <div className="flex items-center gap-1">
                {stats.isPositive && <TrendingUp className="size-4 text-green-500" />}
                {stats.isNegative && <TrendingDown className="size-4 text-red-500" />}
                {stats.isNeutral && <Minus className="size-4 text-muted-foreground" />}
                <p
                  className={cn(
                    "text-lg font-bold",
                    stats.isPositive && "text-green-500",
                    stats.isNegative && "text-red-500",
                    stats.isNeutral && "text-muted-foreground"
                  )}
                >
                  {stats.priceChange > 0 ? "+" : ""}
                  {stats.priceChange.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </p>
              </div>
              <p
                className={cn(
                  "text-xs mt-1",
                  stats.isPositive && "text-green-500",
                  stats.isNegative && "text-red-500",
                  stats.isNeutral && "text-muted-foreground"
                )}
              >
                ({stats.priceChangePercent}%)
              </p>
            </div>
          </div>
        )}

        {/* Time Period Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={timePeriod === "7d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("7d")}
          >
            7 Days
          </Button>
          <Button
            variant={timePeriod === "30d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("30d")}
          >
            30 Days
          </Button>
          <Button
            variant={timePeriod === "90d" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("90d")}
          >
            90 Days
          </Button>
          <Button
            variant={timePeriod === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimePeriod("all")}
          >
            All Time
          </Button>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="dateLabel"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()} ${currency}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#colorPrice)"
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis
                  dataKey="dateLabel"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()} ${currency}`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
