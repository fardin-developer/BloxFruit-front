"use client";
import OurGamesCard from "@/components/ui/OurGamesCard/OurGamesCard";
import { useGetAllGamesQuery } from "@/app/store/api/services/GameApi";
import React, { useMemo } from "react";

export default function OurGames() {
  const { data, isLoading, error } = useGetAllGamesQuery();

  const games = data?.games || [];

  // Group games by category dynamically
  const gamesByCategory = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    games.forEach((game: any) => {
      const category = game.category || "Other Games";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(game);
    });
    return grouped;
  }, [games]);

  // Get all categories sorted
  const categories = useMemo(() => {
    return Object.keys(gamesByCategory).sort();
  }, [gamesByCategory]);

  if (isLoading) return <div className="text-white text-center py-20">Loading games...</div>;
  if (error) return <div className="text-white text-center py-20">Failed to load games</div>;

  return (
    <div className="text-white max-w-[1320px] mx-auto px-4 mt-20">
      {categories.map((category, categoryIndex) => {
        const categoryGames = gamesByCategory[category];
        
        return (
          <div key={category} className={categoryIndex > 0 ? "mt-20" : ""}>
            {/* Category Header */}
            <div className="mb-12 lg:flex items-center justify-between">
              <h1 className="text-3xl xl:text-5xl font-medium uppercase">
                {category.split(' ').map((word, idx) => 
                  idx === category.split(' ').length - 1 ? (
                    <span key={idx} className="text-[#FADA1B]">{word}</span>
                  ) : (
                    <span key={idx}>{word} </span>
                  )
                )}
              </h1>
            </div>

            {/* Games Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-6">
              {categoryGames.map((game, index) => {
                const spanClass = index < 3 ? "xl:col-span-4" : "xl:col-span-6";

                // Map API data to component props
                const mappedGame = {
                  title: game.name,
                  items: "Delivery in minutes",
                  description: `Top up ${game.name} few minutes. Publisher: ${game.publisher}`,
                  image: game.image,
                  url: `/games/${game._id}`
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
      })}
    </div>
  );
}
