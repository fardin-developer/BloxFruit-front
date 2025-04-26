import React from "react";
import { FaDiscord } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { BsCartFill } from "react-icons/bs";
import { MdOutlineArrowForward } from "react-icons/md";
import Link from "next/link";
import { TbShoppingBag } from "react-icons/tb";

const Navbar = () => {
  return (
    <nav className="bg-[#080705]">
      <div className=" text-white container mx-auto px-4 md:px-8 py-6 flex items-center justify-between ">
        <div className=" flex items-center space-x-14">
          {/* Logo */}
          <Link href="/" className="flex items-center ">
            <img src="/logo.svg" alt="Logo" className="" />
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex text-base font-medium">
            <a
              href="#"
              className=" relative bg-red-100/10 backdrop-blur-3xl  text-[#FBDE6E] border-x-1 border-[#FBDE6E] py-2.5 px-8"
            >
              Home
              
            </a>
            <a
              href="#"
              className="text-[#FBDE6E] border-x-1 border-[#FBDE6E] py-2.5 px-8"
            >
              Store
            </a>
            <a
              href="#"
              className="text-[#FBDE6E] border-x-1 border-[#FBDE6E] py-2.5 px-8"
            >
              Checkout
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <a href="#" className="text-[#5865F2] text-xl">
            <FaDiscord size={48} />
          </a>

          <div className="flex justify-center items-center rounded-full bg-gradient-to-l to-[#FADA1B] from-[#FFF] w-12 h-12">
            <div className="relative">
              <TbShoppingBag size={24} className="text-black/70 text-xl" />
              <span className="absolute -top-1 -right-1 bg-[#772DFF] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                24
              </span>
            </div>
          </div>

          <div className="w-[145px] mr-8">
            <div className="relative bg-gradient-to-l to-[#080705] via-[#3d3d3d] from-[#3d3d3d] flex items-center px-4 py-2">
              <span className="text-yellow-300 mr-1">US Dollar</span>
              <IoIosArrowDown className="text-yellow-300" />
              <img
                src="/images/us.png"
                alt="US Flag"
                className="w-12 h-12 rounded-full absolute -right-4"
              />
            </div>
          </div>

          <button className="flex items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer ">
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
    </nav>
  );
};

export default Navbar;
