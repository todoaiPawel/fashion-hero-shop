"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUp, ChevronsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIZE_TABLE_COLUMNS } from "@/lib/returns/columns";
import type { ColumnDef, SizeRow } from "@/lib/returns/types";

interface Props {
  rows: SizeRow[];
  onRowClick: (row: SizeRow) => void;
}

function TrendIcon({ trend }: { trend: SizeRow["trend"] }) {
  if (trend === "down") return <ArrowDown className="h-4 w-4 text-muted-foreground" />;
  if (trend === "flat") return <ArrowRight className="h-4 w-4 text-muted-foreground" />;
  if (trend === "up") return <ArrowUp className="h-4 w-4 text-foreground" />;
  return <ChevronsUp className="h-4 w-4 text-destructive" />;
}

function renderCell(col: ColumnDef, row: SizeRow) {
  switch (col.key) {
    case "size":
      return <span className="font-medium">{row.size}</span>;
    case "returns":
      return <span className="tabular-nums">{row.returns}</span>;
    case "returnPct":
      return <span className="tabular-nums">{row.returnPct.toFixed(1)}%</span>;
    case "categoryAvgPct":
      return <span className="tabular-nums text-muted-foreground">{row.categoryAvgPct.toFixed(1)}%</span>;
    case "trend":
      return (
        <span className="inline-flex items-center justify-end gap-1">
          <TrendIcon trend={row.trend} />
          {row.trend === "up-strong" && (
            <span className="text-[10px] font-medium uppercase text-destructive">Problem</span>
          )}
        </span>
      );
    default:
      return null;
  }
}

type SortKey = ColumnDef["key"];

export function SizeTable({ rows, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("returnPct");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const visible = useMemo(() => rows.filter((r) => !r.insufficient), [rows]);
  const hiddenCount = rows.length - visible.length;

  const sorted = useMemo(() => {
    const copy = [...visible];
    copy.sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortKey as string];
      const vb = (b as Record<string, unknown>)[sortKey as string];
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va;
      }
      return sortDir === "asc"
        ? String(va).localeCompare(String(vb))
        : String(vb).localeCompare(String(va));
    });
    return copy;
  }, [visible, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir(key === "size" ? "asc" : "desc");
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <table className="w-full table-fixed text-sm">
        <thead className="border-b bg-muted/40">
          <tr>
            {SIZE_TABLE_COLUMNS.map((col) => (
              <th
                key={col.key}
                className={cn(
                  col.width,
                  "px-3 py-2 text-xs font-medium text-muted-foreground",
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                <button type="button" onClick={() => toggleSort(col.key)} className="hover:text-foreground">
                  {col.label}
                  {sortKey === col.key && <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr
              key={row.size}
              onClick={() => onRowClick(row)}
              className={cn(
                "cursor-pointer border-b last:border-b-0 transition-colors hover:bg-muted/40",
                row.trend === "up-strong" && "bg-destructive/5",
              )}
            >
              {SIZE_TABLE_COLUMNS.map((col) => (
                <td
                  key={col.key}
                  className={cn(col.width, "px-3 py-3", col.align === "right" ? "text-right" : "text-left")}
                >
                  {renderCell(col, row)}
                </td>
              ))}
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={SIZE_TABLE_COLUMNS.length} className="px-3 py-8 text-center text-sm text-muted-foreground">
                No sizes meet the minimum sample (≥10 returns).
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {hiddenCount > 0 && (
        <div className="border-t bg-muted/20 px-3 py-2 text-xs text-muted-foreground">
          {hiddenCount} size{hiddenCount > 1 ? "s" : ""} hidden — insufficient data (n &lt; 10)
        </div>
      )}
    </div>
  );
}
