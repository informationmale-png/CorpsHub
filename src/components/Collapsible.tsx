"use client";

import { useState } from "react";

export default function Collapsible({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-5 py-4 text-left font-medium"
      >
        {title}
        <span className={`inline-block text-muted-foreground transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div
        className={`grid transition-all duration-300 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-border px-5 py-4 text-sm">{children}</div>
        </div>
      </div>
    </div>
  );
}
