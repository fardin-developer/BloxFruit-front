"use client";
import Image from "next/image";
import React, { useState, useMemo } from "react";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import CartSidebar from "./CartSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import FilterCard from "../ui/FilterCard/FilterCard";
import { useGetAllGamesQuery } from "@/app/store/api/services/GameApi";
import Loading from "../Loading/Loading";
import Link from "next/link";

export default function StoreProducts() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("High to Low");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Filter states
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const { data, isLoading } = useGetAllGamesQuery();
  const games = data?.games || [];

  // Extract all unique categories from games
  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    games.forEach((game: any) => {
      if (game.category) {
        categories.add(game.category);
      }
    });
    return Array.from(categories).sort();
  }, [games]);

  // Get category image (first game's image in that category)
  const getCategoryImage = (category: string) => {
    const firstGame = games.find((game: any) => game.category === category);
    return firstGame?.image || "";
  };

  // Create category filter data
  const categoryFilterData = useMemo(() => {
    return allCategories.map((category) => ({
      name: category,
      description: `Browse ${category} games`,
      image: getCategoryImage(category),
      gameId: category,
    }));
  }, [allCategories, games]);

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = [...games];

    // Filter by category
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((game: any) =>
        selectedCategories.includes(game.category)
      );
    }

    // Sort by name (A-Z or Z-A based on selected sort)
    if (selected === "High to Low") {
      filtered.sort((a: any, b: any) => b.name.localeCompare(a.name));
    } else if (selected === "Low to High") {
      filtered.sort((a: any, b: any) => a.name.localeCompare(b.name));
    }

    return filtered;
  }, [games, selectedCategories, selected]);

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelected("High to Low");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="lg:hidden fixed bottom-4 left-4 z-50 bg-[#FADA1B] text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
      >
        <span>Filter</span>
        <IoMdArrowDropdown
          size={20}
          className={`transform duration-300 ${
            isFilterOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Sidebar */}
      <aside
        className={`lg:sticky top-4 z-10 w-full lg:w-80 h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6  
          ${cartItems.length > 0 ? "xl:w-[20%]" : "xl:w-[30%]"}
          ${isFilterOpen ? "fixed inset-0 z-50 lg:relative" : "hidden lg:block"}
        `}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filter</h2>
          <div className="flex items-center gap-4">
            <button
              onClick={clearAllFilters}
              className="text-[#FADA1B] text-sm hover:underline"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="lg:hidden text-white text-sm hover:text-[#FADA1B]"
            >
              <IoMdClose size={24} />
            </button>
          </div>
        </div>

        {/* Category List */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scroll pr-2">
          <h3 className="text-base font-semibold mb-3">Categories</h3>
          {categoryFilterData.length > 0 ? (
            categoryFilterData.map((item, index) => (
              <FilterCard
                key={index}
                data={item}
                isSelected={selectedCategories.includes(item.gameId)}
                onToggle={() => handleCategoryChange(item.gameId)}
              />
            ))
          ) : (
            <p className="text-gray-400 text-sm">No categories available</p>
          )}
        </div>
      </aside>

      {/* Games Grid */}
      <main className={`w-full ${cartItems.length > 0 ? "lg:w-[60%]" : ""}`}>
        {/* Sort Dropdown */}
        <div className="sticky top-24 md:top-4 z-40 bg-[#0a0a09] flex justify-between items-center p-4 md:p-0 mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            All Games
          </h2>
          <div className="flex items-center gap-2.5">
            <div className="relative z-10 w-36 text-white bg-gradient-to-l from-[#4a45291f] to-[#fad81b41] p-[1px] rounded-sm">
              <button
                className="text-xs px-2 sm:text-sm w-full flex justify-between items-center rounded-sm bg-[#0a0a09] selects-border cursor-pointer duration-300"
                onClick={() => setIsOpen(!isOpen)}
              >
                {selected}
                <IoMdArrowDropdown
                  size={24}
                  className={`text-xs sm:text-sm xl:text-lg duration-300 transform ${
                    isOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              <div
                className={`absolute drop-shadow-[0_0_2px_rgba(255,255,0,0.7)] mt-1 w-full scrollbar-hide transition-all duration-300 ease-linear overflow-hidden 
                  ${
                    isOpen
                      ? "opacity-100 max-h-[420px] scale-y-100"
                      : "opacity-100 max-h-0 scale-y-95"
                  }`}
              >
                <ul>
                  {["Select one", "High to Low", "Low to High"].map((label) => (
                    <li
                      key={label}
                      className={`text-xs sm:text-sm p-1 bg-[#0a0a09] hover:text-[#0a0a09] cursor-pointer capitalize ${
                        selected === label
                          ? "bg-[#FADA1B] text-[#0a0a09]"
                          : "hover:bg-[#FADA1B]"
                      }`}
                      onClick={() => {
                        setSelected(label);
                        setIsOpen(false);
                      }}
                    >
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        {isLoading ? (
          <Loading />
        ) : (
          <div
            className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${
              cartItems.length > 0 ? "lg:grid-cols-2 xl:grid-cols-3" : ""
            }`}
          >
            {filteredGames.length > 0 ? (
              filteredGames.map((game: any) => (
                <Link
                  key={game._id}
                  href={`/games/${game._id}`}
                  className="group relative bg-[#090807] border border-[#3b3b3b] rounded-lg overflow-hidden hover:border-[#FADA1B] transition-all duration-300"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={game.image}
                      alt={game.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                      {game.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-2 line-clamp-1">
                      {game.publisher}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#FADA1B] text-xs font-medium px-2 py-1 bg-[#FADA1B]/10 rounded">
                        {game.category || "Game"}
                      </span>
                      <span className="text-white text-sm">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="flex justify-center items-center h-96 w-full col-span-full">
                <h2 className="text-2xl font-semibold text-white text-center">
                  No games found
                </h2>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cart Sidebar */}
      <aside
        className={`lg:sticky top-4 z-40 w-full lg:w-80 xl:w-[20%] h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6 ${
          cartItems.length > 0
            ? "transition-all duration-300 hidden lg:block"
            : "hidden"
        }`}
      >
        <CartSidebar />
      </aside>
    </div>
  );
}
