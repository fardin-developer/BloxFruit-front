"use client";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm/CheckoutForm";
import UpiCheckout from "@/components/CheckoutForm/UpiCheckout";

const stripePromise = loadStripe(
  'pk_test_51PylxMEutx1ydWq1n1MswnBHTlsEuuZzJxZzDIZOPV0tqvhbqiiZI443twXhWN1yNnegA2jXSGHpq3POrwMY2jRQ00RrEFv8fT'
);

const CheckoutPage = () => {
  return (
    <div className="w-full text-white flex items-center justify-center px-4 py-10 rounded-2xl fade-in">
        <UpiCheckout />
    </div>
  );
};

export default CheckoutPage;
