"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetOrderStatusQuery } from "@/app/store/api/services/orderApi";
import { FaCheckCircle, FaSpinner, FaTimes, FaClock } from "react-icons/fa";
import Link from "next/link";

export default function OrderStatusPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get("orderId") || searchParams.get("client_txn_id");
    const [pollingInterval, setPollingInterval] = useState(3000);

    const { data, isLoading, error, refetch } = useGetOrderStatusQuery(orderId as string, {
        skip: !orderId,
        pollingInterval: pollingInterval,
    });

    // Stop polling after order is completed or failed
    useEffect(() => {
        if (data?.order?.status === "completed" || data?.order?.status === "failed") {
            setPollingInterval(0); // Stop polling
        }
    }, [data]);

    if (!orderId) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white px-4">
                <div className="text-center card-bg p-8 rounded-xl border border-white/10 max-w-md">
                    <FaTimes className="text-red-500 text-6xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">No Order ID Found</h1>
                    <p className="text-gray-400 mb-6">Please provide a valid order ID.</p>
                    <Link href="/gamestore">
                        <button className="bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold py-3 px-6 rounded-lg transition-all">
                            Back to Games
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    if (isLoading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="text-center">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 border-4 border-[#FADA1B]/20 rounded-full animate-spin border-t-[#FADA1B] mx-auto"></div>
                    </div>
                    <h2 className="text-2xl font-bold uppercase tracking-wider">
                        Fetching Order Status...
                    </h2>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center text-white px-4">
                <div className="text-center card-bg p-8 rounded-xl border border-white/10 max-w-md">
                    <FaTimes className="text-red-500 text-6xl mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2">Error Loading Order</h1>
                    <p className="text-gray-400 mb-6">
                        Unable to fetch order status. Please try again.
                    </p>
                    <button
                        onClick={() => refetch()}
                        className="bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold py-3 px-6 rounded-lg transition-all mr-2"
                    >
                        Retry
                    </button>
                    <Link href="/gamestore">
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-6 rounded-lg transition-all border border-white/20">
                            Back to Games
                        </button>
                    </Link>
                </div>
            </div>
        );
    }

    const order = data.order;
    const status = order.status;

    // Status configurations
    const statusConfig: Record<string, { icon: any; color: string; title: string; description: string }> = {
        initiated: {
            icon: FaClock,
            color: "text-blue-500",
            title: "Payment Initiated",
            description: "Your payment has been initiated. Please complete the payment process.",
        },
        processing: {
            icon: FaSpinner,
            color: "text-yellow-500",
            title: "Processing Order",
            description: "Your order is being processed. This usually takes a few moments.",
        },
        completed: {
            icon: FaCheckCircle,
            color: "text-green-500",
            title: "Order Completed",
            description: "Your order has been completed successfully! Diamonds have been delivered to your account.",
        },
        failed: {
            icon: FaTimes,
            color: "text-red-500",
            title: "Order Failed",
            description: "Your order could not be completed. Please contact support if you were charged.",
        },
    };

    const currentStatus = statusConfig[status] || statusConfig.processing;
    const StatusIcon = currentStatus.icon;

    return (
        <div className="min-h-screen text-white pt-24 pb-10 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Status Card */}
                <div className="card-bg p-8 rounded-xl border border-white/10 mb-6">
                    <div className="text-center mb-8">
                        <div className={`inline-block ${status === "processing" ? "animate-spin" : ""}`}>
                            <StatusIcon className={`${currentStatus.color} text-6xl mb-4`} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{currentStatus.title}</h1>
                        <p className="text-gray-400">{currentStatus.description}</p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-4 border-t border-white/10 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-semibold">Order ID:</span>
                            <span className="font-bold text-[#FADA1B]">{orderId}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-semibold">Status:</span>
                            <span className={`font-bold uppercase ${currentStatus.color}`}>{status}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-semibold">Amount:</span>
                            <span className="font-bold text-white">₹{order.amount}</span>
                        </div>

                        <div className="flex justify-between items-center">
                            <span className="text-gray-400 font-semibold">Payment Method:</span>
                            <span className="font-bold text-white uppercase">{order.paymentMethod}</span>
                        </div>

                        {order.items && order.items.length > 0 && (
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-gray-400 font-semibold mb-3">Order Items:</h3>
                                {order.items.map((item: any, index: number) => (
                                    <div key={index} className="bg-white/5 p-3 rounded-lg mb-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold">{item.itemName}</span>
                                            <span className="text-[#FADA1B] font-bold">₹{item.price}</span>
                                        </div>
                                        <div className="text-sm text-gray-400 mt-1">
                                            Quantity: {item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {order.description && (
                            <div className="border-t border-white/10 pt-4 mt-4">
                                <h3 className="text-gray-400 font-semibold mb-2">Details:</h3>
                                <div className="bg-white/5 p-3 rounded-lg">
                                    {(() => {
                                        try {
                                            const desc = JSON.parse(order.description);
                                            return (
                                                <div className="space-y-1 text-sm">
                                                    {desc.text && <div className="text-white">{desc.text}</div>}
                                                    {desc.playerId && (
                                                        <div className="text-gray-400">
                                                            Player ID: <span className="text-white">{desc.playerId}</span>
                                                        </div>
                                                    )}
                                                    {desc.server && (
                                                        <div className="text-gray-400">
                                                            Server: <span className="text-white">{desc.server}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        } catch {
                                            return <div className="text-sm text-gray-400">{order.description}</div>;
                                        }
                                    })()}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                        {status === "processing" || status === "initiated" ? (
                            <button
                                onClick={() => refetch()}
                                className="flex-1 bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold py-3 rounded-lg transition-all uppercase tracking-wider"
                            >
                                Refresh Status
                            </button>
                        ) : (
                            <Link href="/gamestore" className="flex-1">
                                <button className="w-full bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold py-3 rounded-lg transition-all uppercase tracking-wider">
                                    Back to Games
                                </button>
                            </Link>
                        )}

                        <Link href="/profile" className="flex-1">
                            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-all border border-white/20 uppercase tracking-wider">
                                View Profile
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Auto-refresh notification */}
                {(status === "processing" || status === "initiated") && (
                    <div className="text-center text-gray-400 text-sm">
                        <FaSpinner className="inline-block animate-spin mr-2" />
                        Auto-refreshing every 3 seconds...
                    </div>
                )}

                {/* Support Info */}
                <div className="card-bg p-6 rounded-xl border border-white/10 text-center">
                    <h3 className="font-bold text-lg mb-2">Need Help?</h3>
                    <p className="text-gray-400 text-sm mb-4">
                        If you have any questions or issues with your order, please contact our support team.
                    </p>
                    <Link href="/profile">
                        <button className="bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-6 rounded-lg transition-all border border-white/20 text-sm">
                            Contact Support
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
