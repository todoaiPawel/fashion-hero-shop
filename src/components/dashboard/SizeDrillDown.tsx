"use client";

import { useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { PRODUCTS } from "@/lib/returns/mockData";
import type { ReturnRecord, SizeRow } from "@/lib/returns/types";

interface Props {
  row: SizeRow | null;
  returns: ReturnRecord[];
  onClose: () => void;
}

export function SizeDrillDown({ row, returns, onClose }: Props) {
  const isMobile = useIsMobile();

  const recent = useMemo(() => {
    if (!row) return [];
    return returns
      .filter((r) => r.size === row.size)
      .sort((a, b) => +new Date(b.date) - +new Date(a.date))
      .slice(0, 5);
  }, [row, returns]);

  if (!row) return null;

  const open = !!row;

  const productName = (id: string) =>
    PRODUCTS.find((p) => p.id === id)?.name.replace(/\s*\(SKU:.*\)\s*/, "") ?? id;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

  const Body = (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Showing the 5 most recent returns for size {row.size}.
      </p>
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left text-xs font-medium uppercase text-muted-foreground">
              <th className="px-3 py-2">Return Reason</th>
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2">Product</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-3 py-3 font-semibold text-foreground">{r.reason}</td>
                <td className="px-3 py-3 text-muted-foreground tabular-nums">{formatDate(r.date)}</td>
                <td className="px-3 py-3 text-muted-foreground">{productName(r.productId)}</td>
              </tr>
            ))}
            {recent.length === 0 && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No returns in range.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  const title = `${row.size} — Return Details`;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0">
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
          {Body}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {Body}
      </DialogContent>
    </Dialog>
  );
}
