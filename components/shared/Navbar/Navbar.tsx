"use client";
import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { IoMdArrowDropdown } from "react-icons/io";
import { TbShoppingBag } from "react-icons/tb";
import us from "@/public/images/Flag_of_India.svg";
import Link from "next/link";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/store/store";
import { HiCurrencyDollar } from "react-icons/hi";
import { PiCurrencyInrFill } from "react-icons/pi";
import { User, Wallet, Plus, X } from "lucide-react";
import { useGetMeQuery } from "@/app/store/api/services/AuthApi";
import { setCredentials } from "@/app/store/slices/authSlice";
import { useAddBalanceMutation } from "@/app/store/api/services/transactionApi";
import { toast } from "sonner";

const Navbar = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
  const [addBalanceAmount, setAddBalanceAmount] = useState("");
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();
  
  // Add balance mutation
  const [addBalance, { isLoading: isAddingBalance }] = useAddBalanceMutation();

  // Fetch user data including wallet balance
  const { data: apiUser } = useGetMeQuery(undefined, {
    skip: !token,
  });

  // Update Redux store when API returns fresh data
  useEffect(() => {
    if (apiUser && token) {
      dispatch(setCredentials({ user: apiUser, token }));
    }
  }, [apiUser, token, dispatch]);

  // Use API user data if available, otherwise use stored user
  const currentUser = apiUser || user;

  // Quick amounts for add balance
  const quickAmounts = [100, 500, 1000, 2000, 5000];

  // Handle add balance
  const handleAddBalance = async () => {
    const amount = parseFloat(addBalanceAmount);
    
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (amount < 1) {
      toast.error("Minimum amount is ₹1");
      return;
    }

    try {
      const redirectUrl = `${window.location.origin}/payment-success`;
      const result = await addBalance({ amount, redirectUrl }).unwrap();
      
      if (result.success && result.transaction.paymentUrl) {
        toast.success("Redirecting to payment gateway...");
        // Redirect to payment URL
        window.location.href = result.transaction.paymentUrl;
      } else {
        toast.error("Failed to create payment request");
      }
    } catch (error: any) {
      console.error("Add balance error:", error);
      toast.error(error?.data?.message || "Failed to add balance. Please try again.");
    }
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Store", href: "/gamestore" },
    ...(pathname === "/cart" ? [{ name: "Cart", href: "/cart" }] : []),
    ...(pathname === "/checkout" ? [{ name: "Checkout", href: "/checkout" }] : []),
  ];

  return (
    <nav className="sticky lg:static top-0 z-50 bg-[#080705] border-b border-[#e4e4e414] ">
      <div className="text-white max-w-[1616px] mx-auto px-4  py-6 flex items-center justify-between">
        <div className="flex items-center space-x-14">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo.svg" alt="Logo" width={183} height={52} />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex text-base font-medium">
            {navItems.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={`relative px-8 py-2.5 border-x border-transparent text-center group overflow-hidden`}
                >
                  {/* Active background */}
                  {isActive && (
                    <div className="absolute border-x border-[#FBDE6E] inset-0 bg-[#fdfdfd00] backdrop-blur-[1px] z-0" />
                  )}
                  <span
                    className={`relative z-10 block text-lg ${isActive ? "text-[#FBDE6E]" : "text-opacity-60"
                      }`}
                  >
                    {item.name}
                  </span>

                  {/* Glow and underline */}
                  {isActive && (
                    <>
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-[70%] h-3 bg-[#f7d54f] blur-sm rounded-full z-0" />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-yellow-500 rounded-full z-10" />
                    </>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right - Icons, Cart, Currency */}
        <div className="flex items-center space-x-4">
          <a href="https://wa.me/message/ZMPZGV6FSTCSF1" target="_blank" className="text-green-500 text-xl">
            <FaWhatsapp size={48} />
          </a>

          {/* <div
            onClick={() => router.push("/cart")}
            className="flex justify-center items-center rounded-full bg-gradient-to-l to-[#FADA1B] from-[#FFF] w-12 h-12 cursor-pointer"
          >
            <div className="relative">
              <TbShoppingBag size={24} className="text-black/70 text-xl" />
              <span className="absolute -top-1 -right-1 bg-[#772DFF] text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                {cartItems.length}
              </span>
            </div>
          </div> */}

          <div className="hidden xl:flex mr-8">
            <div className="relative bg-gradient-to-l to-[#080705] via-[#3d3d3d] from-[#3d3d3d] flex items-center px-4 py-2 pr-12">
              {/* <HiCurrencyDollar size={24} className="text-yellow-500 mr-2" /> */}
              <PiCurrencyInrFill size={24} className="text-yellow-500 mr-2" />
              <span className="text-white text-sm font-semibold mr-1">INR</span>
              <IoMdArrowDropdown size={24} className="text-white" />
              <Image
                src={us}
                alt="US Flag"
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full absolute -right-4 drop-shadow-[0_0_3px_rgba(255,255,0,0.7)]"
              />
            </div>
          </div>

          {/* Wallet Balance Display */}
          {currentUser && (
            <div 
              onClick={() => router.push("/wallet-history")}
              className="hidden xl:flex items-center bg-gradient-to-l to-[#080705] via-[#3d3d3d] from-[#3d3d3d] px-4 py-2 rounded-md mr-4 cursor-pointer hover:brightness-110 transition-all"
              title="View wallet history"
            >
              <Wallet size={20} className="text-yellow-500 mr-2" />
              <span className="text-white text-sm font-semibold">
                ₹{currentUser.walletBalance?.toFixed(2) || "0.00"}
              </span>
            </div>
          )}

          {pathname !== "/gamestore" && (
            currentUser ? (
              <div
                onClick={() => router.push("/profile")}
                className="hidden xl:flex items-center justify-center rounded-full bg-gradient-to-l to-[#FADA1B] from-[#FFF] w-12 h-12 cursor-pointer ml-4"
              >
                {currentUser.profilePicture ? (
                  <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <User size={24} className="text-black/70" />
                )}
              </div>
            ) : (
              <button
                onClick={() => router.push("/login")}
                className="hidden xl:flex items-center grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer duration-300 hover:brightness-150"
              >
                Login
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
            )
          )}

          {/* Mobile Toggle */}
          <div className="xl:hidden">
            <button
              onClick={() => setMenuOpen(true)}
              className="text-white text-3xl focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-[#080705] transform transition-transform duration-300 ease-in-out z-50 ${menuOpen ? "translate-x-0" : "translate-x-full"
          } xl:hidden`}
      >
        <div className="flex justify-end items-center px-4 py-[33px] border-b border-gray-800">
          <button
            onClick={() => setMenuOpen(false)}
            className="text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="px-4 py-6 space-y-4">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 text-lg font-medium ${pathname === item.href ? "text-yellow-400" : "text-white"
                }`}
            >
              {item.name}
            </Link>
          ))}

          {currentUser && (
            <>
              {/* Wallet Balance in Mobile Menu */}
              <div className="flex items-center justify-between bg-gradient-to-l to-[#080705] via-[#3d3d3d] from-[#3d3d3d] px-4 py-3 rounded-md mt-4">
                <div className="flex items-center">
                  <Wallet size={20} className="text-yellow-500 mr-2" />
                  <span className="text-white text-sm font-semibold">
                    Wallet: ₹{currentUser.walletBalance?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setShowAddBalanceModal(true);
                  }}
                  className="bg-[#fada1b] p-1.5 rounded-full text-black hover:bg-[#eac31a] transition-colors flex items-center justify-center"
                  title="Add Money"
                >
                  <Plus size={16} strokeWidth={3} />
                </button>
              </div>

              <div className="border-t border-gray-700 pt-4 mt-4">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 text-lg font-medium ${pathname === "/profile" ? "text-yellow-400" : "text-white"
                    }`}
                >
                  Profile
                </Link>
                <Link
                  href="/order-history"
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 text-lg font-medium ${pathname === "/order-history" ? "text-yellow-400" : "text-white"
                    }`}
                >
                  Order History
                </Link>
                <Link
                  href="/wallet-history"
                  onClick={() => setMenuOpen(false)}
                  className={`block py-2 text-lg font-medium ${pathname === "/wallet-history" ? "text-yellow-400" : "text-white"
                    }`}
                >
                  Wallet History
                </Link>
              </div>
            </>
          )}

          {!currentUser && (
            <button
              onClick={() => {
                setMenuOpen(false);
                router.push("/login");
              }}
              className="w-full grad-btn hover:opacity-90 text-black px-8 py-3 font-medium text-base cursor-pointer duration-300 hover:brightness-150 mt-4"
            >
              Login
            </button>
          )}

          <div className="flex items-center justify-between bg-gradient-to-l to-[#080705] via-[#3d3d3d] from-[#3d3d3d] px-4 py-2 rounded-md mt-6">
            {/* <HiCurrencyDollar size={24} className="text-yellow-500 mr-2" /> */}
            <PiCurrencyInrFill size={24} className="text-yellow-500 mr-2" />
            <span className="text-white text-sm font-semibold mr-1">INR</span>
            <Image
              src={us}
              alt="US Flag"
              width={48}
              height={48}
              className="w-10 h-10 object-cover rounded-full drop-shadow-[0_0_3px_rgba(255,255,0,0.7)]"
            />
          </div>
        </div>
      </div>

      {/* Add Balance Modal */}
      {showAddBalanceModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="card-bg border border-[#333] rounded-lg shadow-xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowAddBalanceModal(false);
                setAddBalanceAmount("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-white mb-2">Add Balance</h2>
            <p className="text-gray-400 mb-6">Enter the amount you want to add to your wallet</p>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                value={addBalanceAmount}
                onChange={(e) => setAddBalanceAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="1"
                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fada1b] text-lg"
              />
              <p className="text-xs text-gray-500 mt-2">Minimum amount: ₹1</p>
            </div>

            {/* Quick Amount Buttons */}
            <div className="mb-6">
              <p className="text-sm font-medium text-gray-300 mb-3">Quick Select</p>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setAddBalanceAmount(amount.toString())}
                    className="px-4 py-2 border border-[#333] bg-[#1a1a1a] text-gray-300 rounded-lg hover:bg-[#fada1b]/10 hover:border-[#fada1b] hover:text-[#fada1b] transition-colors font-medium"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddBalanceModal(false);
                  setAddBalanceAmount("");
                }}
                className="flex-1 px-4 py-3 border border-[#333] bg-[#1a1a1a] text-gray-300 rounded-lg font-medium hover:bg-[#333] transition-colors"
                disabled={isAddingBalance}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBalance}
                disabled={isAddingBalance || !addBalanceAmount}
                className="flex-1 px-4 py-3 grad-btn text-black rounded-lg font-bold hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAddingBalance ? "Processing..." : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
