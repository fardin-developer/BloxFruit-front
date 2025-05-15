"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

type FormValues = {
  name: string;
  type: string;
  category: string;
  regularPrice: number;
  showDiscount: boolean;
  discountPrice?: number;
  image?: FileList;
};

export default function FruitForm() {
  const { register, handleSubmit, watch, reset } = useForm<FormValues>();
  const showDiscount = watch("showDiscount");
  const [preview, setPreview] = useState<string | null>(null);

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const onSubmit = async (data: FormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("type", data.type);
    formData.append("category", data.category);
    formData.append("regularPrice", data.regularPrice.toString());
    formData.append("showDiscount", data.showDiscount.toString());
    if (data.discountPrice) {
      formData.append("discountPrice", data.discountPrice.toString());
    }
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0]);
    }

    const res = await fetch("/api/fruits", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      alert("Fruit submitted successfully!");
      reset();
      setPreview(null);
    } else {
      alert("Submission failed.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-2 text-yellow-500">
        Add New Fruit
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className=" bg-[#09090b] p-4">
          <div className="w-1/3 rounded-xl">
            <label className="block mb-2 text-[#fada1d]">Image Upload</label>

            <label
              htmlFor="imageUpload"
              className="cursor-pointer w-full max-w-sm border-1 border-dashed border-[#fada1d] rounded-lg p-6 flex flex-col items-center justify-center text-yellow-400 hover:bg-yellow-50 transition text-center"
            >
              {preview ? (
                <Image
                  src={preview}
                  alt="Preview"
                  width={160}
                  height={150}
                  className="rounded object-cover"
                />
              ) : (
                <>
                  <div className="text-3xl mb-2">📷</div>
                  <p className="text-sm font-medium">Click to browse</p>
                  <p className="text-xs text-gray-400">
                    Recommended size: 600 × 400px
                  </p>
                </>
              )}
            </label>

            <input
              id="imageUpload"
              type="file"
              accept="image/*"
              {...register("image")}
              onChange={onImageChange}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div>
              <label className="block mb-2 text-[#fada1d]">Name</label>
              <input
                {...register("name")}
                required
                className="w-full border border-[#fada1d] focus:outline-none text-yellow-600 rounded px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#fada1d]">Type</label>
              <input
                {...register("type")}
                required
                className="w-full border border-[#fada1d] focus:outline-none text-yellow-600 rounded px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#fada1d]">Category</label>
              <input
                {...register("category")}
                required
                className="w-full border border-[#fada1d] focus:outline-none text-yellow-600 rounded px-4 py-3"
              />
            </div>

            <div>
              <label className="block mb-2 text-[#fada1d]">Regular Price</label>
              <input
                type="number"
                step="0.01"
                {...register("regularPrice")}
                required
                className="w-full border border-[#fada1d] focus:outline-none text-yellow-600 rounded px-4 py-3"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-4 mt-6">
                <input
                  type="checkbox"
                  {...register("showDiscount")}
                  className="w-6 h-6 border-yellow-200 border-2 rounded-md bg-transparent "
                />
                <label>Show Discount Price</label>
              </div>

              {showDiscount && (
                <div>
                  <label className="block mb-2 text-[#fada1d]">Discount Price</label>
                  <input
                    type="number"
                    step="0.01"
                    {...register("discountPrice")}
                    className="w-full border border-[#fada1d] focus:outline-none text-yellow-600 rounded px-4 py-3"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 p-2 w-fit bg-green-600 text-white py-3 rounded font-medium hover:bg-green-700 transition"
          >
            <PlusIcon className="w-4 h-4" />
            Add Fruit
          </button>
        </div>
      </form>
    </div>
  );
}
