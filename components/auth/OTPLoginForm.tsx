"use client";
import { useSendOtpMutation, useVerifyOtpMutation, useCompleteRegistrationMutation } from "@/app/store/api/services/AuthApi";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/store/slices/authSlice";
import Link from "next/link";

const OTPLoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const [step, setStep] = useState<"PHONE" | "OTP" | "REGISTRATION">("PHONE");
    const [phoneNumber, setPhoneNumber] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
    const [completeRegistration, { isLoading: isRegistering }] = useCompleteRegistrationMutation();

    const onSendOtp = async (data: any) => {
        try {
            console.log("Sending OTP to:", data.phone);
            const response = await sendOtp({ phone: data.phone }).unwrap();
            console.log("OTP Sent Response:", response);

            setPhoneNumber(data.phone);

            // Reset form to clear phone validation state before switching to OTP input
            reset({ otp: "" });

            console.log("Setting step to OTP");
            setStep("OTP");

            toast.success(response.message || "OTP sent successfully");
        } catch (error: any) {
            console.error("Send OTP Error:", error);
            toast.error(
                error.data?.message || "Failed to send OTP. Please try again."
            );
        }
    };

    const onVerifyOtp = async (data: any) => {
        try {
            const response = await verifyOtp({ phone: phoneNumber, otp: data.otp }).unwrap();

            if (response.requiresRegistration) {
                toast.success(response.message || "OTP verified. Please complete registration.");
                reset({ otp: "" }); // Clear OTP field
                setStep("REGISTRATION");
                return;
            }

            dispatch(
                setCredentials({ user: response.user, token: response.token })
            );
            toast.success("Login successful");
            router.push("/profile");
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.data?.message || "Invalid OTP. Please try again."
            );
        }
    };

    const onRegister = async (data: any) => {
        try {
            const response = await completeRegistration({
                name: data.name,
                email: data.email,
                password: data.password,
                phone: phoneNumber
            }).unwrap();

            dispatch(
                setCredentials({ user: response.user, token: response.token })
            );
            toast.success("Registration completed successfully");
            router.push("/profile");
        } catch (error: any) {
            console.error(error);
            toast.error(
                error.data?.message || "Registration failed. Please try again."
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 border border-amber-300">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Link href="/">
                        <img src="/logo.svg" alt="Logo" className="h-12" />
                    </Link>
                </div>

                {/* Heading */}
                <h2 className="text-center text-2xl font-bold text-white mb-6">
                    {step === "PHONE" ? "Login with Phone" : step === "OTP" ? "Verify OTP" : "Complete Registration"}
                </h2>

                {/* Form */}
                {(() => {
                    console.log("Rendering Step:", step);
                    return step === "PHONE" ? (
                        <form onSubmit={handleSubmit(onSendOtp)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    placeholder="Enter 10 digit number"
                                    {...register("phone", {
                                        required: "Phone number is required",
                                        pattern: {
                                            value: /^[0-9]{10}$/,
                                            message: "Please enter a valid 10-digit phone number",
                                        },
                                    })}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#fada1d] text-white bg-transparent"
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.phone.message as string}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSendingOtp}
                                className="w-full bg-[#fada1d] text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                            >
                                {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    ) : step === "OTP" ? (
                        <form onSubmit={handleSubmit(onVerifyOtp)} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Enter OTP sent to {phoneNumber}
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    {...register("otp", {
                                        required: "OTP is required",
                                    })}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#fada1d] text-white bg-transparent"
                                />
                                {errors.otp && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.otp.message as string}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isVerifyingOtp}
                                className="w-full bg-[#fada1d] text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                            >
                                {isVerifyingOtp ? "Verifying..." : "Verify & Login"}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep("PHONE")}
                                className="w-full text-zinc-400 text-sm hover:text-white transition"
                            >
                                Change Phone Number
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    {...register("name", { required: "Name is required" })}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#fada1d] text-white bg-transparent"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name.message as string}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#fada1d] text-white bg-transparent"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">{errors.email.message as string}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="Create password"
                                    {...register("password", {
                                        required: "Password is required",
                                        minLength: {
                                            value: 6,
                                            message: "Password must be at least 6 characters"
                                        }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:border-[#fada1d] text-white bg-transparent"
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message as string}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isRegistering}
                                className="w-full bg-[#fada1d] text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 mt-4"
                            >
                                {isRegistering ? "Registering..." : "Complete Registration"}
                            </button>
                        </form>
                    );
                })()}
            </div>
        </div>
    );
};

export default OTPLoginForm;
