export type SizeCode = string;

export interface Product {
  id: string;
  name: string;
  subLabel?: string;
  category: string;
  sizes: SizeCode[];
  unitsSoldBySize: Record<SizeCode, number>;
}

export interface ReturnRecord {
  id: string;
  productId: string;
  size: SizeCode;
  date: string;
  reason: string;
  note?: string;
  orderId: string;
}

export interface CategoryStats {
  category: string;
  avgReturnPctBySize: Record<SizeCode, number>;
  overallAvgReturnPct: number;
}

export interface SizeRow {
  size: SizeCode;
  returns: number;
  unitsSold: number;
  returnPct: number;
  categoryAvgPct: number;
  trend: "down" | "flat" | "up" | "up-strong";
  insufficient: boolean;
}

export type TimeRange = "30d" | "90d" | "12m";

export interface ColumnDef {
  key: keyof SizeRow | "trend";
  label: string;
  align?: "left" | "right";
  width: string;
  numeric?: boolean;
}
