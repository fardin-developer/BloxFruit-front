"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React, { useState, useMemo } from "react";
import { useGetOrdersQuery } from "@/app/store/api/services/orderApi";
import OrderDetailsModal from "./OrderDetailsModal";
import Pagination from "@/components/ui/Pagination/Pagination";
import { FaSearch } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import dayjs from "dayjs";

const OrdersList = () => {
  const { data: orders, isLoading, refetch } = useGetOrdersQuery(null);
  const ordersData = orders?.data;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");

  console.log("ordersData", ordersData);

  const formatStatus = (status: string) => {
    if (status === "pending" || status === "PENDING") {
      return (
        <p className="bg-yellow-500 text-black font-bold px-4 py-2 text-center">
          Unpaid
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

  const dateTime = (date: string) => {
    return dayjs(date).format("DD MMM YYYY, hh:mm A");
  };

  const allFormattedData = useMemo(() => {
    if (!ordersData) return [];
    return ordersData.map((item: any) => ({
      ...item,
      status: formatStatus(item.status),
      amount: formatAmount(item.amount),
      created_at: dateTime(item.created_at),
    }));
  }, [ordersData]);

  const filteredData = useMemo(() => {
    let filtered = allFormattedData;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order: any) => {
        const originalStatus = ordersData?.find((o: any) => o.id === order.id)?.status?.toLowerCase();
        if (statusFilter === "completed") {
          return originalStatus === "completed";
        } else if (statusFilter === "pending") {
          return originalStatus === "pending";
        }
        return true;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((order: any) =>
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [allFormattedData, searchTerm, statusFilter, ordersData]);

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: "all" | "completed" | "pending") => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const columns: TableColumn[] = [
    { key: "customer_email", label: "Customer Email", type: "text" },
    { key: "customer_name", label: "Roblox Username", type: "text" },
    { key: "customer_phone", label: "Customer Phone", type: "text" },
    { key: "created_at", label: "Order Date & Time", type: "text" },
    { key: "amount", label: "Total Amount", type: "text" },
    { key: "status", label: "Payment Status", type: "text" },
    { key: "order_delivery", label: "Order Status", type: "text" },
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
    <div className="relative">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#fada1d]">Orders List</h1>

        {/* Search Input */}
        <div className="relative max-w-md w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by Roblox username or email..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full px-4 py-3 pl-12 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] border border-[#fad91d67] focus:outline-none focus:border-[#fada1d] text-[#fada1d] placeholder-[#fada1d]/60  transition-all duration-300"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#fada1d]/60" />
          </div>
        </div>
      </div>

      {/* Status Filter Buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => handleStatusFilterChange("all")}
          className={`px-6 py-2 font-semibold transition-all duration-300 ${
            statusFilter === "all"
              ? "bg-[#fada1d] text-black"
              : "bg-gradient-to-l to-[#fada1b26] from-[#594d0026] border border-[#fad91d67] text-[#fada1d] hover:bg-[#fada1d]/20"
          }`}
        >
          All Orders
        </button>
        <button
          onClick={() => handleStatusFilterChange("completed")}
          className={`px-6 py-2 font-semibold transition-all duration-300 ${
            statusFilter === "completed"
              ? "bg-green-500 text-black"
              : "bg-gradient-to-l to-[#fada1b26] from-[#594d0026] border border-[#fad91d67] text-[#fada1d] hover:bg-green-500/20"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => handleStatusFilterChange("pending")}
          className={`px-6 py-2 font-semibold transition-all duration-300 ${
            statusFilter === "pending"
              ? "bg-yellow-500 text-black"
              : "bg-gradient-to-l to-[#fada1b26] from-[#594d0026] border border-[#fad91d67] text-[#fada1d] hover:bg-yellow-500/20"
          }`}
        >
          Pending
        </button>
      </div>

      {/* Search Results Info */}
      {(searchTerm || statusFilter !== "all") && (
        <div className="mb-4 p-3 bg-gradient-to-l to-[#fada1b26] from-[#594d0026] border border-[#fad91d67] rounded-lg">
          <p className="text-[#fada1d] text-sm">
            Found <span className="font-bold">{totalItems}</span> order{totalItems !== 1 ? "s" : ""}
            {statusFilter !== "all" && (
              <span> with status: <span className="font-bold capitalize">{statusFilter}</span></span>
            )}
            {searchTerm && (
              <span> matching "<span className="font-bold">{searchTerm}</span>"</span>
            )}
          </p>
        </div>
      )}

      <DynamicTable
        columns={columns}
        data={currentPageData}
        actions={tableActions}
        loading={isLoading}
      />

      {/* Pagination */}
      {!isLoading && totalItems > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}

      {/* No Results Message */}
      {!isLoading && totalItems === 0 && (
        <div className="text-center py-8">
          <p className="text-[#fada1d] text-lg">
            No orders found
            {statusFilter !== "all" && ` with status: ${statusFilter}`}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
            }}
            className="mt-2 text-[#fada1d]/80 hover:text-[#fada1d] underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsModalOpen(false)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default OrdersList;