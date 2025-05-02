import OurGamesCard from "@/components/ui/OurGamesCard/OurGamesCard";
import image1 from "@/public/cardsImage/ourgames.png";
import image2 from "@/public/cardsImage/ourgames2.png";
import image3 from "@/public/cardsImage/ourgames3.jpg";
import image4 from "@/public/cardsImage/ourgames4.png";
import image5 from "@/public/cardsImage/ourgames5.png";
import React from "react";

const data = [
  {
    title: "Blox Fruits",
    items: 16,
    description: "Blox Fruits are one of the four main ways to deal d...",
    image: image1,
  },
  {
    title: "Blue Lock Rivals",
    items: 16,
    description: "Blue Lock Rivals, a free-to-play Roblox game. Th...",
    image: image2,
  },
  {
    title: "Rivals",
    items: 16,
    description: "RIVALS is a first-person shooter game on Roblox...",
    image: image3,
  },
  {
    title: "Combat Warrior",
    items: 16,
    description:
      "Combat Warriors is a fighting experience. Players compete and fight others, and t...",
    image: image4,
  },
  {
    title: "Anime Reborn",
    items: 16,
    description:
      "Anime Reborn refers to two different things: a popular tower defense game o...",
    image: image5,
  },
];

export default function OurGames() {
  return (
    <div className="text-white max-w-[1320px] mx-auto px-4 2xl:px-0 mt-20">
      <div className="mb-12 lg:flex items-center justify-between">
        <h1 className="text-3xl xl:text-5xl font-medium uppercase">
          Our <span className="text-[#FADA1B]">Games</span>
        </h1>
        <div className="sm:flex justify-between items-center">
          <div className="flex justify-between my-3 items-center">
            <p className="text-white">
              Total Price 70.99ETH
            </p>
            <span className="text-3xl px-4 text-[#2F2A38]">|</span>
            <p className="text-white md:pr-6">
              Total 15 Items
            </p>
          </div>
          <button className="w-full sm:w-fit text-center flex justify-center items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer duration-300 hover:brightness-150">
            Get Started!
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              className="ml-2"
            >
              <path
                d="M4 11V13H16V15H18V13H20V11H18V9H16V11H4ZM14 7H16V9H14V7ZM14 7H12V5H14V7ZM14 17H16V15H14V17ZM14 17H12V19H14V17Z"
                fill="#0F1016"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {data.map((item, index) => {
          const spanClass = index < 3 ? "xl:col-span-4" : "xl:col-span-6";
          return (
            <div key={index} className={spanClass}>
              <OurGamesCard game={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
