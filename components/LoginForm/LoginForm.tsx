"use client";
import React from "react";
import { useForm } from "react-hook-form";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data: any) => {
    console.log("Login data:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl shadow-lg p-8 border border-amber-300">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src="/logo.svg" alt="Logo" className="h-12" />
        </div>

        {/* Heading */}
        <h2 className="text-center text-2xl font-bold text-white mb-6">
          Welcome Back
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#fada1d] text-white"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message as string}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-[#fada1d] text-white"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#fada1d] text-black font-semibold py-2 rounded-lg hover:bg-yellow-400 transition"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        {/* <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account? <a href="/signup" className="text-[#fada1d] font-medium hover:underline">Sign up</a>
        </p> */}
      </div>
    </div>
  );
};

export default LoginForm;
