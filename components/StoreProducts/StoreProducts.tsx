"use client";
import Image from "next/image";
import React, { useEffect, useState, useMemo } from "react";
import { IoMdArrowDropdown } from "react-icons/io";
import MainCard from "../ui/MainCard/MainCard";
import CartSidebar from "./CartSidebar";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import FilterCard from "../ui/FilterCard/FilterCard";
import { useGetProductsQuery } from "@/app/store/api/services/productApi";
import Loading from "../Loading/Loading";

const categories = [
  { value: "All", label: "All" },
  { value: "new", label: "New" },
  { value: "old", label: "Old" },
];

const items = [
  { name: "Permanent Fruits", href: "#PermanentFruits" },
  { name: "Gamepass", href: "#Gamepass" },
  { name: "Others section", href: "#OthersSection" },
];

export default function StoreProducts() {
  const [activeSection, setActiveSection] = useState("Permanent Fruits");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select one");

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Add new filter states
  const [selectedRarities, setSelectedRarities] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([1, 11110]);
  const [selectedGames, setSelectedGames] = useState<string[]>([]);

  const { data: products, isLoading } = useGetProductsQuery(null);

  // Filter function
  const filterProducts = (products: any[]) => {
    return products.filter((product) => {
      // Filter by rarity
      if (selectedRarities.length > 0 && !selectedRarities.includes(product.type)) {
        return false;
      }

      // Filter by price range
      const price = parseFloat(product.regularPrice);
      if (price < priceRange[0] || price > priceRange[1]) {
        return false;
      }

      // Filter by game (if implemented)
      if (selectedGames.length > 0 && !selectedGames.includes(product.game)) {
        return false;
      }

      return true;
    });
  };

  // Apply filters to each category
  const permanentData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "permanent"
    );
    return filterProducts(filtered || []);
  }, [products, selectedRarities, priceRange, selectedGames]);

  const gamepassData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "gamepass"
    );
    return filterProducts(filtered || []);
  }, [products, selectedRarities, priceRange, selectedGames]);

  const othersData = useMemo(() => {
    const filtered = products?.data?.filter(
      (item: any) => item.category === "others"
    );
    return filterProducts(filtered || []);
  }, [products, selectedRarities, priceRange, selectedGames]);

  // Handle rarity selection
  const handleRarityChange = (rarity: string) => {
    setSelectedRarities(prev => 
      prev.includes(rarity)
        ? prev.filter(r => r !== rarity)
        : [...prev, rarity]
    );
  };

  // Handle price range change
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => [prev[0], value]);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedRarities([]);
    setPriceRange([1, 11110]);
    setSelectedGames([]);
    setSelected("Select one");
  };

  useEffect(() => {
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
  }, []);

  return (
    <div className="flex flex-col lg:flex-row  gap-6">
      {/* Sidebar */}
      <aside
        className={`lg:sticky -top-[71px] z-10 w-full lg:w-80  h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6 ${
          cartItems.length > 0 ? "xl:w-[20%]" : "xl:w-[30%]"
        }`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button 
            onClick={clearAllFilters}
            className="text-[#FADA1B] text-sm hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Game List */}
        <div className="space-y-3 h-[30vh] overflow-y-auto custom-scroll ">
          {[...Array(6)].map((_, i) => (
            <FilterCard key={i} />
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
                  <span className={selectedRarities.includes(rarity.toLowerCase()) ? "text-[#FADA1B]" : ""}>
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
        <div className="sticky top-4 z-10 bg-[#0a0a09] flex justify-between">
          <div className="flex gap-4 text-white">
            {items.map((item, index) => {
              const isActive = activeSection === item.name;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="relative px-10 py-2.5 border-x border-transparent text-center group overflow-hidden"
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
                  {["Select one", ...categories.map((s) => s.label)].map(
                    (label) => (
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
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
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
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 ${
                cartItems.length > 0 ? "lg:grid-cols-3" : "xl:grid-cols-4"
              }`}
            >
              {permanentData?.map((item: any, index: number) => (
                <MainCard key={index} data={item} />
              ))}
            </div>
          )}
        </section>

        <section
          id="Gamepass"
          data-title="Gamepass"
          className="mb-24 scroll-mt-16 h-screen"
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
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 ${
                cartItems.length > 0 ? "lg:grid-cols-3" : "xl:grid-cols-4"
              }`}
            >
              {gamepassData?.map((item: any, index: number) => (
                <MainCard key={index} data={item} />
              ))}
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
              className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 ${
                cartItems.length > 0 ? "lg:grid-cols-3" : "xl:grid-cols-4"
              }`}
            >
              {othersData?.map((item: any, index: number) => (
                <MainCard key={index} data={item} />
              ))}
            </div>
          )}
        </section>
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
