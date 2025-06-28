"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React, { useState } from "react";
import { useGetOrdersQuery } from "@/app/store/api/services/orderApi";
import OrderDetailsModal from "./OrderDetailsModal";
import Pagination from "@/components/ui/Pagination/Pagination";

const OrdersList = () => {
  const { data: orders, isLoading } = useGetOrdersQuery(null);
  const ordersData = orders?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  console.log("ordersData", ordersData);

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
          Paid
        </p>
      );
    } else if (status === "completed") {
      return (
        <p className="bg-green-500 text-black font-bold px-4 py-2 text-center">
          Paid
        </p>
      );
    }
    return status;
  };

  const formatAmount = (amount: number) => {
    return `₹${amount}`;
  };

  const formatData = (data: any) => {
    if (!data) return [];
    return data.map((item: any) => ({
      ...item,
      status: formatStatus(item.status),
      amount: formatAmount(item.amount),
    }));
  };

  const totalItems = ordersData?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = ordersData?.slice(startIndex, endIndex) || [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn[] = [
    { key: "customer_email", label: "Customer Email", type: "text" },
    { key: "customer_name", label: "Roblox Username", type: "text" },
    { key: "customer_phone", label: "Customer Phone", type: "text" },
    { key: "created_at", label: "Order Date & Time", type: "text" },
    { key: "amount", label: "Total Amount", type: "text" },
    { key: "status", label: "Payment Status", type: "text" },
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

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      <DynamicTable
        columns={columns}
        data={formatData(currentPageData)}
        actions={tableActions}
        loading={isLoading}
      />

      {!isLoading && totalItems > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrdersList;
