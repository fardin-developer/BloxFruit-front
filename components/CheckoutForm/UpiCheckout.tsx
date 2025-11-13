//components/CheckoutForm/UpiCheckout.tsx;
"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import bannerbackground from "@/public/images/bannerbackground.png";
import { useSearchParams } from "next/navigation";
import { useCreatePaymentIntentMutation } from "@/app/store/api/services/paymentApi";
import { useCreatePaypalPaymentMutation } from "@/app/store/api/services/paypalPaymentApi";
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
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'paypal'>('paypal');

  const [createPaymentIntent, { isLoading: isLoadingPayment }] = useCreatePaymentIntentMutation();
  const [createPaypalPayment, { isLoading: isLoadingPaypal }] = useCreatePaypalPaymentMutation();

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

    try {
      if (paymentMethod === 'paypal') {
        payload.description = "PAYPAL"+ payload.description;
        const response = await createPaypalPayment(payload).unwrap();
        if (response.success) {
          window.location.replace(response.data.approval_url);
          dispatch(clearCart());
        } else {
          toast.error("Failed to create PayPal payment. Please try again.");
        }
      } else {
        const response = await createPaymentIntent(payload).unwrap();
        if (response.success) {
          window.location.replace(response.data.paymentUrl);
          dispatch(clearCart());
        } else {
          toast.error("Failed to create payment intent. Please try again.");
        }
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Payment failed. Please try again.");
    }
  };

  const isLoading = isLoadingPayment || isLoadingPaypal;

  return (
    <div
      className="max-w-[1320px] mx-auto text-white flex items-center justify-center bg-cover bg-center relative "
      style={{
        backgroundImage: `url(${bannerbackground.src})`,
      }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>
      <div className="w-full bg-[#0a0a0a00] p-8 sm:p-10-lg shadow-lg space-y-8 z-20">
        <h2 className="text-[1.2rem] sm:text-[2.5rem] font-medium text-center bg-gradient-to-r from-yellow-400 to-yellow-100 text-transparent bg-clip-text tracking-wide uppercase">
          Express Checkout
        </h2>

        {/* Total Amount Display */}
        <div className="text-center mb-8">
          <p className="text-lg text-[#FADA1B]">Total Amount to Pay</p>
          <p className="text-3xl font-bold text-white">₹{total}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="space-y-4 mb-8">
          <h3 className="text-lg font-semibold text-white">Choose Payment Method</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {/* PayPal Option */}
            <div 
              className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                paymentMethod === 'paypal' 
                  ? 'border-[#FADA1B] bg-gradient-to-r from-yellow-400/10 to-yellow-100/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setPaymentMethod('paypal')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'paypal' ? 'bg-[#FADA1B] border-[#FADA1B]' : 'border-gray-400'
                }`}>
                  {paymentMethod === 'paypal' && (
                    <div className="w-2 h-2 bg-black rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.28A.859.859 0 0 1 5.792 1.6h6.018c1.97 0 3.425.394 4.328 1.175.897.775 1.354 1.87 1.354 3.249 0 .678-.075 1.313-.224 1.882-.149.568-.37 1.09-.657 1.551-.287.46-.644.867-1.06 1.208-.416.342-.896.628-1.426.849-.53.221-1.117.391-1.746.507-.63.116-1.312.174-2.025.174H8.7l-.653 3.892 2.084-12.43h-1.26L7.076 21.337zM18.45 6.302c-.193 1.25-.69 2.235-1.479 2.929-.79.694-1.904 1.041-3.313 1.041H11.47l-.653 3.892h1.604c.742 0 1.39-.058 1.927-.174.537-.116.985-.286 1.331-.507.346-.221.624-.507.827-.849.203-.342.347-.734.427-1.175.08-.441.12-.939.12-1.491 0-.678-.134-1.267-.398-1.751-.264-.485-.651-.87-1.15-1.151-.499-.28-1.12-.42-1.844-.42h-.739l.375-2.235h1.604c1.409 0 2.523.347 3.313 1.041.79.694 1.286 1.679 1.479 2.929z" fill="#003087"/>
                    <path d="M6.908 21.337H2.302a.641.641 0 0 1-.633-.74L4.776 2.28A.859.859 0 0 1 5.624 1.6h6.018c1.97 0 3.425.394 4.328 1.175.897.775 1.354 1.87 1.354 3.249 0 .678-.075 1.313-.224 1.882-.149.568-.37 1.09-.657 1.551-.287.46-.644.867-1.06 1.208-.416.342-.896.628-1.426.849-.53.221-1.117.391-1.746.507-.63.116-1.312.174-2.025.174H8.532l-.653 3.892 1.916-11.43h-1.26L6.908 21.337z" fill="#0070BA"/>
                    <path d="M18.282 6.302c-.193 1.25-.69 2.235-1.479 2.929-.79.694-1.904 1.041-3.313 1.041H11.302l-.653 3.892h1.604c.742 0 1.39-.058 1.927-.174.537-.116.985-.286 1.331-.507.346-.221.624-.507.827-.849.203-.342.347-.734.427-1.175.08-.441.12-.939.12-1.491 0-.678-.134-1.267-.398-1.751-.264-.485-.651-.87-1.15-1.151-.499-.28-1.12-.42-1.844-.42h-.739l.375-2.235h1.604c1.409 0 2.523.347 3.313 1.041.79.694 1.286 1.679 1.479 2.929z" fill="#003087"/>
                  </svg>
                  <span className="text-white font-semibold">Pay with PayPal</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-2 ml-7">Secure payment with PayPal</p>
            </div>

            {/* UPI Option */}
            <div 
              className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                paymentMethod === 'upi' 
                  ? 'border-[#FADA1B] bg-gradient-to-r from-yellow-400/10 to-yellow-100/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onClick={() => setPaymentMethod('upi')}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-4 h-4 rounded-full border-2 ${
                  paymentMethod === 'upi' ? 'bg-[#FADA1B] border-[#FADA1B]' : 'border-gray-400'
                }`}>
                  {paymentMethod === 'upi' && (
                    <div className="w-2 h-2 bg-black rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#4CAF50"/>
                  </svg>
                  <span className="text-white font-semibold">Pay with UPI</span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-2 ml-7">Quick UPI payment</p>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <hr className="w-full rgb-border scale-x-[-1]" />
          <p className="text-lg text-white font-medium px-2 uppercase">Payment Details</p>
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
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] text-yellow-400 placeholder-yellow-400 outline-none"
              />
            </div>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Contact
              </label>
              <input
                {...register("email", { required: true })}
                placeholder="Enter your email here"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] text-yellow-400 placeholder-yellow-400 outline-none"
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
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] text-white placeholder-gray-300 outline-none"
              />
            </div>
            <div className="sm:flex items-center">
              <label className="block text-sm font-semibold w-52 sm:pl-6 py-[17.5px] sm:border-b rgb-border-checkout">
                Mobile Number
              </label>
              <input
                {...register("phone", { required: true })}
                placeholder="Enter your mobile number here"
                className="w-full px-4 py-4 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] text-white placeholder-gray-300 outline-none"
              />
            </div>
          </div>
          
          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center font-bold grad-btn hover:opacity-90 text-black px-8 py-3 text-base cursor-pointer duration-300 hover:brightness-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : `Pay ₹${total} ${paymentMethod === 'paypal' ? 'with PayPal' : 'with UPI'}`}
            {!isLoading && (
              paymentMethod === 'paypal' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 2.28A.859.859 0 0 1 5.792 1.6h6.018c1.97 0 3.425.394 4.328 1.175.897.775 1.354 1.87 1.354 3.249 0 .678-.075 1.313-.224 1.882-.149.568-.37 1.09-.657 1.551-.287.46-.644.867-1.06 1.208-.416.342-.896.628-1.426.849-.53.221-1.117.391-1.746.507-.63.116-1.312.174-2.025.174H8.7l-.653 3.892 2.084-12.43h-1.26L7.076 21.337z" fill="currentColor"/>
                </svg>
              ) : (
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
              )
            )}
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