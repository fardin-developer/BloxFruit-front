"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
const items = [
  { name: "Permanent Fruits", href: "#PermanentFruits" },
  { name: "Gamepass", href: "#Gamepass" },
  { name: "Others section", href: "#OthersSection" },
];

export default function StoreProducts() {
  const [activeSection, setActiveSection] = useState("Permanent Fruits");

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
      <aside className="sticky top-4 z-10 w-full lg:w-96 h-fit bg-[#090807] border border-[#3b3b3b] text-white rounded-lg p-4 space-y-6">
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
        <div className="border-t border-gray-800 pt-4">
          <h3 className="text-sm font-semibold mb-3">Price Range</h3>
          <input type="range" className="w-full accent-[#FADA1B]" />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>$1</span>
            <span>$11110</span>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="w-full lg:w-3/4">
        <div className="sticky top-4 z-10 bg-[#0a0a09] flex justify-between">
          <div className="flex gap-4 text-white mb-8">
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
                    className={`relative z-10 block text-lg ${
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
          <div className="">
            hello
          </div>
        </div>

        {/* Sections */}
        <section
          id="PermanentFruits"
          data-title="Permanent Fruits"
          className="mb-24 scroll-mt-20 h-screen"
        >
          <h2 className="text-[2.5rem] font-semibold mb-4">
            <span className="bg-gradient-to-l from-white via-[#FADA1B] to-[#FADA1B] text-transparent bg-clip-text">
              Permanent Fruits
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="h-32 bg-gray-800 rounded-lg flex items-center justify-center text-white">
              card here
            </div>
          </div>
        </section>

        <section
          id="Gamepass"
          data-title="Gamepass"
          className="mb-24 scroll-mt-20 h-screen"
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
          className="scroll-mt-20 h-screen"
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
    </div>
  );
}
