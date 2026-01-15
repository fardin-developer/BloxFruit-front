"use client";
import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useGetGameProductsQuery } from "@/app/store/api/services/GameApi";
import { FaEthereum } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";

export default function GameDetailsPage() {
    const { id } = useParams();
    const { data, isLoading, error } = useGetGameProductsQuery(id as string, {
        skip: !id,
    });

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading products...
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load products. Please try again later.
            </div>
        );

    const gameData = data?.gameData || {};
    const products = data?.diamondPacks || [];

    return (
        <div className="min-h-screen text-white pt-24 pb-10 px-4 max-w-[1320px] mx-auto">
            {/* Game Header */}
            <div className="flex flex-col md:flex-row items-center gap-6 mb-10 card-bg p-6 rounded-xl border border-white/10">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-lg overflow-hidden border-2 border-[#FADA1B]">
                    {gameData.image ? (
                        <Image
                            src={gameData.image}
                            alt={gameData.name || "Game"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-800" />
                    )}
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold uppercase flex items-center justify-center md:justify-start gap-2">
                        {gameData.name}
                        <RiVerifiedBadgeFill className="text-[#1d96ff] text-2xl" />
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">
                        Publisher: <span className="text-white">{gameData.publisher}</span>
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                        {gameData.validationFields?.map((field: string) => (
                            <span
                                key={field}
                                className="px-3 py-1 bg-white/10 rounded-full text-xs uppercase tracking-wider text-[#FADA1B] border border-[#FADA1B]/30"
                            >
                                {field}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-[#FADA1B] pl-3">
                    Select Product
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {products.map((product: any) => (
                        <div
                            key={product._id}
                            className="card-bg p-4 rounded-lg border border-white/5 hover:border-[#FADA1B]/50 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            {/* Cashback Badge */}
                            {product.cashback > 0 && (
                                <div className="absolute top-2 right-2 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">
                                    {product.cashback}% BACK
                                </div>
                            )}

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                                    {product.logo ? (
                                        <Image
                                            src={product.logo}
                                            alt={product.description}
                                            fill
                                            className="object-contain"
                                        />
                                    ) : (
                                        <FaEthereum className="text-4xl text-[#FADA1B]" />
                                    )}
                                </div>
                                <h3 className="font-semibold text-sm md:text-base line-clamp-2 min-h-[48px] flex items-center justify-center">
                                    {product.description}
                                </h3>

                                <div className="mt-4 w-full">
                                    <button className="w-full bg-white/10 hover:bg-[#FADA1B] hover:text-black py-2 rounded font-bold transition-colors border border-white/10 flex items-center justify-center gap-1 group-hover:bg-[#FADA1B] group-hover:text-black">
                                        ₹{product.amount}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
