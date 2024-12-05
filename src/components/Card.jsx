import React from "react";
import { cn } from "@/lib/utils";

export function Card({ label, amount, description, image, color }) {
  const isPrice = label === "Pending Balance";
  return (
    <CardContent className="hover:bg-gray-50">
      <section className="flex justify-between">
        {/* label */}
        <p className="text-sm font-bold">{label}</p>
      </section>
      <section className="flex justify-between items-center">
        <p
          className={`font-semibold ${
            isPrice ? "text-3xl" : "text-5xl"
          } w-full whitespace-nowrap`}
          style={{
            color: color,
          }}
        >
          {amount}
        </p>
        <img
          src={image}
          className={`h-[63px] w-[63px] object-contain ${
            isPrice ? "-ml-4" : ""
          }`}
          alt=""
        />
      </section>
    </CardContent>
  );
}

export function CardContent(props) {
  return (
    <div
      {...props}
      className={cn(
        "flex w-full flex-col rounded-xl border p-5 shadow",
        props.className
      )} 
    />
  );
}