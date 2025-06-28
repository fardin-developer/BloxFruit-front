"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React, { useState } from "react";
import image from "@/public/mainCardImages/legendary.png";
import image2 from "@/public/mainCardImages/common.png";
import image3 from "@/public/mainCardImages/uncommon.png";
import { MdCheckCircle } from "react-icons/md";
import { useGetOrdersQuery } from "@/app/store/api/services/orderApi";

const OrdersList = () => {
  const { data: orders, isLoading } = useGetOrdersQuery(null);
  const ordersData = orders?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const items = ordersData?.map((item: any) => {
    return {
      customer_email: item.customer_email,
      customer_name: item.customer_name,
      customer_phone: item.customer_phone,
      created_at: new Date(item.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: item.status,
    };
  });

  const formatStatus = (status: string) => {
    if (status === "PENDING") {
      return (
        <p className="bg-yellow-500 text-black font-bold px-4 py-2 text-center">
          Pending
        </p>
      );
    } else if (status === "COMPLETED") {
      return (
        <p className="bg-green-500 text-black font-bold px-4 py-2 text-center">
          Completed
        </p>
      );
    } else if (status === "completed") {
      return (
        <p className="bg-green-500 text-black font-bold px-4 py-2 text-center">
          Completed
        </p>
      );
    }
    return status;
  };

  const formatData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => ({
      ...item,
      status: formatStatus(item.status),
    }));
  };

  const columns: TableColumn[] = [
    { key: "customer_email", label: "Customer Email", type: "text" },
    { key: "customer_name", label: "Roblox Username", type: "text" },
    { key: "customer_phone", label: "Customer Phone", type: "text" },
    { key: "created_at", label: "Order Date & Time", type: "text" },
    { key: "status", label: "Status", type: "text" },
  ];

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => {
            setSelectedOrder(row);
            setIsModalOpen(true);
          }}
          className="bg-[#80fa1d] hover:brightness-150 text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Details
        </button>
      </div>
    );
  };

  const Modal = ({ order, onClose }: { order: any; onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold">Order Details</h2>
        <p><strong>Email:</strong> {order.customer_email}</p>
        <p><strong>Username:</strong> {order.customer_name}</p>
        <p><strong>Phone:</strong> {order.customer_phone}</p>
        <p><strong>Order Date:</strong> {order.created_at}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <button
          onClick={onClose}
          className="bg-red-500 text-white py-1 px-4 mt-4 rounded"
        >
          Close
        </button>
      </div>
    </div>
  );

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      <DynamicTable
        columns={columns}
        data={formatData(ordersData)}
        actions={tableActions}
        loading={isLoading}
      />

      {/* Conditionally render the modal */}
      {isModalOpen && selectedOrder && (
        <Modal order={selectedOrder} onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default OrdersList;
