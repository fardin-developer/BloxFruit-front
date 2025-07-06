import React from "react";
import cardBg from "@/public/mainCardImages/card-bg.png";
import typeRare from "@/public/mainCardImages/type-rare.png";
import typeLegendary from "@/public/mainCardImages/type-legendary.png";
import typeUncommon from "@/public/mainCardImages/type-uncommon.png";
import typeMythical from "@/public/mainCardImages/type-mythical.png";
import typeCommon from "@/public/mainCardImages/type-common.png";
import "./MainCard.css";
import Image from "next/image";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { TbShoppingCart } from "react-icons/tb";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/app/store/slices/cartSlice";
import { toast } from "sonner";
import { RootState } from "@/app/store/store";

const MainCard = ({ data }: { data: any }) => {
  const {id, category, imageUrl, discountPrice, regularPrice, name, type } = data;
  // console.log(data);

  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  
  // Check if product is already in cart
  const isInCart = cartItems.some(item => item.id === id);

  const buyNow = () => {
    if (isInCart) {
      toast.info("Product already in cart! Check your cart to proceed.")
    } else {
      toast.info("Please add to cart first")
    }
  }

  // Styles based on type
  const typeStyles: any = {
    rare: {
      bg: "bg-rare",
      borderColor: "#6BCA4A",
      typeImage: typeRare,
      buttonClass: "bg-gradient-to-l to-green-400 from-white text-gray-700 ",
    },
    legendary: {
      bg: "bg-legendary",
      borderColor: "#CB2086",
      typeImage: typeLegendary,
      buttonClass: "bg-gradient-to-l to-[#CB2086] from-white text-gray-700",
    },
    uncommon: {
      bg: "bg-uncommon",
      borderColor: "#24b1cd",
      typeImage: typeUncommon,
      buttonClass: "bg-gradient-to-l to-[#1FB6CB] from-white text-gray-700",
    },
    mythical: {
      bg: "bg-mythical",
      borderColor: "#9C0600",
      typeImage: typeMythical,
      buttonClass: "bg-gradient-to-l to-[#C0241C] from-white text-gray-700",
    },
    common: {
      bg: "bg-common",
      borderColor: "#fada1b",
      typeImage: typeCommon,
      buttonClass: "bg-gradient-to-l to-[#FADA1B] from-white text-gray-700",
    },
  };

  const currentStyle = typeStyles[type] || typeStyles["common"];

  const handleAddToCart = () => {
    if (isInCart) {
      toast.info("Product already in cart! Check your cart to proceed.")
    } else {
      dispatch(
        addToCart({
          id: id,
          name: name,
          price: discountPrice ? discountPrice : regularPrice,
          image: imageUrl,
          quantity: 1,
        })
      )
      toast.success("Added to cart")
    }
  }

  return (
    <div
      className={`rounded-xl ${currentStyle.bg} p-3 shadow-xl transition-all text-white group bg-[#1a1a1a]`}
    >
      <div
        className="relative lg:h-56 rounded-xl overflow-hidden"
        style={{
          border: `1px solid ${currentStyle.borderColor}`,
        }}
      >
        {/* Type badge */}
        <div className="absolute top-2 left-3 z-10">
          <Image
            src={currentStyle.typeImage}
            alt="type badge"
            width={400}
            height={400}
            className="h-11 w-fit relative z-10"
          />
        </div>

        {/* Background texture */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-color-burn"
          style={{
            backgroundImage: `url(${cardBg.src})`,
          }}
        ></div>

        {/* Shadow + Main image */}
        <div className="relative ">
          <img
            crossOrigin="anonymous"
            src={imageUrl}
            alt="Shadow"
            width={400}
            height={400}
            className="absolute top-1/2 -translate-y-1/2 aspect-3/4  left-1/2 -translate-x-1/2 w-64 h-64 object-cover blur-lg opacity-0 group-hover:opacity-100 transition-all duration-300"
          />
          <img
            crossOrigin="anonymous"
            src={imageUrl}
            alt="Main"
            width={400}
            height={400}
            className="relative z-0 transition-all duration-300 group-hover:scale-105 mt-4 aspect-3/2"
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-3">
        <p className="text-sm mb-2 text-[#9D99AD] capitalize">{category}</p>
        <div className="flex items-center gap-1">
          <h2 className="text-lg text-white font-bold">{name}</h2>
          <RiVerifiedBadgeFill className="text-[#1d96ff]" />
        </div>
        <hr className="mt-2 my-4 border rgb-border" />
        <div className="flex justify-between">
          <div className="space-y-2">
            <p className="text-xs text-[#9D99AD]">Regular Price</p>
            <h2 className={`text-lg text-white ${discountPrice ? "line-through" : ""}`}>₹{regularPrice}</h2>
          </div>
          {
            discountPrice && (
              <div className="space-y-2">
                <p className="text-xs text-[#9D99AD]">Discount Price</p>
                <h2 className="text-lg text-white">₹{discountPrice}</h2>
              </div>
            )
          }
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center gap-2">
          <button
            className={`${currentStyle.buttonClass}  py-3 w-full rounded-sm font-bold cursor-pointer active:scale-95 duration-200 hover:brightness-150`}
            onClick={buyNow}
          >
            Buy now
          </button>
          <button onClick={handleAddToCart} className="p-3.5 bg-white/10 rounded-sm cursor-pointer">
            <TbShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainCard;
