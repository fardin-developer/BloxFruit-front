"use client";
import React from "react";
import bannerbackground from "@/public/images/bannerbackground.png";
import gamecharecter from "@/public/images/gamecharecter.png";

const Hero = () => {
  return (
    <div className="container mx-auto px-4 xl:px-0 xl:py-4 text-white">
      <div
        className="h-[100vh] bg-cover bg-center rounded-t-xl flex "
        style={{
          backgroundImage: `url(${bannerbackground.src})`,
        }}
      >
        <div className="max-w-[1320px] mx-auto flex flex-row-reverse justify-between items-center relative">
          <div className="absolute ">
            <img
              src={gamecharecter.src}
              alt=""
              className="aspect-square xl:h-[880px]"
            />
          </div>
          <div className="relative ">
            <span className="text-[1.5rem] font-medium bg-gradient-to-l to-[#FADA1B] via-[#fad81bc0] from-white bg-clip-text text-transparent ">
              Unlock Exclusive Roblox Gear in Seconds!
            </span>
            <h1 className="text-[4.5rem] font-bold leading-[110%] max-w-[20ch]">
              Buy Your Favorite In-Game Items <span className="bg-gradient-to-l to-white via-[#FADA1B] from-white bg-clip-text text-transparent ">Instantly, Securely, and Easily</span>
              with Blox Fruit Hub!
            </h1>
            <p className="max-w-[60ch]">
              Looking for fast and trusted item purchases in BloxFruits, Blue
              Lock Rivals, Rivals, Combat Warrior, and Anime Reborn? Blox Fruit
              Hub delivers your favorite items instantly.
            </p>
            <button>Get Started!</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
