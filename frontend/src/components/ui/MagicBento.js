"use client";

import React from "react";
import { cn } from "@/lib/utils";

function MagicBento({ children, className }) {
  return <div className={cn("grid grid-cols-1 md:grid-cols-6 gap-4", className)}>{children}</div>;
}
export default React.memo(MagicBento);

export const BentoCard = React.memo(function BentoCard({ children, className, ...props }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 p-6 transition-colors hover:border-white/20",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
