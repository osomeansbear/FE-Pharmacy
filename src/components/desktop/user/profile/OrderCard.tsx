"use client";

import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { OrderListType } from "../../../../../types/orderTypes";

interface OrderCardProps {
  order: OrderListType;
}

export default function OrderCard({ order }: OrderCardProps) {
  const formatDate = new Date(order.createdAt).toLocaleString();

  return (
    <div className="flex flex-col bg-secondary border border-primary/20 rounded-xl">
      {/* Order info */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <div className="font-bold text-lg">{order.id}</div>
        <div className="font-bold text-lg text-emerald-700/90">
          {order.status}
        </div>
      </div>
      {/* Order item info */}

      <div className="flex flex-col border-y-1 border-muted/20 px-4 py-6">
        {/* item info */}
        {order.items.map((item) => {
          return (
            <div key={item.id} className="flex items-center justify-between ">
              <div className="flex items-center gap-4">
                <img
                  src="https://cdn.nhathuoclongchau.com.vn/unsafe/96x0/filters:quality(90):format(webp)/00029014_khau_trang_y_te_safefit_4_lop_50_cai_1941_5fec_large_4891ebda6c.JPG"
                  alt=""
                  className="rounded-lg h-16 w-16"
                />
                <span className="font-semibold text-sm">
                  {item.productName}
                </span>
              </div>
              <div className="flex flex-col gap-6">
                <div className="flex gap-6">
                  <span className="text-lg font-semibold">
                    {formatVND(item.unitPrice ?? "0")}
                  </span>
                  <span className="text-muted text-lg">
                    {item.quantity ?? "0"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* items total price */}
        <div className="flex justify-end gap-2">
          <span>Total:</span>
          <span className="text-success">{formatVND(order.totalAmount)}</span>
        </div>
      </div>

      {/* button */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <span className="text-muted text-sm">{formatDate}</span>
        <Button className="bg-secondary text-success hover:bg-success hover:text-secondary rounded-full border border-success">
          Buy Again
        </Button>
      </div>
    </div>
  );
}
