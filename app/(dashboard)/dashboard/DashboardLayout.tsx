"use client";
import React, { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import logo from "@/public/logo.svg";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineUsers } from "react-icons/hi2";
import { PiHospitalThin } from "react-icons/pi";
import { CgNotes } from "react-icons/cg";
import { RiSettingsLine } from "react-icons/ri";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { on } from "events";
import { LiaProceduresSolid } from "react-icons/lia";
import { TbSocial } from "react-icons/tb";

// Menu and Bottom items
const menuItems = [
  { href: "/dashboard", icon: <RxDashboard size={18} />, label: "Overview" },
  {
    href: "/dashboard/products",
    icon: <HiOutlineUsers size={18} />,
    label: "Products",
  },
  { href: "/dashboard/Orders", icon: <LiaProceduresSolid  size={18} />, label: "Orders" },
  { href: "/dashboard/others", icon: <TbSocial size={18} />, label: "Others" },
];

const bottomMenu = [
  {
    href: "/dashboard/settings",
    icon: <RiSettingsLine size={18} />,
    label: "Settings",
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  const TopBar = () => {
    const currentPage =
      [...menuItems]
        .sort((a, b) => b.href.length - a.href.length)
        .find(
          (item) => pathname === item.href || pathname.startsWith(item.href)
        )?.label || "Dashboard";

    return (
      <div className="bg-[#080705] text-main p-4 flex items-center justify-between border-b border-[#191817]">
        <div className="font-semibold text-yellow-400 text-2xl">{currentPage}</div>
      </div>
    );
  };

  return (
    <div className="flex bg-[#080705] min-h-screen">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/20 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed z-30 h-screen w-64 transform bg-[#080705] border-r border-[#191817] transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center py-8 pl-12">
          <Link href="/">
            <Image src={logo} alt="logo" width={100} height={100} className="w-full" />
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="mt-4 px-4">
          {menuItems.map((item, index) => {
            const isActive = (() => {
              if (item.href === "/dashboard") {
                return pathname === "/dashboard";
              }
              return pathname.startsWith(item.href);
            })();
            return (
              <div className="mb-2" key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center text-base font-medium px-4 py-3 rounded-md gap-1 ${
                    isActive
                      ? "grad-btn hover:brightness-150 duration-300 font-bold hover:font-extrabold"
                      : "text-yellow-400 hover:text-black hover:bg-[#fada1b] duration-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </div>
            );
          })}
        </nav>

        {/* Bottom menu */}
        <div className="absolute bottom-0 w-full">
          {bottomMenu.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <div className="px-2 py-1" key={index}>
                <Link
                  href={item.href}
                  className={`flex items-center text-base font-medium px-4 py-3 rounded-md gap-1 ${
                    isActive
                      ? "grad-btn hover:brightness-150 duration-300 font-bold hover:font-extrabold"
                      : "text-yellow-400 hover:text-black hover:bg-[#fada1b] duration-300"
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </div>
            );
          })}
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              <Image
                className="w-10 h-10 rounded-full"
                src=""
                width={40}
                height={40}
                alt="User"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm text-[#fada1b] font-medium">John Doe</p>
              <p className="text-xs text-[#fada1b]">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:ml-64">
        <div className="p-4 lg:hidden">
          <button
            onClick={toggleSidebar}
            className="text-[#fada1b] focus:outline-none"
          >
            <HiOutlineMenuAlt1 size={26} />
          </button>
        </div>
        <TopBar />
        <div className="p-4 text-white">{children}</div>
      </div>
    </div>
  );
}