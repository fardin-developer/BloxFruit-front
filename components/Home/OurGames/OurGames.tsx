"use client";
import OurGamesCard from "@/components/ui/OurGamesCard/OurGamesCard";
import { useGetAllGamesQuery } from "@/app/store/api/services/GameApi";
import React from "react";

export default function OurGames() {
  const { data, isLoading, error } = useGetAllGamesQuery();

  if (isLoading) return <div className="text-white text-center py-20">Loading games...</div>;
  if (error) return <div className="text-white text-center py-20">Failed to load games</div>;

  const games = data?.games || [];

  return (
    <div className="text-white max-w-[1320px] mx-auto px-4 2 mt-20">
      <div className="mb-12 lg:flex items-center justify-between">
        <h1 className="text-3xl xl:text-5xl font-medium uppercase">
          Our <span className="text-[#FADA1B]">Games</span>
        </h1>

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
        {games.map((game, index) => {
          const spanClass = index < 3 ? "xl:col-span-4" : "xl:col-span-6";

          // Map API data to component props
          const mappedGame = {
            title: game.name,
            items: "INSTANT",
            description: `Top up ${game.name} instantly. Publisher: ${game.publisher}`,
            image: game.image, // URL from API
            url: `/gamestore` // or specific game url if available
          };

          return (
            <div key={game._id} className={spanClass}>
              <OurGamesCard game={mappedGame} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
