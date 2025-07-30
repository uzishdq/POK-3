"use client";
import { refreshData } from "@/lib/server/action/action-refresh-data";
import React from "react";
import { toast } from "sonner";

export default function ButtonRefreshData() {
  const [isPending, startTranssition] = React.useTransition();
  const handleRefresh = () => {
    startTranssition(() => {
      refreshData().then((data) => {
        if (data.ok) {
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      });
    });
  };
  return (
    <button
      className="w-full text-left"
      onClick={handleRefresh}
      disabled={isPending}
    >
      {isPending ? "Loading..." : "Refresh Data"}
    </button>
  );
}
