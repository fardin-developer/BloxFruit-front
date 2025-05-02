"use client";
import Image from "next/image";
import React from "react";
import cardBg from "@/public/mainCardImages/card-bg.png";

export default function CartCard() {
  return (
    <div className="flex items-center justify-between bg-[#0c0c09] text-white rounded-xl p-4 shadow-inner w-full max-w-md">
      {/* Image */}
      <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-amber-300">
        <div
          className="absolute inset-0 bg-cover bg-no-repeat mix-blend-color-burn z-0"
          style={{
            backgroundImage: `url(${cardBg.src})`,
          }}
        ></div>

        <Image
          src="/mainCardImages/common.png"
          alt="Product"
          width={500}
          height={500}
          className="relative z-10 w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex-1 px-4">
        <h4 className="text-sm font-semibold leading-tight uppercase">
          MACHINE GUN 3000 RIGERT BLUE
        </h4>
        <p className="text-yellow-400 text-sm mt-1">$120 per ps</p>
      </div>

      {/* Quantity controls */}
      <div className="flex flex-col items-center gap-1">
        <button className="w-6 h-6 text-black bg-white rounded border border-white hover:bg-yellow-300 transition text-sm font-bold">
          +
        </button>
        <span className="text-sm font-bold">01</span>
        <button className="w-6 h-6 text-yellow-400 border border-yellow-400 rounded hover:bg-yellow-400 hover:text-black transition text-sm font-bold">
          -
        </button>
      </div>
    </div>
  );
}
