"use client";

import { useState } from "react";
import { useGetTransactionHistoryQuery, useGetWalletLedgerQuery, useAddBalanceMutation } from "@/app/store/api/services/transactionApi";
import { useGetMeQuery } from "@/app/store/api/services/AuthApi";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import dayjs from "dayjs";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";

export default function WalletHistoryPage() {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [viewMode, setViewMode] = useState<"history" | "ledger">("history");
    const [showAddBalanceModal, setShowAddBalanceModal] = useState(false);
    const [addBalanceAmount, setAddBalanceAmount] = useState("");
    const [startDate, setStartDate] = useState(() => {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString();
    });
    const [endDate, setEndDate] = useState(() => new Date().toISOString());

    const { token, user: storedUser } = useSelector((state: RootState) => state.auth);
    
    // Fetch user data to get current wallet balance
    const { data: userData } = useGetMeQuery(undefined, {
        skip: !token,
    });

    const currentUser = userData || storedUser;
    const currentBalance = currentUser?.walletBalance || 0;

    const { data, isLoading, error, refetch } = useGetTransactionHistoryQuery({
        page,
        limit,
        startDate,
        endDate,
    });

    // Fetch wallet ledger data
    const { 
        data: ledgerData, 
        isLoading: ledgerLoading, 
        error: ledgerError, 
        refetch: refetchLedger 
    } = useGetWalletLedgerQuery({
        page,
        limit,
        startDate,
        endDate,
    });

    // Add balance mutation
    const [addBalance, { isLoading: isAddingBalance }] = useAddBalanceMutation();

    const handleApplyFilters = () => {
        refetch();
        refetchLedger();
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
            case "success":
            case "completed":
                return "text-green-400 bg-green-400/10";
            case "pending":
                return "text-yellow-400 bg-yellow-400/10";
            case "failed":
            case "cancelled":
                return "text-red-400 bg-red-400/10";
            default:
                return "text-gray-400 bg-gray-400/10";
        }
    };

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

    const quickAmounts = [100, 500, 1000, 2000, 5000];

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="card-bg border border-[#ffffff1a] rounded-lg p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                        <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">
                            Wallet {viewMode === "ledger" ? "Ledger" : "Transaction History"}
                        </h1>
                        
                        {/* View Mode Toggle */}
                        <div className="flex gap-2 bg-[#1a1a1a] p-1 rounded-lg border border-[#333]">
                            <button
                                onClick={() => setViewMode("history")}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    viewMode === "history"
                                        ? "bg-[#fada1b] text-black shadow-sm"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                History
                            </button>
                            <button
                                onClick={() => setViewMode("ledger")}
                                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                                    viewMode === "ledger"
                                        ? "bg-[#fada1b] text-black shadow-sm"
                                        : "text-gray-400 hover:text-white"
                                }`}
                            >
                                Ledger
                            </button>
                        </div>
                    </div>

                    {/* Current Balance Display */}
                    {currentUser && (
                        <div className="bg-gradient-to-r from-[#fada1b] to-[#bfa50f] rounded-lg p-6 mb-6 text-black">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-semibold mb-1 opacity-80">Current Wallet Balance</p>
                                    <p className="text-4xl font-extrabold">₹{currentBalance.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => setShowAddBalanceModal(true)}
                                    className="bg-black text-[#fada1b] px-6 py-3 rounded-lg font-bold hover:bg-gray-900 transition-colors flex items-center gap-2 shadow-lg border border-[#fada1b]"
                                >
                                    <Plus size={20} />
                                    Add Balance
                                </button>
                            </div>
                        </div>
                    )}

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
                    {viewMode === "history" && data && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Total Transactions</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {data.pagination.totalTransactions}
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
                                    {data.transactions.length} items
                                </p>
                            </div>
                        </div>
                    )}

                    {viewMode === "ledger" && ledgerData && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Total Entries</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {ledgerData.data.pagination.total}
                                </p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Current Page</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {ledgerData.data.pagination.page} / {ledgerData.data.pagination.pages}
                                </p>
                            </div>
                            <div className="bg-[#1a1a1a] border border-[#333] p-4 rounded-lg">
                                <p className="text-sm text-gray-400">Showing</p>
                                <p className="text-2xl font-bold text-[#fada1b]">
                                    {ledgerData.data.transactions.length} items
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {((viewMode === "history" && isLoading) || (viewMode === "ledger" && ledgerLoading)) && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fada1b]"></div>
                    </div>
                )}

                {/* Error State */}
                {((viewMode === "history" && error) || (viewMode === "ledger" && ledgerError)) && (
                    <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
                        <p className="text-red-400">
                            Error loading {viewMode === "history" ? "transactions" : "ledger"}. Please try again.
                        </p>
                    </div>
                )}

                {/* Transactions List / Ledger */}
                {viewMode === "history" && data && !isLoading && (
                    <>
                        {(
                            <div className="space-y-4 mb-6">
                                {data.transactions.length === 0 ? (
                                    <div className="card-bg border border-[#333] rounded-lg p-8 text-center">
                                        <p className="text-gray-400 text-lg">
                                            No transactions found for the selected period.
                                        </p>
                                    </div>
                                ) : (
                                    data.transactions.map((transaction) => (
                                        <div
                                            key={transaction._id}
                                            className="bg-[#0f0f0f] border border-[#333] rounded-lg p-6 hover:border-[#fada1b]/30 transition-all"
                                        >
                                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-white">
                                                            {transaction.paymentNote}
                                                        </h3>
                                                        <span
                                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                                transaction.status
                                                            )}`}
                                                        >
                                                            {transaction.status.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400">
                                                        <p>
                                                            <span className="font-medium text-gray-300">Order ID:</span>{" "}
                                                            {transaction.orderId}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium text-gray-300">Gateway:</span>{" "}
                                                            {transaction.gatewayType}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium text-gray-300">Customer:</span>{" "}
                                                            {transaction.customerName}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium text-gray-300">Email:</span>{" "}
                                                            {transaction.customerEmail}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium text-gray-300">Phone:</span>{" "}
                                                            {transaction.customerNumber}
                                                        </p>
                                                        <p>
                                                            <span className="font-medium text-gray-300">Date:</span>{" "}
                                                            {dayjs(transaction.createdAt).format("MMM DD, YYYY HH:mm")}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-white">
                                                        ₹{transaction.amount}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {transaction.udf2?.replace(/_/g, " ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}

                        {/* Pagination for History */}
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

                {/* Wallet Ledger View */}
                {viewMode === "ledger" && ledgerData && !ledgerLoading && (
                    <>
                        <div className="bg-[#0f0f0f] border border-[#333] rounded-lg overflow-hidden mb-6">
                            {/* Ledger Table Header - Desktop */}
                            <div className="hidden md:block bg-[#1a1a1a] border-b border-[#333] px-6 py-4">
                                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-300">
                                    <div className="col-span-2">Date</div>
                                    <div className="col-span-3">Description</div>
                                    <div className="col-span-2">Type</div>
                                    <div className="col-span-2 text-right">Amount</div>
                                    <div className="col-span-3 text-right">Balance</div>
                                </div>
                            </div>

                            {/* Ledger Entries */}
                            {ledgerData.data.transactions.length === 0 ? (
                                <div className="p-8 text-center">
                                    <p className="text-gray-400 text-lg">
                                        No ledger entries found for the selected period.
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#333]">
                                    {ledgerData.data.transactions.map((entry) => (
                                        <div
                                            key={entry._id}
                                            className="px-4 md:px-6 py-4 hover:bg-[#1a1a1a] transition-colors"
                                        >
                                            {/* Desktop View */}
                                            <div className="hidden md:grid grid-cols-12 gap-4 items-center text-sm">
                                                <div className="col-span-2 text-gray-400">
                                                    {dayjs(entry.createdAt).format("MMM DD, YYYY")}
                                                    <br />
                                                    <span className="text-xs text-gray-500">
                                                        {dayjs(entry.createdAt).format("HH:mm")}
                                                    </span>
                                                </div>
                                                <div className="col-span-3">
                                                    <p className="font-medium text-white">
                                                        {entry.description}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {entry.referenceType.replace(/_/g, " ").toUpperCase()}
                                                    </p>
                                                </div>
                                                <div className="col-span-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                            entry.transactionType === "credit"
                                                                ? "text-green-400 bg-green-400/10"
                                                                : "text-red-400 bg-red-400/10"
                                                        }`}
                                                    >
                                                        {entry.transactionType.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="col-span-2 text-right">
                                                    <p
                                                        className={`font-semibold ${
                                                            entry.transactionType === "credit"
                                                                ? "text-green-400"
                                                                : "text-red-400"
                                                        }`}
                                                    >
                                                        {entry.transactionType === "credit" ? "+" : "-"} ₹
                                                        {entry.amount.toFixed(2)}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Before: ₹{entry.balanceBefore.toFixed(2)}
                                                    </p>
                                                </div>
                                                <div className="col-span-3 text-right">
                                                    <p className="font-bold text-white text-lg">
                                                        ₹{entry.balanceAfter.toFixed(2)}
                                                    </p>
                                                    <span
                                                        className={`inline-block mt-1 px-2 py-1 rounded text-xs ${getStatusColor(
                                                            entry.status
                                                        )}`}
                                                    >
                                                        {entry.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Mobile View */}
                                            <div className="md:hidden space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-white text-sm">
                                                            {entry.description}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {entry.referenceType.replace(/_/g, " ").toUpperCase()}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {dayjs(entry.createdAt).format("MMM DD, YYYY HH:mm")}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p
                                                            className={`font-semibold text-lg ${
                                                                entry.transactionType === "credit"
                                                                    ? "text-green-400"
                                                                    : "text-red-400"
                                                            }`}
                                                        >
                                                            {entry.transactionType === "credit" ? "+" : "-"} ₹
                                                            {entry.amount.toFixed(2)}
                                                        </p>
                                                        <span
                                                            className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${
                                                                entry.transactionType === "credit"
                                                                    ? "text-green-400 bg-green-400/10"
                                                                    : "text-red-400 bg-red-400/10"
                                                            }`}
                                                        >
                                                            {entry.transactionType.toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="pt-2 border-t border-[#333] space-y-1">
                                                    <div className="flex justify-between items-center text-xs">
                                                        <span className="text-gray-500">Before:</span>
                                                        <span className="text-gray-400">
                                                            ₹{entry.balanceBefore.toFixed(2)}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-gray-400 font-medium">After:</span>
                                                        <span className="font-bold text-white">
                                                            ₹{entry.balanceAfter.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Pagination for Ledger */}
                        {ledgerData.data.pagination.pages > 1 && (
                            <div className="bg-[#0f0f0f] border border-[#333] rounded-lg p-4">
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                    <div className="text-sm text-gray-400">
                                        Page {ledgerData.data.pagination.page} of{" "}
                                        {ledgerData.data.pagination.pages}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                                            disabled={ledgerData.data.pagination.page === 1}
                                            className="px-4 py-2 bg-[#333] text-gray-300 rounded-md hover:bg-[#444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <div className="flex gap-1">
                                            {Array.from(
                                                { length: Math.min(5, ledgerData.data.pagination.pages) },
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
                                            disabled={ledgerData.data.pagination.page === ledgerData.data.pagination.pages}
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
            </div>
        </div>
    );
}
