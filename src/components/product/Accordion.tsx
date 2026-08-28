"use client";

import { useState } from "react";
import { PlusIcon, MinusIcon } from "@/components/ui/icons";

export function Accordion({
  items,
}: {
  items: { title: string; content: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between py-5 text-left"
          >
            <span className="font-serif text-xl font-semibold text-ink">
              {item.title}
            </span>
            {open === i ? <MinusIcon /> : <PlusIcon />}
          </button>
          {open === i && (
            <p className="whitespace-pre-line pb-6 text-sm leading-relaxed text-ink-soft">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
