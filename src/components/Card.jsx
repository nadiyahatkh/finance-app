import React from "react";
import { cn } from "@/lib/utils";

export function Card({ label, amount, description, image }) {
  return (
    <CardContent>
      <section className="flex justify-between">
        {/* label */}
        <p className="text-sm font-bold">{label}</p>
      </section>
      <section className="flex justify-between">
        <h2 className="text-6xl font-semibold" style={{ color: "#335CFF" }}>{amount}</h2>
        {/* <p className="text-xs text-gray-500">{description}</p> */}
        <img src={image} className="h-[63px] w-[63px] object-contain" alt="" />
      </section>
    </CardContent>
  );
}

export function CardContent(props) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col gap-3 rounded-xl border p-5 shadow",
        props.className
      )}
    />
  );
}