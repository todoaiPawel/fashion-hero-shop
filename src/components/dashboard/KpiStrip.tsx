import { Card } from "@/components/ui/card";
import type { SizeRow } from "@/lib/returns/types";

interface Props {
  rows: SizeRow[];
  overallCategoryAvg: number;
}

export function KpiStrip({ rows, overallCategoryAvg }: Props) {
  const totalReturns = rows.reduce((s, r) => s + r.returns, 0);
  const totalUnits = rows.reduce((s, r) => s + r.unitsSold, 0);
  const overallPct = totalUnits ? (totalReturns / totalUnits) * 100 : 0;
  const delta = overallPct - overallCategoryAvg;
  const eligible = rows.filter((r) => !r.insufficient);
  const worst = eligible.slice().sort((a, b) => b.returnPct - a.returnPct)[0];

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3">
      <Card className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground">Returns</div>
        <div className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums">{totalReturns}</div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground">Return % vs avg</div>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="text-xl sm:text-2xl font-semibold tabular-nums">{overallPct.toFixed(1)}%</span>
          <span className={`text-xs tabular-nums ${delta > 0 ? "text-destructive" : "text-muted-foreground"}`}>
            {delta > 0 ? "+" : ""}{delta.toFixed(1)}
          </span>
        </div>
      </Card>
      <Card className="p-3 sm:p-4">
        <div className="text-xs text-muted-foreground">Worst size</div>
        <div className="mt-1 text-xl sm:text-2xl font-semibold tabular-nums">
          {worst ? worst.size : "—"}
          {worst && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              {worst.returnPct.toFixed(1)}%
            </span>
          )}
        </div>
      </Card>
    </div>
  );
}
