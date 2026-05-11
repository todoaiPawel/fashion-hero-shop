"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";
import type { SizeRow } from "@/lib/returns/types";

interface Props {
  rows: SizeRow[];
  categoryAvg: number;
}

export function SizeBarChart({ rows, categoryAvg }: Props) {
  const data = rows
    .filter((r) => !r.insufficient)
    .map((r) => ({ size: r.size, value: Number(r.returnPct.toFixed(1)), trend: r.trend }));

  const sizePalette: Record<string, string> = {
    XS: "hsl(200 65% 55%)",
    S: "hsl(160 55% 45%)",
    M: "hsl(45 85% 55%)",
    L: "hsl(25 80% 55%)",
    XL: "hsl(0 75% 58%)",
    XXL: "hsl(280 50% 55%)",
  };
  const fallbackPalette = [
    "hsl(210 60% 55%)",
    "hsl(140 50% 50%)",
    "hsl(50 85% 55%)",
    "hsl(20 80% 58%)",
    "hsl(340 70% 58%)",
    "hsl(265 55% 60%)",
  ];

  return (
    <div className="h-44 w-full rounded-lg border bg-card p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
          <XAxis dataKey="size" tickLine={false} axisLine={false} className="text-xs" />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
            className="text-xs"
            width={36}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.4 }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 6,
              fontSize: 12,
            }}
            formatter={(v: number) => [`${v}%`, "Return %"]}
          />
          <ReferenceLine
            y={categoryAvg}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="4 4"
            label={{
              value: `avg ${categoryAvg}%`,
              position: "right",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 10,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => {
              const base =
                sizePalette[d.size.toUpperCase()] ?? fallbackPalette[i % fallbackPalette.length];
              return (
                <Cell
                  key={d.size}
                  fill={base}
                  stroke={d.trend === "up-strong" ? "hsl(var(--destructive))" : "transparent"}
                  strokeWidth={d.trend === "up-strong" ? 2 : 0}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
