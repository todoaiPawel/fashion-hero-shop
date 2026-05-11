import type { Product, ReturnRecord, CategoryStats } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "p-shirt-w",
    name: "Koszulka damska basic (SKU: KDB-001)",
    subLabel: "Available sizes: XS-XXL",
    category: "koszulka damska",
    sizes: ["S", "M", "L", "XL"],
    unitsSoldBySize: { S: 200, M: 233, L: 271, XL: 297 },
  },
  {
    id: "p-pants-w",
    name: "Spodnie damskie slim",
    category: "spodnie damskie",
    sizes: ["S", "M", "L", "XL"],
    unitsSoldBySize: { S: 120, M: 180, L: 150, XL: 90 },
  },
  {
    id: "p-dress-w",
    name: "Sukienka letnia",
    category: "sukienka",
    sizes: ["XS", "S", "M", "L"],
    unitsSoldBySize: { XS: 60, S: 140, M: 160, L: 110 },
  },
];

export const CATEGORY_STATS: CategoryStats[] = [
  {
    category: "koszulka damska",
    overallAvgReturnPct: 15,
    avgReturnPctBySize: { S: 14, M: 15, L: 15, XL: 16 },
  },
  {
    category: "spodnie damskie",
    overallAvgReturnPct: 22,
    avgReturnPctBySize: { S: 20, M: 22, L: 22, XL: 24 },
  },
  {
    category: "sukienka",
    overallAvgReturnPct: 18,
    avgReturnPctBySize: { XS: 17, S: 18, M: 18, L: 19 },
  },
];

const REASONS = [
  "za mały",
  "za duży",
  "kolor niezgodny ze zdjęciem",
  "materiał niezgodny z opisem",
  "wada produktu",
  "nie pasuje krój",
];

function seeded(i: number) {
  const x = Math.sin(i) * 10000;
  return x - Math.floor(x);
}

function generateReturns(): ReturnRecord[] {
  const out: ReturnRecord[] = [];
  let counter = 0;

  const shirt: Record<string, number> = { S: 24, M: 42, L: 38, XL: 95 };
  for (const [size, count] of Object.entries(shirt)) {
    for (let i = 0; i < count; i++) {
      counter++;
      const r = seeded(counter);
      const reason =
        size === "XL" && r < 0.55
          ? "za mały"
          : size === "XL" && r < 0.75
            ? "kolor niezgodny ze zdjęciem"
            : REASONS[Math.floor(r * REASONS.length)];
      const daysAgo = Math.floor(seeded(counter + 1) * 360);
      const date = new Date(Date.now() - daysAgo * 86400000).toISOString();
      out.push({
        id: `r-${counter}`,
        productId: "p-shirt-w",
        size,
        date,
        reason,
        orderId: `ORD-${(100000 + counter).toString().slice(-6)}`,
        note: r < 0.2 ? "Klient prosi o większy rozmiar" : undefined,
      });
    }
  }

  const pants: Record<string, number> = { S: 18, M: 35, L: 28, XL: 8 };
  for (const [size, count] of Object.entries(pants)) {
    for (let i = 0; i < count; i++) {
      counter++;
      const r = seeded(counter);
      const daysAgo = Math.floor(seeded(counter + 2) * 360);
      out.push({
        id: `r-${counter}`,
        productId: "p-pants-w",
        size,
        date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        reason: REASONS[Math.floor(r * REASONS.length)],
        orderId: `ORD-${(200000 + counter).toString().slice(-6)}`,
      });
    }
  }

  const dress: Record<string, number> = { XS: 6, S: 22, M: 28, L: 19 };
  for (const [size, count] of Object.entries(dress)) {
    for (let i = 0; i < count; i++) {
      counter++;
      const r = seeded(counter);
      const daysAgo = Math.floor(seeded(counter + 3) * 360);
      out.push({
        id: `r-${counter}`,
        productId: "p-dress-w",
        size,
        date: new Date(Date.now() - daysAgo * 86400000).toISOString(),
        reason: REASONS[Math.floor(r * REASONS.length)],
        orderId: `ORD-${(300000 + counter).toString().slice(-6)}`,
      });
    }
  }

  return out;
}

export const RETURNS: ReturnRecord[] = generateReturns();
