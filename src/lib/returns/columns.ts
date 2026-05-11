import type { ColumnDef } from "./types";

export const SIZE_TABLE_COLUMNS: ColumnDef[] = [
  { key: "size", label: "Size (kliknij, aby zobaczyć powód zwrotu)", align: "left", width: "w-[32%]" },
  { key: "returns", label: "Returns", align: "right", width: "w-[16%]", numeric: true },
  { key: "returnPct", label: "Return %", align: "right", width: "w-[16%]", numeric: true },
  { key: "categoryAvgPct", label: "Category Avg", align: "right", width: "w-[20%]", numeric: true },
  { key: "trend", label: "Trend", align: "right", width: "w-[16%]" },
];
