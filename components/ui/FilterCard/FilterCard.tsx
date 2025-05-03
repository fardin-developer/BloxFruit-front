import Image from "next/image";
import React from "react";

const FilterCard = () => {
  return (
    <div className="flex items-center bg-[#0c0c09] gap-3 p-4 rounded-md cursor-pointer transition-all border border-transparent hover:border-[#FADA1B]">
      <Image
        src="/cardsImage/ourgames2.png"
        alt="Game"
        width={80}
        height={80}
        className="rounded-lg"
      />
      <div className="space-y-1">
        <div className="flex-1 flex items-center justify-between">
          <p className="text-xs font-medium">Game Name</p>
          <p className="text-sm text-[#FADA1B] whitespace-nowrap">15 items</p>
        </div>
        <p className="text-[11px] text-gray-400 leading-tight">
          Use all your skills to command an astonishing...
        </p>
      </div>
    </div>
  );
};

export default FilterCard;
