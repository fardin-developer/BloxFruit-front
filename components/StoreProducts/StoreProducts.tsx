"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IoIosArrowDown, IoMdArrowDropdown } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import CartCard from "../ui/CartCard/CartCard";
import MainCard from "../ui/MainCard/MainCard";
const items = [
  { name: "Permanent Fruits", href: "#PermanentFruits" },
  { name: "Gamepass", href: "#Gamepass" },
  { name: "Others section", href: "#OthersSection" },
];

const categories = [
  { value: "All", label: "All" },
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "old", label: "Old" },
];

export default function StoreProducts() {
  const [data, setData] = useState([]);
  const [activeSection, setActiveSection] = useState("Permanent Fruits");
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("Select one");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

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
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/data.json");
      const data = await response.json();
      setData(data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row  gap-6">
      {/* Sidebar */}
      <aside className="lg:sticky top-4 z-10 w-full lg:w-80 xl:w-[20%] h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6">
        {/* Filter header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Filter</h2>
          <button className="text-[#FADA1B] text-sm hover:underline">
            Clear All
          </button>
        </div>

        {/* Game List */}
        <div className="space-y-3 ">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="flex items-center bg-[#0c0c09] gap-3 p-4 rounded-md cursor-pointer transition-all border border-transparent hover:border-[#FADA1B]"
            >
              <Image
                src="/cardsImage/ourgames2.png"
                alt="Game"
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="flex">
                <div className="flex-1">
                  <p className="text-lg font-medium">Game Name</p>
                  <p className="text-sm text-gray-400 leading-tight">
                    Use all your skills to command an astonishing...
                  </p>
                </div>
                <p className="text-sm text-[#FADA1B] whitespace-nowrap">
                  15 items
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rarity Filter */}
        <div className="bg-[#0c0c09] p-4 rounded-lg">
          <h3 className="text-base font-semibold mb-3">Rarity</h3>
          <div className="space-y-2 text-base">
            {["Common", "Uncommon", "Rare", "Legendary", "Mythical"].map(
              (rarity, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input type="checkbox" className="accent-[#FADA1B]" />
                  <span className={rarity === "Common" ? "text-[#FADA1B]" : ""}>
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
          <input type="range" className="w-full accent-[#FADA1B]" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$1</span>
            <span>$11110</span>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="w-full lg:w-[60%]">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {data.map((item, index) => (
              <MainCard key={index} data={item} />
            ))}
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center text-white">
              card here
            </div>
          </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center text-white">
              card here
            </div>
          </div>
        </section>
      </main>
      <aside className="lg:sticky top-4 z-40 w-full lg:w-80 xl:w-[20%] h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6">
        <div>
          <div className="text-white flex justify-between items-center mb-4">
            <p className="flex gap-3 items-center">
              <IoCart size={24} /> Cart
            </p>
            <button className="text-[#FADA1B] text-sm hover:underline">
              Clear All
            </button>
          </div>
          {/* Cart Card */}
          <div className="space-y-4">
            <CartCard />
            <CartCard />
            <CartCard />
            <CartCard />
          </div>
        </div>
        {/* Checkout */}
        <div>
          <div className="flex justify-between items-center my-5">
            <p className="text-[#FADA1B]">Total</p>
            <p>$120</p>
          </div>
          <button className="w-full flex justify-center items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer duration-300 hover:brightness-150">
            Checkout
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
      </aside>
    </div>
  );
}
