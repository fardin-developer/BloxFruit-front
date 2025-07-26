"use client";
import { useForm } from "react-hook-form";
import bannerbackground from "@/public/images/bannerbackground.png";
import { useSearchParams } from "next/navigation";
import { useCreatePaymentIntentMutation } from "@/app/store/api/services/paymentApi";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { toast } from "sonner";
import { clearCart } from "@/app/store/slices/cartSlice";

interface UpiCheckoutProps {
  total: number;
  isLoading?: boolean;
  onSubmit: (data: any) => void;
}

const UpiCheckout = () => {
  const searchParams = useSearchParams();

  const [createPaymentIntent, { isLoading: isLoadingPayment }] =
    useCreatePaymentIntentMutation();

  const total = searchParams.get("total") || "0.00";
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data: any) => {

    const payload = {
    name: data.roblox_username,
    email: data.email,
    phone: data.phone,
    address: "none",  
    amount: total,  
    description: data.description || "",  
    notes: data.notes || "", 
    items: cartItems.map((item: any) => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };
    const response = await createPaymentIntent(payload).unwrap();
    if(response.success){
      window.location.replace(response.data.paymentUrl);
      dispatch(clearCart());
    } else {
      toast.error("Failed to create payment intent. Please try again.");
    }
  };

  return (
    <div
      className="max-w-[1320px] mx-auto text-white flex items-center justify-center bg-cover bg-center relative "
      style={{
        backgroundImage: `url(${bannerbackground.src})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="w-full  bg-[#0a0a0a00] p-8 sm:p-10-lg shadow-lg space-y-8 z-20">
        <h2 className="text-[1.2rem] sm:text-[2.5rem] font-medium text-center bg-gradient-to-r from-yellow-400 to-yellow-100 text-transparent bg-clip-text tracking-wide uppercase">
          Express Checkout
        </h2>

        {/* Total Amount Display */}
        <div className="text-center mb-8">
          <p className="text-lg text-[#FADA1B]">Total Amount to Pay</p>
          <p className="text-3xl font-bold text-white">₹{total}</p>
        </div>

        <div className="flex items-center">
          <hr className="w-full rgb-border scale-x-[-1]" />
          <p className="text-lg text-white font-medium px-2 uppercase">Or</p>
          <hr className="w-full rgb-border" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Client Info */}
          <div className="space-y-4 mb-10">
            <h1 className="text-lg">Client Information</h1>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Roblox Username
              </label>
              <input
                {...register("roblox_username", { required: true })}
                placeholder="Enter your username"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26]  from-[#594d0026] text-yellow-400 placeholder-yellow-400 outline-none"
              />
            </div>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Contact
              </label>
              <input
                {...register("email", { required: true })}
                placeholder="Enter your email here"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26]  from-[#594d0026] text-yellow-400 placeholder-yellow-400 outline-none"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4 mb-10">
            <h1 className="text-lg">Personal Information</h1>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Full Name
              </label>
              <input
                {...register("name", { required: true })}
                placeholder="Enter your full name here"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26]  from-[#594d0026] text-white placeholder-gray-300 outline-none"
              />
            </div>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Mobile Number
              </label>
              <input
                {...register("phone", { required: true })}
                placeholder="Enter your mobile number here"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26]  from-[#594d0026] text-white placeholder-gray-300 outline-none"
              />
            </div>
          </div>
          {/* Submit */}
          <button
            type="submit"
            className="w-full flex items-center justify-center font-bold grad-btn hover:opacity-90 text-black px-8 py-3  text-base cursor-pointer duration-300 hover:brightness-150"
          >
            {isLoadingPayment ? "Processing..." : `Pay ₹${total} Now`}
            {isLoadingPayment ? "": <svg
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
            </svg>}
          </button>
          <p className="text-xs text-center text-gray-400">
            Your info will be saved to a Shop account. By continuing, you agree
            to Shop's{" "}
            <a href="#" className="underline text-yellow-400">
              Terms of Service
            </a>{" "}
            and acknowledge the{" "}
            <a href="#" className="underline text-yellow-400">
              Privacy Policy
            </a>
            .
          </p>
        </form>
      </div>
    </div>
  );
};

export default UpiCheckout;
