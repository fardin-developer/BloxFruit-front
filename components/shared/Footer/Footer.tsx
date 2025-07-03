"use client";
import React from "react";
import { FaDiscord, FaInstagram, FaTwitter, FaFacebook } from "react-icons/fa";
import Image from "next/image";
import logo from "@/public/logo.svg";
import { useSubscribeToEmailMutation } from "@/app/store/api/services/emailSubscriptionApi";
import { toast } from "sonner";
import Link from "next/link";

const Footer = () => {
  const [subscribeToEmail, { isLoading }] = useSubscribeToEmailMutation();

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    try {
      const response = await subscribeToEmail({ email }).unwrap();

      if (response.success) {
        toast.success("Email subscribed successfully");
      } else {
        toast.error("failed to subscribe");
      }
    } catch (error: any) {
      toast.error(error.data.message.message);
    }
  };
  return (
    <footer className=" text-white  border-t border-[#e4e4e414]">
      <div className="max-w-[1616px] mx-auto px-4 2 py-10">
        <div className="flex justify-between items-center mb-6 lg:mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <Image src={logo} alt="logo" width={183} height={52} className="" />
          </div>
          <div className="flex space-x-3 text-lg text-white">
            <a href="#">
              <FaFacebook size={24} />
            </a>
            <a href="#">
              <FaInstagram size={24} />
            </a>
            <a href="#">
              <FaTwitter size={24} />
            </a>
            <a href="#">
              <FaDiscord size={24} />
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Logo + Newsletter */}
          <div>
            <p className="mb-3 text-[1.5rem]">Don't miss our latest News</p>
            <form className="flex relative" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="Email address"
                className="bg-[#15131d] text-white p-3 rounded-lg w-full outline-none"
                name="email"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-sm bg-gradient-to-l to-[#FADA1B] from-[#FFF] text-black px-4 py-2 rounded-sm font-semibold cursor-pointer"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <div className="text-xs text-[#F0F0F0] mt-4">
              {/* <p className="mt-12 mb-6 ">
                <span className="">GAMIA IS A PROJECT FROM</span>{" "}
                <span className="bg-gradient-to-l to-[#FADA1B] from-[#FFF] bg-clip-text text-transparent">
                  INOVATION INC.
                </span>
              </p> */}
              <p className="text-sm ">
              Blox Fruit Hub is the premier marketplace for acquiring exclusive and high-quality Roblox items. Enjoy lightning-fast delivery, secure payments, and a trusted service that has helped thousands of gamers enhance their experience with the items they adore.
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-3">Social Media</h3>
            <ul className="space-y-8 text-gray-300">
              <li>
                <a href="#">Discord</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#faq">FAQ</a>
              </li>
            </ul>
          </div>

          {/* All Pages */}
          <div>
            <h3 className="font-semibold mb-3">All Pages</h3>
            <ul className="space-y-8 text-gray-300">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/gamestore">Store</Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-3">Products</h3>
            <ul className="space-y-8 text-gray-300">
              <li>
                <Link href="/gamestore">Blox Fruits</Link>
              </li>
              <li>
                <Link href="/gamestore">Blue Lock Rivals</Link>
              </li>
              <li>
                <Link href="/gamestore">Rivals</Link>
              </li>
              <li>
                <Link href="/gamestore">Combat Warrior</Link>
              </li>
              <li>
                <Link href="/gamestore">Anime Reborn</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#e4e4e414] mt-10 text-sm text-gray-500">
        <div className="max-w-[1616px] mx-auto py-5 flex flex-col md:flex-row justify-between items-center ">
          <div className="space-x-4 mb-3 md:mb-0">
            <a href="#">Privacy Policy</a>
            <a href="#">TOS</a>
            <a href="#">Cookies Policy</a>
          </div>
          <p className="mt-4 md:mt-0">© 2025 Rivals. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
