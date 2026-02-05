"use client";
import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetGameProductsQuery, useValidateUserMutation, useCreateDiamondPackOrderMutation, useCreateDiamondPackUpiOrderMutation } from "@/app/store/api/services/GameApi";
import { FaEthereum, FaCheckCircle, FaTimes, FaBolt, FaSpinner } from "react-icons/fa";
import { RiVerifiedBadgeFill } from "react-icons/ri";
import { Zap, Shield, Headphones, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";

export default function GameDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { data, isLoading, error } = useGetGameProductsQuery(id as string, {
        skip: !id,
    });

    // Get user from Redux store
    const user = useSelector((state: any) => state.auth.user);

    const [validationValues, setValidationValues] = useState<Record<string, string>>({});
    const [validationResult, setValidationResult] = useState<any>(null);
    const [selectedPack, setSelectedPack] = useState<string | null>(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showHowToPurchase, setShowHowToPurchase] = useState(false);
    const [isAutoValidating, setIsAutoValidating] = useState(false);

    const [validateUser, { isLoading: isValidating }] = useValidateUserMutation();
    const [createOrder, { isLoading: isCreatingOrder }] = useCreateDiamondPackOrderMutation();
    const [createUpiOrder, { isLoading: isCreatingUpiOrder }] = useCreateDiamondPackUpiOrderMutation();

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const paymentSectionRef = useRef<HTMLDivElement>(null);

    const gameData = data?.gameData || {};
    const products = data?.diamondPacks || [];

    // Initialize validation fields
    useEffect(() => {
        if (gameData?.validationFields) {
            const initialVals: Record<string, string> = {};
            gameData.validationFields.forEach((field: string) => {
                initialVals[field] = '';
            });
            setValidationValues(initialVals);
        }
    }, [gameData]);

    // Extract unique categories
    const categories = useMemo(() => {
        const uniqueCategories = new Set<string>();
        products.forEach((pack: any) => {
            if (pack.category && pack.status === 'active') {
                uniqueCategories.add(pack.category);
            }
        });
        return Array.from(uniqueCategories).sort();
    }, [products]);

    // Filter packs based on selected category
    const filteredPacks = useMemo(() => {
        if (!selectedCategory) {
            return products.filter((pack: any) => pack.status === 'active');
        }
        return products.filter((pack: any) => pack.category === selectedCategory && pack.status === 'active');
    }, [products, selectedCategory]);

    // Clear selected pack if it's not in filtered packs
    useEffect(() => {
        if (selectedPack && !filteredPacks.find((pack: any) => pack._id === selectedPack)) {
            setSelectedPack(null);
            setSelectedPaymentMethod(null);
        }
    }, [filteredPacks, selectedPack]);

    // Resolve player ID from validation fields
    const resolvePlayerId = () =>
        validationValues.playerId ||
        validationValues.PlayerId ||
        validationValues.userId ||
        validationValues.UserId ||
        validationValues['User ID'] ||
        '';

    // Resolve server ID from validation fields
    const resolveServerId = () =>
        validationValues.serverId ||
        validationValues.ServerId ||
        validationValues.server ||
        validationValues.Server ||
        validationValues['Server ID'] ||
        '';

    // Auto-validate function for debounced validation
    const autoValidateUser = useCallback(async (playerId: string, serverId?: string) => {
        if (!gameData?._id || !gameData?.ogcode) return;

        setIsAutoValidating(true);
        setValidationResult(null);

        try {
            // Use the new validation API
            const params = new URLSearchParams({
                game: gameData.ogcode,
                playerId: playerId,
            });

            if (serverId) {
                params.append('server', serverId);
            }

            const response = await fetch(`https://id-validation.oneapi.in/verify?${params.toString()}`);
            const result = await response.json();

            if (result.valid === true) {
                setValidationResult({
                    status: true,
                    message: result.name ? `User validated: ${result.name}` : 'User validated successfully!',
                    username: result.username || result.name,
                    avatar: result.avatar || null,
                    server: result.server || result.region || null,
                });
                toast.success('User validated successfully!');
            } else {
                setValidationResult({
                    status: false,
                    message: 'Invalid Player ID. Please check and try again.',
                    username: null,
                    avatar: null,
                });
                toast.error('Invalid Player ID');
            }
        } catch (err: any) {
            console.error('Validation error:', err);
            setValidationResult({
                status: false,
                message: 'Unable to validate. Please check your Player ID.',
                username: null,
                avatar: null,
            });
        } finally {
            setIsAutoValidating(false);
        }
    }, [gameData]);

    // Debounced validation effect for Roblox
    useEffect(() => {
        const isRoblox = gameData?.ogcode?.toUpperCase() === 'ROBLOX';

        if (!isRoblox) return;

        const playerId = resolvePlayerId();
        const serverId = resolveServerId();

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // If playerId is empty, clear validation
        if (!playerId) {
            setValidationResult(null);
            setIsAutoValidating(false);
            return;
        }

        // Set new timer for debounced validation
        debounceTimerRef.current = setTimeout(() => {
            autoValidateUser(playerId, serverId);
        }, 800); // 800ms debounce

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [validationValues, gameData, autoValidateUser]);

    const handleValidateUser = async () => {
        if (!gameData?._id) {
            toast.error('No game ID found. Cannot validate user.');
            return;
        }

        const validationFields = gameData.validationFields || [];
        const missingFields = validationFields.filter((field: string) => !validationValues[field]?.trim());

        if (missingFields.length > 0) {
            toast.error(`Please fill in: ${missingFields.join(', ')}`);
            return;
        }

        const playerId = resolvePlayerId();
        const serverId = resolveServerId();

        if (!playerId) {
            toast.error('Player ID is required for validation.');
            return;
        }

        setValidationResult(null);

        try {
            // Use the new validation API
            if (gameData.ogcode) {
                const params = new URLSearchParams({
                    game: gameData.ogcode,
                    playerId: playerId,
                });

                if (serverId) {
                    params.append('server', serverId);
                }

                const response = await fetch(`https://id-validation.oneapi.in/verify?${params.toString()}`);
                const result = await response.json();

                if (result.valid === true) {
                    setValidationResult({
                        status: true,
                        message: result.name ? `User validated: ${result.name}` : 'User validated successfully!',
                        username: result.username || result.name,
                        avatar: result.avatar || null,
                        server: result.server || result.region || null,
                    });
                    toast.success('User validated successfully!');
                } else {
                    setValidationResult({
                        status: false,
                        message: 'Invalid Player ID. Please check and try again.',
                        username: null,
                        avatar: null,
                    });
                    toast.error('Invalid Player ID');
                }
            } else {
                // Fallback to old API if no ogcode
                const payload: any = {
                    playerId: playerId,
                    gameId: gameData._id,
                };

                if (serverId) {
                    payload.serverId = serverId;
                }

                const result = await validateUser(payload).unwrap();

                if (result.valid === true) {
                    setValidationResult({
                        status: true,
                        message: result.msg || 'User validated successfully!',
                        username: result.name,
                        avatar: null,
                    });
                    toast.success('User validated successfully!');
                } else {
                    setValidationResult({
                        status: false,
                        message: 'Invalid Player ID. Please check and try again.',
                        username: null,
                        avatar: null,
                    });
                    toast.error('Invalid Player ID');
                }
            }
        } catch (err: any) {
            console.error('Validation error:', err);
            setValidationResult({
                status: false,
                message: 'Unable to validate. Please check your Player ID.',
                username: null,
                avatar: null,
            });
            toast.error('Validation failed. Please try again.');
        }
    };

    const handleCreateOrder = async () => {
        // Check if user is logged in
        if (!user) {
            toast.error('Please login to continue');
            router.push('/login');
            return;
        }

        if (!selectedPack || !selectedPaymentMethod) {
            toast.error('Please select a pack and payment method');
            return;
        }

        // For Roblox, require successful validation with avatar
        if (gameData?.ogcode?.toUpperCase() === 'ROBLOX') {
            if (!validationResult || validationResult.status !== true) {
                toast.error('Please wait for validation to complete');
                return;
            }
            if (!validationResult.avatar) {
                toast.error('Invalid Roblox account. Please check your Player ID.');
                return;
            }
        } else {
            // For other games, just check if validation was attempted
            if (!validationResult || validationResult.status !== true) {
                toast.error('Please validate your account first');
                return;
            }
        }

        if (selectedPaymentMethod === 'upi') {
            handleCreateUpiOrder();
        } else if (selectedPaymentMethod === 'wallet') {
            handleCreateWalletOrder();
        }
    };

    const handleCreateWalletOrder = async () => {
        if (!selectedPack) return;
        const pack = products.find((p: any) => p._id === selectedPack);
        if (!pack) return;

        try {
            const payload = {
                diamondPackId: pack._id,
                playerId: resolvePlayerId(),
                server: resolveServerId(),
                quantity: 1,
            };

            const result = await createOrder(payload).unwrap();
            const orderId = result.orderId;

            if (result.success && orderId) {
                // Redirect to order status page without showing success toast
                router.push(`/order-status?orderId=${orderId}`);
            }
        } catch (err: any) {
            console.error('Order creation failed:', err);

            // Handle specific error cases
            if (err.data?.error || err.data?.message) {
                const errorData = err.data;

                // Check for JWT authentication error
                if (errorData.error === 'Authentication failed. Required: JWT' ||
                    errorData.error?.includes('Authentication failed') ||
                    errorData.error?.includes('JWT')) {
                    toast.error('Session expired. Please login again.');
                    router.push('/login');
                    return;
                }

                // Check for insufficient balance error
                if (errorData.error === 'Insufficient wallet balance' || errorData.error?.includes('Insufficient')) {
                    const required = errorData.required || 0;
                    const available = errorData.available || 0;
                    toast.error(
                        `Insufficient wallet balance! Required: ₹${required}, Available: ₹${available}. Please recharge your wallet.`,
                        { duration: 5000 }
                    );
                } else {
                    // Generic error message
                    toast.error(errorData.error || errorData.message || 'Order creation failed. Please try again.');
                }
            } else {
                toast.error('Order creation failed. Please try again.');
            }
        }
    };

    const handleCreateUpiOrder = async () => {
        if (!selectedPack) return;
        const pack = products.find((p: any) => p._id === selectedPack);
        if (!pack) return;

        try {
            const payload = {
                diamondPackId: pack._id,
                playerId: resolvePlayerId(),
                server: resolveServerId(),
                quantity: 1,
                redirectUrl: `${window.location.origin}/order-status`
            };

            const result = await createUpiOrder(payload).unwrap();

            if (result.success && result.transaction) {
                window.location.href = result.transaction.paymentUrl;
            } else {
                toast.error("UPI order creation failed. Please try again later.");
            }
        } catch (err: any) {
            console.error('UPI order creation failed:', err);

            // Handle specific error cases
            if (err.data?.error || err.data?.message) {
                const errorData = err.data;

                // Check for JWT authentication error
                if (errorData.error === 'Authentication failed. Required: JWT' ||
                    errorData.error?.includes('Authentication failed') ||
                    errorData.error?.includes('JWT')) {
                    toast.error('Session expired. Please login again.');
                    router.push('/login');
                    return;
                }

                // Check for insufficient balance error
                if (errorData.error === 'Insufficient wallet balance' || errorData.error?.includes('Insufficient')) {
                    const required = errorData.required || 0;
                    const available = errorData.available || 0;
                    toast.error(
                        `Insufficient wallet balance! Required: ₹${required}, Available: ₹${available}. Please recharge your wallet.`,
                        { duration: 5000 }
                    );
                } else {
                    // Generic error message
                    toast.error(errorData.error || errorData.message || 'UPI order creation failed. Please try again.');
                }
            } else {
                toast.error('UPI order creation failed. Please try again.');
            }
        }
    };

    if (isLoading)
        return (
            <div className="min-h-screen flex items-center justify-center text-white">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-[#FADA1B]/20 rounded-full animate-spin border-t-[#FADA1B]"></div>
                </div>
            </div>
        );

    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Failed to load products. Please try again later.
            </div>
        );

    const selectedPackData = products.find((p: any) => p._id === selectedPack);

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
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl md:text-5xl font-bold uppercase flex items-center justify-center md:justify-start gap-2 mb-3">
                        {gameData.name}
                        <RiVerifiedBadgeFill className="text-[#1d96ff] text-2xl" />
                    </h1>
                    <p className="text-gray-400 mb-4 text-lg">
                        Publisher: <span className="text-white">{gameData.publisher}</span>
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {[
                            { icon: Zap, text: 'Delivery in minutes' },
                            { icon: Shield, text: 'Secure' },
                            { icon: Headphones, text: '24/7 Support' },
                            { icon: DollarSign, text: 'Best Price' }
                        ].map((feature, i) => (
                            <span key={i} className="bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-[#FADA1B] uppercase tracking-wider flex items-center gap-1.5 hover:bg-white/10 transition-colors">
                                <feature.icon className="w-3 h-3" />
                                {feature.text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Validation Section */}
            <div className="mb-8 card-bg p-6 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold flex items-center gap-3">
                        <div className="w-1 h-6 bg-[#FADA1B] rounded-full"></div>
                        Verify Account
                    </h2>
                    <button
                        onClick={() => setShowHowToPurchase(true)}
                        className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all border border-white/20"
                    >
                        How to Purchase
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    {gameData?.validationFields?.map((field: string) => (
                        <div key={field}>
                            <label className="block text-white/70 font-bold text-xs uppercase tracking-wider mb-2">
                                {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={validationValues[field] || ''}
                                    onChange={e => setValidationValues(vals => ({ ...vals, [field]: e.target.value }))}
                                    placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toUpperCase()}`}
                                    className="w-full bg-white/5 text-white placeholder:text-white/30 rounded-lg px-4 py-3 border border-white/10 focus:outline-none focus:border-[#FADA1B] transition-all"
                                />
                                {isAutoValidating && gameData?.ogcode?.toUpperCase() === 'ROBLOX' && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <FaSpinner className="animate-spin text-[#FADA1B]" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {gameData?.ogcode?.toUpperCase() !== 'ROBLOX' && (
                    <button
                        className="w-full bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold py-3 rounded-lg transition-all uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={handleValidateUser}
                        disabled={isValidating}
                    >
                        {isValidating ? (
                            <div className="flex items-center justify-center gap-3">
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                                <span>Validating...</span>
                            </div>
                        ) : (
                            "Validate Now"
                        )}
                    </button>
                )}

                {validationResult && (
                    <div className={`mt-5 p-4 rounded-lg border ${validationResult.status === true ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/30"}`}>
                        <div className="flex items-start gap-3">
                            {validationResult.status === true ? (
                                <FaCheckCircle className="text-green-400 text-xl mt-0.5 flex-shrink-0" />
                            ) : (
                                <FaTimes className="text-red-400 text-xl mt-0.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                                <div className={`font-bold ${validationResult.status === true ? "text-green-400" : "text-red-400"}`}>
                                    {validationResult.message}
                                </div>

                                {/* Display avatar for Roblox */}
                                {validationResult.avatar && gameData?.ogcode?.toUpperCase() === 'ROBLOX' && (
                                    <div className="mt-3 flex items-center gap-3">
                                        <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-[#FADA1B]">
                                            <Image
                                                src={validationResult.avatar}
                                                alt={validationResult.username || "Avatar"}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            {validationResult.username && (
                                                <div className="text-white">
                                                    Username: <span className="font-bold text-[#FADA1B]">{validationResult.username}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Display username for non-Roblox games */}
                                {validationResult.username && gameData?.ogcode?.toUpperCase() !== 'ROBLOX' && (
                                    <div className="mt-2 text-white">
                                        Username: <span className="font-bold text-[#FADA1B]">{validationResult.username}</span>
                                    </div>
                                )}

                                {/* Display server/region info if available */}
                                {validationResult.server && (
                                    <div className="mt-1 text-white/70 text-sm">
                                        Server: <span className="font-bold">{validationResult.server}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Auto-validation info for Roblox */}
                {gameData?.ogcode?.toUpperCase() === 'ROBLOX' && !validationResult && !isAutoValidating && (
                    <div className="mt-4 text-center text-white/50 text-xs">
                        <p>Enter your Roblox Player ID to auto-validate</p>
                    </div>
                )}
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
                <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedCategory === null
                                ? 'bg-[#FADA1B] text-black'
                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                }`}
                        >
                            All Packs
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${selectedCategory === category
                                    ? 'bg-[#FADA1B] text-black'
                                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Products Section */}
            <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-6 border-l-4 border-[#FADA1B] pl-3">
                    Select Product
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredPacks.map((product: any) => {
                        const isSelected = selectedPack === product._id;
                        return (
                            <div
                                key={product._id}
                                onClick={() => {
                                    setSelectedPack(product._id);
                                    // Scroll to payment section after a short delay
                                    setTimeout(() => {
                                        paymentSectionRef.current?.scrollIntoView({
                                            behavior: 'smooth',
                                            block: 'center'
                                        });
                                    }, 100);
                                }}
                                className={`card-bg p-4 rounded-lg border transition-all cursor-pointer group relative overflow-hidden ${isSelected
                                        ? 'border-[#FADA1B] shadow-lg shadow-[#FADA1B]/20'
                                        : 'border-white/5 hover:border-[#FADA1B]/50'
                                    }`}
                            >
                                {/* Selection Indicator */}
                                {isSelected && (
                                    <div className="absolute top-2 right-2 bg-[#FADA1B] text-black p-1 rounded-full z-10">
                                        <FaCheckCircle className="text-sm" />
                                    </div>
                                )}

                                {/* Cashback Badge */}
                                {product.cashback > 0 && (
                                    <div className="absolute top-2 left-2 bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded border border-green-500/30">
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
                                        <div className={`w-full py-2 rounded font-bold transition-colors border flex items-center justify-center text-lg ${isSelected
                                            ? 'bg-[#FADA1B] text-black border-[#FADA1B]'
                                            : 'bg-white/10 text-white border-white/10 group-hover:bg-white/20'
                                            }`}>
                                            ₹{product.amount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {filteredPacks.length === 0 && (
                    <div className="text-center text-gray-400 py-12">
                        <div className="text-xl mb-2">
                            {selectedCategory
                                ? `No packs available in "${selectedCategory}" category`
                                : 'No products available'}
                        </div>
                        <div className="text-sm">
                            {selectedCategory
                                ? 'Try selecting a different category'
                                : 'Check back later for new packs'}
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Section */}
            {selectedPack && selectedPackData && (
                <div ref={paymentSectionRef} className="max-w-xl mx-auto space-y-4 mb-12">
                    {/* Payment Method Selection */}
                    <div className="card-bg p-5 rounded-xl border border-white/10">
                        <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#FADA1B] rounded-full"></div>
                            SELECT PAYMENT METHOD
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {/* UPI Payment Option */}
                            <button
                                onClick={() => setSelectedPaymentMethod('upi')}
                                className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'upi'
                                    ? 'bg-[#FADA1B]/10 border-[#FADA1B] shadow-lg'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPaymentMethod === 'upi' ? 'bg-[#FADA1B] text-black' : 'bg-white/10 text-white'}`}>
                                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor">
                                        <rect x="2" y="4" width="20" height="14" rx="2" strokeWidth="2" />
                                        <path d="M2 10h20" strokeWidth="2" />
                                    </svg>
                                </div>
                                <span className={`font-bold uppercase tracking-wider text-xs ${selectedPaymentMethod === 'upi' ? 'text-[#FADA1B]' : 'text-white/60'}`}>UPI</span>
                                {selectedPaymentMethod === 'upi' && (
                                    <div className="absolute top-2 right-2">
                                        <FaCheckCircle className="text-[#FADA1B] text-sm" />
                                    </div>
                                )}
                            </button>

                            {/* Wallet Payment Option */}
                            <button
                                onClick={() => setSelectedPaymentMethod('wallet')}
                                className={`relative flex flex-col items-center gap-2 py-4 px-3 rounded-lg border-2 transition-all ${selectedPaymentMethod === 'wallet'
                                    ? 'bg-[#FADA1B]/10 border-[#FADA1B] shadow-lg'
                                    : 'bg-white/5 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs ${selectedPaymentMethod === 'wallet' ? 'bg-[#FADA1B] text-black' : 'bg-white/10 text-white'}`}>
                                    ₹
                                </div>
                                <span className={`font-bold uppercase tracking-wider text-xs ${selectedPaymentMethod === 'wallet' ? 'text-[#FADA1B]' : 'text-white/60'}`}>Wallet</span>
                                {selectedPaymentMethod === 'wallet' && (
                                    <div className="absolute top-2 right-2">
                                        <FaCheckCircle className="text-[#FADA1B] text-sm" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Buy Now Card */}
                    {selectedPaymentMethod && (
                        <div className="card-bg p-5 rounded-xl border border-white/10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Total Payable</div>
                                    <div className="text-white text-3xl font-black">
                                        ₹{selectedPackData.amount}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white/50 text-xs font-bold uppercase tracking-wider mb-1">Payment via</div>
                                    <div className="bg-[#FADA1B] text-black px-3 py-1 rounded-lg text-xs font-bold uppercase">
                                        {selectedPaymentMethod === 'upi' ? 'UPI' : 'WALLET'}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="w-full py-4 rounded-lg bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black font-bold text-lg tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3"
                                onClick={handleCreateOrder}
                                disabled={isCreatingOrder || isCreatingUpiOrder || !validationResult || validationResult.status !== true}
                            >
                                {(isCreatingOrder || isCreatingUpiOrder) ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                                        <span className="text-sm">PROCESSING...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-sm">PROCEED TO PAY</span>
                                        <FaBolt className="text-black group-hover:scale-110 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-gray-400 text-xs font-bold uppercase tracking-wider mt-3">
                                Secure Encrypted Transaction
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* How to Purchase Modal */}
            {showHowToPurchase && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
                    <div className="bg-[#0a0a09] border-2 border-[#FADA1B] rounded-2xl p-6 md:p-10 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-8 bg-[#FADA1B] rounded-full"></div>
                                <h2 className="text-2xl md:text-3xl font-bold text-white uppercase">
                                    How to Purchase
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowHowToPurchase(false)}
                                className="bg-[#FADA1B] text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#FADA1B]/90 transition-all"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        <div className="card-bg border border-[#FADA1B]/30 rounded-xl p-6 md:p-8 mb-8">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-6 text-center">
                                How to Purchase from Blox Fruit Hub
                            </h3>
                            <ol className="space-y-4 text-white/90">
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#FADA1B] text-black rounded-full flex items-center justify-center font-bold text-sm">
                                        1
                                    </span>
                                    <span className="pt-1">Enter your Roblox username and click Validate.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#FADA1B] text-black rounded-full flex items-center justify-center font-bold text-sm">
                                        2
                                    </span>
                                    <span className="pt-1">Select the desired Blox Fruits or Gamepasses and add them to your cart.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#FADA1B] text-black rounded-full flex items-center justify-center font-bold text-sm">
                                        3
                                    </span>
                                    <span className="pt-1">Review your cart and proceed to Checkout.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#FADA1B] text-black rounded-full flex items-center justify-center font-bold text-sm">
                                        4
                                    </span>
                                    <span className="pt-1">Complete payment using UPI.</span>
                                </li>
                                <li className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 bg-[#FADA1B] text-black rounded-full flex items-center justify-center font-bold text-sm">
                                        5
                                    </span>
                                    <span className="pt-1">Once payment is successful, your order will be confirmed and delivered to your Roblox account within a few minutes.</span>
                                </li>
                            </ol>
                        </div>

                        <button
                            onClick={() => setShowHowToPurchase(false)}
                            className="w-full bg-[#FADA1B] hover:bg-[#FADA1B]/90 text-black py-4 rounded-xl font-bold text-xl uppercase tracking-wider transition-all"
                        >
                            GOT IT!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
