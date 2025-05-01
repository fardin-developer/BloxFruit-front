import React from "react";
import {
  FaDiscord,
  FaInstagram,
  FaTwitter,
  FaFacebook,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className=" text-white px-6 py-10 mt-8 border-t border-[#e4e4e414]">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2 mb-4">
            <img src="/logo.svg" alt="logo" className="" />
          </div>
          <div className="flex space-x-4 text-lg text-white">
            <FaFacebook />
            <FaInstagram />
            <FaTwitter />
            <FaDiscord />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Newsletter */}
          <div>
            <p className="mb-3">Don’t miss our latest News</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Email address"
                className="bg-[#191a23] text-white px-4 py-2 rounded-l-md w-full outline-none"
              />
              <button
                type="submit"
                className="bg-yellow-400 text-black px-4 py-2 rounded-r-md font-semibold"
              >
                Subscribe
              </button>
            </form>
            <div className="text-xs text-gray-400 mt-4">
              <p>
                <span className="font-bold">GAMIA IS A PROJECT FROM</span>{" "}
                <span className="text-yellow-400">INOVATION INC.</span>
              </p>
              <p className="mt-2">
                Nothing on this website constitutes financial advice. Always
                consult a qualified financial advisor before making purchases.
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-3">Social Media</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#">Discord</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <a href="#">FAQ</a>
              </li>
            </ul>
          </div>

          {/* All Pages */}
          <div>
            <h3 className="font-semibold mb-3">All Pages</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#">Home</a>
              </li>
              <li>
                <a href="#">Store</a>
              </li>
              <li>
                <a href="#">Checkout</a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold mb-3">Products</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#">Blox Fruits</a>
              </li>
              <li>
                <a href="#">Blue Lock Rivals</a>
              </li>
              <li>
                <a href="#">Rivals</a>
              </li>
              <li>
                <a href="#">Combat Warrior</a>
              </li>
              <li>
                <a href="#">Anime Reborn</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-[#e4e4e414] mt-10 pt-5 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="space-x-4 mb-3 md:mb-0">
          <a href="#">Privacy Policy</a>
          <a href="#">TOS</a>
          <a href="#">Cookies Policy</a>
        </div>
        <p className="mt-4 md:mt-0">© 2025 Rivals. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
