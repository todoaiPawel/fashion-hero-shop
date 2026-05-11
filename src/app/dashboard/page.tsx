"use client";

import { useMemo, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { KpiStrip } from "@/components/dashboard/KpiStrip";
import { SizeTable } from "@/components/dashboard/SizeTable";
import { SizeBarChart } from "@/components/dashboard/SizeBarChart";
import { SizeDrillDown } from "@/components/dashboard/SizeDrillDown";
import { BrandHero } from "@/components/dashboard/BrandHero";
import { CATEGORY_STATS, PRODUCTS, RETURNS } from "@/lib/returns/mockData";
import { buildSizeRows, filterReturns } from "@/lib/returns/calc";
import { cn } from "@/lib/utils";
import type { SizeRow, TimeRange } from "@/lib/returns/types";

const RANGES: { key: TimeRange; label: string }[] = [
  { key: "30d", label: "30d" },
  { key: "90d", label: "90d" },
  { key: "12m", label: "12m" },
];

export default function DashboardPage() {
  const [productId, setProductId] = useState(PRODUCTS[0].id);
  const [range, setRange] = useState<TimeRange>("90d");
  const [active, setActive] = useState<SizeRow | null>(null);

  const product = useMemo(() => PRODUCTS.find((p) => p.id === productId)!, [productId]);
  const stats = useMemo(
    () => CATEGORY_STATS.find((s) => s.category === product.category)!,
    [product],
  );

  const filtered = useMemo(
    () => filterReturns(RETURNS, productId, range),
    [productId, range],
  );

  const rows = useMemo(
    () => buildSizeRows(product, filtered, stats),
    [product, filtered, stats],
  );

  return (
    <main className="min-h-screen bg-background">
      <BrandHero />
      <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10">
        <header className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">Size returns</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find which sizes drive returns versus your category average.
          </p>
        </header>

        <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="w-full sm:w-72">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PRODUCTS.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex flex-col">
                    <span>{p.name}</span>
                    {p.subLabel && (
                      <span className="text-xs text-muted-foreground">{p.subLabel}</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="inline-flex rounded-md border bg-card p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                className={cn(
                  "rounded-sm px-3 py-1.5 text-xs font-medium transition-colors",
                  range === r.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </section>

        <div className="mb-2 text-xs text-muted-foreground">
          Category: <span className="text-foreground">{product.category}</span>
        </div>

        <section className="mb-4">
          <KpiStrip rows={rows} overallCategoryAvg={stats.overallAvgReturnPct} />
        </section>

        <section className="mb-4">
          <SizeBarChart rows={rows} categoryAvg={stats.overallAvgReturnPct} />
        </section>

        <section>
          <SizeTable rows={rows} onRowClick={setActive} />
        </section>

        <SizeDrillDown row={active} returns={filtered} onClose={() => setActive(null)} />
      </div>
    </main>
  );
}
