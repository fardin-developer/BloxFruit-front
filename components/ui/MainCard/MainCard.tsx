import React from "react";
import cardBg from "@/public/mainCardImages/card-bg-2.png";
import rare from "@/public/mainCardImages/rare.png";
import Image from "next/image";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbShoppingCart } from "react-icons/tb";

const MainCard = () => {
  return (
    <div className="rounded-xl main-card-bg p-3 shadow-xl transition-all text-white group">
      <div className="relative h- rounded-xl border-1 border-[#6BCA4A] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover opacity-1   "
          style={{
            backgroundImage: `url(${cardBg.src})`,
            backgroundBlendMode: "color-burn",
          }}
        ></div>
        <div className="relative">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-10"
            style={{
              backgroundImage: `url(${cardBg.src})`,
              backgroundBlendMode: "color-burn",
            }}
          ></div>

          <Image
            src={rare}
            alt="Rare Shadow"
            width={400}
            height={400}
            className="absolute -top-9 left-5 w-64 h-64 object-cover blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          />
          {/* Main Rare Image */}
          <Image
            src={rare}
            alt="Rare"
            width={400}
            height={400}
            className="relative z-10 transition-all duration-300"
          />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-sm mb-2 text-[#9D99AD]">Permanent Fruit</p>
        <div className="flex items-center gap-1">
          <h2 className="text-lg text-white font-bold">BarrierFruit</h2>
          <RiVerifiedBadgeFill className="text-[#1d96ff]" />
        </div>
        <hr className="mt-2 my-4 border rgb-border" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-xs text-[#9D99AD]">Regular Price</p>
            <h2 className="text-lg text-white">$17.89 Dollar</h2>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-[#9D99AD]">Discount Price</p>
            <h2 className="text-lg text-white">$10.23 Dollar</h2>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button className="bg-gradient-to-l to-green-400 from-white py-3 w-full rounded-sm text-gray-700 font-bold cursor-pointer">
            Buy now
          </button>
          <button className="p-3.5 bg-white/10 rounded-sm cursor-pointer ">
            <TbShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
