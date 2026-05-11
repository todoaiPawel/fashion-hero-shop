import type { CategoryStats, Product, ReturnRecord, SizeRow, TimeRange } from "./types";

export const MIN_RETURNS_THRESHOLD = 10;

export function rangeToDays(range: TimeRange): number {
  if (range === "30d") return 30;
  if (range === "90d") return 90;
  return 365;
}

export function filterReturns(
  returns: ReturnRecord[],
  productId: string,
  range: TimeRange,
): ReturnRecord[] {
  const cutoff = Date.now() - rangeToDays(range) * 86400000;
  return returns.filter((r) => r.productId === productId && new Date(r.date).getTime() >= cutoff);
}

export function buildSizeRows(
  product: Product,
  returns: ReturnRecord[],
  stats: CategoryStats,
): SizeRow[] {
  return product.sizes.map((size) => {
    const sizeReturns = returns.filter((r) => r.size === size).length;
    const units = product.unitsSoldBySize[size] ?? 0;
    const returnPct = units > 0 ? (sizeReturns / units) * 100 : 0;
    const categoryAvgPct = stats.avgReturnPctBySize[size] ?? stats.overallAvgReturnPct;
    const ratio = categoryAvgPct > 0 ? returnPct / categoryAvgPct : 1;
    let trend: SizeRow["trend"] = "flat";
    if (ratio >= 2) trend = "up-strong";
    else if (ratio > 1.1) trend = "up";
    else if (ratio < 0.9) trend = "down";
    return {
      size,
      returns: sizeReturns,
      unitsSold: units,
      returnPct,
      categoryAvgPct,
      trend,
      insufficient: sizeReturns < MIN_RETURNS_THRESHOLD,
    };
  });
}

export function maskOrderId(id: string): string {
  if (id.length <= 4) return "****";
  return id.slice(0, 4) + "•••" + id.slice(-2);
}
