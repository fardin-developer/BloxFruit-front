import React from "react";
import { IoClose } from "react-icons/io5";

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
}) => {
  const orderItems = order?.items;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 ">
      <div className="bg-[#080705] p-6 rounded-lg shadow-lg max-w-4xl w-full relative border border-[#fada1d]">
        <h2 className="text-xl font-bold text-center uppercase text-[#fada1d]">
          Order Details
        </h2>
        <div>
          <p className="text-xl font-bold">
            <strong className="text-[#fada1d]">Roblox Username:</strong>{" "}
            {order?.customer_name}
          </p>
          {/* Order Items */}
          <div className="">
            <h3 className="text-lg font-bold uppercase text-[#fada1d] my-4">
              Order Items
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4 h-72 overflow-y-auto custom-scroll">
              {orderItems?.map((item: any) => (
                <div key={item?.id} className="pr-2">
                  <div className="bg-[#fada1d] text-black flex gap-2 border border-[#fada1d]">
                    <div className="bg-[#080705] p-2 flex items-center justify-center">
                      <img
                        crossOrigin="anonymous"
                        src={
                          process.env.NEXT_PUBLIC_IMAGE_URL +
                          item?.product?.image
                        }
                        alt=""
                        className="w-16 h-16 object-cover"
                      />
                    </div>
                    <div>
                      <p>
                        Game Name :{" "}
                        <span className=" font-bold capitalize">
                          {item?.product?.games_name}
                        </span>
                      </p>
                      <p>
                        Rarity :{" "}
                        <span className=" font-bold capitalize">
                          {item?.product?.type}
                        </span>
                      </p>
                      <p>
                        Quantity :{" "}
                        <span className=" font-bold text-center">
                          {item?.quantity}
                        </span>
                      </p>
                      <p>
                        Price :{" "}
                        <span className=" font-bold text-center">
                          ₹{item?.product?.regularPrice}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm font-bold text-gray-500">
              <strong className="text-red-500">Note:</strong> Once all the
              products have been delivered, click the 'Complete' button.{" "}
            </p>
            <button
              className={`bg-[#fada1d] mt-4 text-black font-bold px-4 py-2 hover:brightness-150 duration-300 cursor-pointer ${
                order?.order_delivery === "Pending"
                  ? "bg-red-500 text-white"
                  : "bg-green-500"
              }`}
            >
              {order?.order_delivery === "Pending"
                ? "Complete Order"
                : "Order Completed"}
            </button>
          </div>
        </div>
        <button
          onClick={onClose}
          className="bg-red-500 absolute top-5 right-5 text-white p-1 md:p-2 cursor-pointer"
        >
          <IoClose size={20} />
        </button>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
