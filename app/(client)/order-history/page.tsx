"use client";

import { useState } from "react";
import { useGetOrderHistoryQuery } from "@/app/store/api/services/orderApi";
import dayjs from "dayjs";

export default function OrderHistoryPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString();
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString());

    const { data, isLoading, error, refetch } = useGetOrderHistoryQuery({
        page,
        limit,
        startDate,
        endDate,
    });

    const handleApplyFilters = () => {
        refetch();
    };

    const handleResetFilters = () => {
        const newEndDate = new Date();
        const newStartDate = new Date();
        newStartDate.setMonth(newStartDate.getMonth() - 1);
        
        setStartDate(newStartDate.toISOString());
        setEndDate(newEndDate.toISOString());
        setPage(1);
        setLimit(10);
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "completed":
            case "delivered":
                return "text-green-400 bg-green-400/10";
            case "initiated":
            case "processing":
                return "text-blue-400 bg-blue-400/10";
            case "pending":
                return "text-yellow-400 bg-yellow-400/10";
            case "failed":
            case "cancelled":
                return "text-red-400 bg-red-400/10";
            default:
                return "text-gray-400 bg-gray-400/10";
        }
    };

    const parseDescription = (description: string) => {
        try {
            return JSON.parse(description);
        } catch {
            return { text: description };
        }
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="card-bg border border-[#ffffff1a] rounded-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-white mb-6">
                        Order History
                    </h1>

                    {/* Filters Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Start Date
                            </label>
                            <input
                                type="datetime-local"
                                value={dayjs(startDate).format("YYYY-MM-DDTHH:mm")}
                                onChange={(e) =>
                                    setStartDate(new Date(e.target.value).toISOString())
                                }
                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#fada1b] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                End Date
                            </label>
                            <input
                                type="datetime-local"
                                value={dayjs(endDate).format("YYYY-MM-DDTHH:mm")}
                                onChange={(e) =>
                                    setEndDate(new Date(e.target.value).toISOString())
                                }
                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#fada1b] focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Items Per Page
                            </label>
                            <select
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                                className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#fada1b] focus:border-transparent"
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={20}>20</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="flex items-end gap-2">
                            <button
                                onClick={handleApplyFilters}
                                className="flex-1 grad-btn text-black font-bold px-4 py-2 hover:opacity-90 transition-opacity"
                            >
                                Apply
                            </button>
                            <button
                                onClick={handleResetFilters}
                                className="flex-1 bg-[#333] text-white px-4 py-2 rounded-md hover:bg-[#444] transition-colors border border-[#444]"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    {data && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Total Orders</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {data.pagination.totalOrders}
                                </p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Current Page</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {data.pagination.currentPage} / {data.pagination.totalPages}
                                </p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Showing</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {data.orders.length} items
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fada1b]"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-400">
                            Error loading orders. Please try again.
                        </p>
                    </div>
                )}

                {/* Orders List */}
                {data && !isLoading && (
                    <>
                        <div className="space-y-4 mb-6">
                            {data.orders.length === 0 ? (
                                <div className="card-bg border border-[#333] rounded-lg p-8 text-center">
                                    <p className="text-gray-400 text-lg">
                                        No orders found for the selected period.
                                    </p>
                                </div>
                            ) : (
                                data.orders.map((order) => {
                                    const description = parseDescription(order.description);
                                    return (
                                        <div
                                            key={order._id}
                                            className="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 hover:border-[#fada1b]/30 transition-all"
                                        >
                                            <div className="flex flex-col gap-4">
                                                {/* Header */}
                                                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 pb-4 border-b border-[#333]">
                                                    <div>
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <h3 className="text-lg font-semibold text-white">
                                                                {order.gameName}
                                                            </h3>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                    order.status
                                                                )}`}
                                                            >
                                                                {order.status.toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-400">
                                                            Order ID: <span className="font-medium text-gray-300">{order.orderId}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-white">
                                                            ₹{order.amount}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            {order.currency}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Order Details */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Order Type</p>
                                                        <p className="text-sm font-medium text-gray-300">
                                                            {order.orderType.replace(/_/g, " ")}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                                                        <p className="text-sm font-medium text-gray-300">
                                                            {order.paymentMethod.toUpperCase()}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Order Date</p>
                                                        <p className="text-sm font-medium text-gray-300">
                                                            {dayjs(order.createdAt).format("MMM DD, YYYY HH:mm")}
                                                        </p>
                                                    </div>
                                                    {description.playerId && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Player ID</p>
                                                            <p className="text-sm font-medium text-gray-300">
                                                                {description.playerId}
                                                            </p>
                                                        </div>
                                                    )}
                                                    {description.server && (
                                                        <div>
                                                            <p className="text-xs text-gray-500 mb-1">Server</p>
                                                            <p className="text-sm font-medium text-gray-300">
                                                                {description.server}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-1">Manual Order</p>
                                                        <p className="text-sm font-medium text-gray-300">
                                                            {order.manualOrder ? "Yes" : "No"}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Items */}
                                                {order.items && order.items.length > 0 && (
                                                    <div className="pt-4 border-t border-[#333]">
                                                        <p className="text-sm font-medium text-gray-300 mb-3">
                                                            Order Items:
                                                        </p>
                                                        <div className="space-y-2">
                                                            {order.items.map((item) => (
                                                                <div
                                                                    key={item._id}
                                                                    className="flex justify-between items-center bg-[#1a1a1a] p-3 rounded-md border border-[#333]"
                                                                >
                                                                    <div>
                                                                        <p className="text-sm font-medium text-white">
                                                                            {item.itemName}
                                                                        </p>
                                                                        <p className="text-xs text-gray-500">
                                                                            Quantity: {item.quantity}
                                                                        </p>
                                                                    </div>
                                                                    <p className="text-sm font-semibold text-white">
                                                                        ₹{item.price}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Description */}
                                                {description.text && (
                                                    <div className="pt-4 border-t border-[#333]">
                                                        <p className="text-xs text-gray-500 mb-1">Description</p>
                                                        <p className="text-sm text-gray-300">{description.text}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Pagination */}
                        {data.pagination.totalPages > 1 && (
                            <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-400">
                                        Page {data.pagination.currentPage} of{" "}
                                        {data.pagination.totalPages}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={!data.pagination.hasPrevPage}
                                            className="px-4 py-2 bg-[#333] text-gray-300 rounded-md hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex gap-1">
                                            {Array.from(
                                                { length: Math.min(5, data.pagination.totalPages) },
                                                (_, i) => {
                                                    const pageNum = i + 1;
                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => setPage(pageNum)}
                                                            className={`px-3 py-2 rounded-md transition-colors ${
                                                                page === pageNum
                                                                    ? "bg-[#fada1b] text-black font-bold"
                                                                    : "bg-[#333] text-gray-300 hover:bg-[#444]"
                                                            }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                }
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setPage((p) => p + 1)}
                                            disabled={!data.pagination.hasNextPage}
                                            className="px-4 py-2 bg-[#333] text-gray-300 rounded-md hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
