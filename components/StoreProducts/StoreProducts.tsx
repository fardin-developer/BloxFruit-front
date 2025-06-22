"use client";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { IoMdArrowDropdown, IoMdClose } from "react-icons/io";
import MainCard from "../ui/MainCard/MainCard";
import CartSidebar from "./CartSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import FilterCard from "../ui/FilterCard/FilterCard";
import { useGetProductsQuery } from "@/app/store/api/services/productApi";
import Loading from "../Loading/Loading";
import image1 from "@/public/cardsImage/ourgames.png";
import image2 from "@/public/cardsImage/ourgames2.png";
import image3 from "@/public/cardsImage/ourgames3.jpg";
import image4 from "@/public/cardsImage/ourgames4.png";
import image5 from "@/public/cardsImage/ourgames5.png";

const sort = [
  { value: "All", label: "All" },
  { value: "new", label: "New" },
  { value: "old", label: "Old" },
];

const items = [
  { name: "Permanent Fruits", href: "#PermanentFruits" },
  { name: "Gamepass", href: "#Gamepass" },
  { name: "Others section", href: "#OthersSection" },
];

const gameNames = [
  {
    name: "Blox Fruits",
    description: "Blox Fruits are one of the four main ways to.",
    image: image1,
    gameId: "blox-fruits"
  },
  {
    name: "Blue Lock Rivals",
    description: "Blue Lock Rivals, a free-to-play Roblox game.",
    image: image2,
    gameId: "blue-lock-rivals"
  },
  {
    name: "Rivals",
    description: "RIVALS is a first-person shooter game on",
    image: image3,
    gameId: "rivals"
  },
  {
    name: "Combat Warrior",
    description:
      "Combat Warriors is a fighting experience. Players compete and fight.",
    image: image3,
    gameId: "combat-warrior"
  },
  {
    name: "Anime Reborn",
    description:
      "Anime Reborn refers to two different things: a popular tower defense game.",
    image: image4,
    gameId: "anime-reborn"
  },
];

export default function StoreProducts() {
  const [activeSection, setActiveSection] = useState("Permanent Fruits");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select one");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Add new filter states
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 1000]);
  const [selectedGames, setSelectedGames] = useState<string[]>(["blox-fruits"]);

  const { data: products, isLoading } = useGetProductsQuery(null);

  // Sort function
  const sortProducts = (products: any[], sortType: string) => {
    if (!products) return [];

    const sortedProducts = [...products];
    if (sortType === "new") {
      return sortedProducts.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } else if (sortType === "old") {
      return sortedProducts.sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    }
    return sortedProducts;
  };

  // Filter function
  const filterProducts = (products: any[]) => {
    return products.filter((product) => {
      // Filter by rarity
      if (
        selectedRarities.length > 0 &&
        !selectedRarities.includes(product.type)
      ) {
        return false;
      }

      // Filter by price range
      const price = parseFloat(product.regularPrice);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Filter by game (using games_name field)
      if (selectedGames.length > 0 && !selectedGames.includes(product.games_name)) {
        return false;
      }

      return true;
    });
  };

  // Apply filters and sorting to each category (only for Blox Fruits)
  const permanentData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "permanent" && item.games_name === "blox-fruits"
    );
    const filteredProducts = filterProducts(filtered || []);
    return sortProducts(
      filteredProducts,
      selected === "new" ? "new" : selected === "old" ? "old" : ""
    );
  }, [products, selectedRarities, priceRange, selectedGames, selected]);

  const gamepassData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "gamepass" && item.games_name === "blox-fruits"
    );
    const filteredProducts = filterProducts(filtered || []);
    return sortProducts(
      filteredProducts,
      selected === "new" ? "new" : selected === "old" ? "old" : ""
    );
  }, [products, selectedRarities, priceRange, selectedGames, selected]);

  const othersData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "others" && item.games_name === "blox-fruits"
    );
    const filteredProducts = filterProducts(filtered || []);
    return sortProducts(
      filteredProducts,
      selected === "new" ? "new" : selected === "old" ? "old" : ""
    );
  }, [products, selectedRarities, priceRange, selectedGames, selected]);

  // Get data for other games (non-Blox Fruits)
  const otherGamesData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.games_name !== "blox-fruits" && selectedGames.includes(item.games_name)
    );
    const filteredProducts = filterProducts(filtered || []);
    return sortProducts(
      filteredProducts,
      selected === "new" ? "new" : selected === "old" ? "old" : ""
    );
  }, [products, selectedRarities, priceRange, selectedGames, selected]);

  // Check if Blox Fruits is selected
  const isBloxFruitsSelected = selectedGames.includes("blox-fruits");
  const hasOtherGamesSelected = selectedGames.some(game => game !== "blox-fruits");

  // Handle game selection (single selection only)
  const handleGameChange = (gameId: string) => {
    setSelectedGames([gameId]); // Only select one game at a time
  };

  // Handle rarity selection
  const handleRarityChange = (rarity: string) => {
    setSelectedRarities((prev) =>
      prev.includes(rarity)
        ? prev.filter((r) => r !== rarity)
        : [...prev, rarity]
    );
  };

  // Handle price range change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange((prev) => [prev[0], value]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedRarities([]);
    setPriceRange([1, 1000]);
    setSelectedGames(["blox-fruits"]); 
    setSelected("Select one");
  };

  useEffect(() => {
    // Only observe sections when Blox Fruits is selected
    if (isBloxFruitsSelected) {
      const sections = document.querySelectorAll("section");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const sectionTitle = entry.target.getAttribute("data-title");
              if (sectionTitle) setActiveSection(sectionTitle);
            }
          });
        },
        {
          threshold: 0.5,
          rootMargin: "0px 0px -40% 0px",
        }
      );
      sections.forEach((section) => observer.observe(section));
      return () => sections.forEach((section) => observer.unobserve(section));
    } else {
      // Reset active section when not showing Blox Fruits sections
      setActiveSection("Permanent Fruits");
    }
  }, [isBloxFruitsSelected]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 ">
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-[#FADA1B] text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2"
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

        {/* Game List */}
        <div className="space-y-3 h-[30vh] overflow-y-auto custom-scroll pr-2 ">
          {gameNames.map((item, index) => (
            <FilterCard 
              key={index} 
              data={item} 
              isSelected={selectedGames.includes(item.gameId)}
              onToggle={() => handleGameChange(item.gameId)}
            />
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="bg-[#0c0c09] p-4 rounded-lg">
          <h3 className="text-base font-semibold mb-3">Rarity</h3>
          <div className="space-y-2 text-base">
            {["Common", "Uncommon", "Rare", "Legendary", "Mythical"].map(
              (rarity, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="accent-[#FADA1B] w-4 h-4"
                    checked={selectedRarities.includes(rarity.toLowerCase())}
                    onChange={() => handleRarityChange(rarity.toLowerCase())}
                  />
                  <span
                    className={
                      selectedRarities.includes(rarity.toLowerCase())
                        ? "text-[#FADA1B]"
                        : ""
                    }
                  >
                    {rarity}
                  </span>
                </label>
              )
            )}
          </div>
        </div>

        {/* Price Range */}
        <div className="bg-[#0c0c09] p-4 rounded-lg">
          <h3 className="text-sm font-semibold mb-3">Price Range</h3>
          <input
            type="range"
            className="w-full accent-[#FADA1B]"
            min={1}
            max={1000}
            value={priceRange[1]}
            onChange={handlePriceRangeChange}
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className={`w-full ${cartItems.length > 0 ? "lg:w-[60%]" : ""}`}>
        <div className="sticky top-4 z-10 bg-[#0a0a09] flex justify-between flex-col md:flex-row gap-4 md:gap-0 p-4 md:p-0">
          <div className="flex gap-4 text-white">
            {items.map((item, index) => {
              const isActive = activeSection === item.name;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="relative px-2 md:px-10 py-2.5 border-x border-transparent text-center group overflow-hidden"
                >
                  {isActive && (
                    <div className="absolute border-x border-[#FBDE6E] inset-0 bg-[#fdfdfd00] backdrop-blur-[1px] z-0" />
                  )}
                  <span
                    className={`relative z-10 block text-xs xl:text-lg ${
                      isActive ? "text-[#FBDE6E]" : "text-white/60"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-20 h-3 bg-[#f7d54f] blur-sm rounded-full z-0" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-36 h-[1px] bg-yellow-500 rounded-full z-10" />
                    </>
                  )}
                </a>
              );
            })}
          </div>
          <div className="flex items-center gap-2.5 pr-2">
            <div className="relative z-10 w-36 text-white bg-gradient-to-l from-[#4a45291f] to-[#fad81b41] p-[1px] rounded-sm">
              <button
                className="text-xs px-2 sm:text-sm xl:text-lg w-full flex justify-between items-center rounded-sm bg-[#0a0a09] selects-border cursor-pointer  duration-300"
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
                  {["Select one", ...sort.map((s) => s.label)].map((label) => (
                    <li
                      key={label}
                      className={`text-xs sm:text-sm xl:text-lg p-1 bg-[#0a0a09] hover:text-[#0a0a09]  cursor-pointer capitalize  ${
                        selected === label
                          ? "bg-[#FADA1B] text-[#0a0a09]"
                          : "hover:bg-[#FADA1B] "
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

        {/* Sections */}
        {isBloxFruitsSelected && (
          <>
            <section
              id="PermanentFruits"
              data-title="Permanent Fruits"
              className="mb-24 scroll-mt-16"
            >
              <h2 className="text-[2.5rem] font-semibold mb-4">
                <span className="bg-gradient-to-l from-white via-[#FADA1B] to-[#FADA1B] text-transparent bg-clip-text">
                  Permanent Fruits
                </span>
              </h2>
              {isLoading ? (
                <Loading />
              ) : (
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 ${
                    cartItems.length > 0 ? "lg:grid-cols-2" : "xl:grid-cols-4"
                  }`}
                >
                  {permanentData.length > 0 ? (
                    permanentData?.map((item: any, index: number) => (
                      <MainCard key={index} data={item} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-96 w-full col-span-full">
                      <h2 className="text-2xl font-semibold text-white text-center">
                        No data found
                      </h2>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section
              id="Gamepass"
              data-title="Gamepass"
              className="mb-24 scroll-mt-16"
            >
              <h2 className="text-[2.5rem] font-semibold mb-4">
                <span className="bg-gradient-to-l from-white via-[#FADA1B] to-[#FADA1B] text-transparent bg-clip-text">
                  Gamepass
                </span>
              </h2>
              {isLoading ? (
                <Loading />
              ) : (
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 ${
                    cartItems.length > 0 ? "lg:grid-cols-2" : "xl:grid-cols-4"
                  }`}
                >
                  {gamepassData.length > 0 ? (
                    gamepassData?.map((item: any, index: number) => (
                      <MainCard key={index} data={item} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-96 w-full col-span-full">
                      <h2 className="text-2xl font-semibold text-white text-center">
                        No data found
                      </h2>
                    </div>
                  )}
                </div>
              )}
            </section>

            <section
              id="OthersSection"
              data-title="Others section"
              className="scroll-mt-16 h-screen"
            >
              <h2 className="text-[2.5rem] font-semibold mb-4">
                <span className="bg-gradient-to-l from-white via-[#FADA1B] to-[#FADA1B] text-transparent bg-clip-text">
                  Others section
                </span>
              </h2>
              {isLoading ? (
                <Loading />
              ) : (
                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 ${
                    cartItems.length > 0 ? "lg:grid-cols-2" : "xl:grid-cols-4"
                  }`}
                >
                  {othersData.length > 0 ? (
                    othersData?.map((item: any, index: number) => (
                      <MainCard key={index} data={item} />
                    ))
                  ) : (
                    <div className="flex justify-center items-center h-96 w-full col-span-full">
                      <h2 className="text-2xl font-semibold text-white text-center">
                        No data found
                      </h2>
                    </div>
                  )}
                </div>
              )}
            </section>
          </>
        )}

        {/* Other Games Section */}
        {hasOtherGamesSelected && (
          <section className="mb-24 scroll-mt-16">
            <h2 className="text-[2.5rem] font-semibold mb-4">
              <span className="bg-gradient-to-l from-white via-[#FADA1B] to-[#FADA1B] text-transparent bg-clip-text">
                Other Games
              </span>
            </h2>
            {isLoading ? (
              <Loading />
            ) : (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 ${
                  cartItems.length > 0 ? "lg:grid-cols-2" : "xl:grid-cols-4"
                }`}
              >
                {otherGamesData.length > 0 ? (
                  otherGamesData?.map((item: any, index: number) => (
                    <MainCard key={index} data={item} />
                  ))
                ) : (
                  <div className="flex justify-center items-center h-96 w-full col-span-full">
                    <h2 className="text-2xl font-semibold text-white text-center">
                      No data found
                    </h2>
                  </div>
                )}
              </div>
            )}
          </section>
        )}
      </main>
      <aside
        className={`lg:sticky top-4 z-40 w-full lg:w-80 xl:w-[20%] h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6 ${
          cartItems.length > 0 ? "block transition-all duration-300" : "hidden"
        }`}
      >
        <CartSidebar />
      </aside>
    </div>
  );
}
