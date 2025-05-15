"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import image from "@/public/mainCardImages/legendary.png";
import image2 from "@/public/mainCardImages/common.png";
import image3 from "@/public/mainCardImages/uncommon.png";

const products = [
  {
    image_url: image,
    name: "Product 1",
    rarity: "Legendary",
    price: "$100",
    created_at: "2021-01-01 12:00:00",
  },
  {
    image_url: image2,
    name: "Product 2",
    rarity: "Common",
    price: "$100",
    created_at: "2021-01-01 12:00:00",
  },
  {
    image_url: image3,
    name: "Product 3",
    rarity: "Uncommon",
    price: "$100",
    created_at: "2021-01-01 12:00:00",
  },
];

const ProductsList = () => {
  const columns: TableColumn[] = [
    { key: "image_url", label: "Image", type: "image" },
    { key: "name", label: "Product Name", type: "text" },
    { key: "rarity", label: "Rarity", type: "text" },
    { key: "price", label: "Price", type: "text" },
    { key: "created_at", label: "Created Date & Time", type: "text" },
  ];

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <button className="bg-[#80fa1d] hover:brightness-150 text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1">
          <MdEdit className="text-xl" />
          Update
        </button>
        <button className="bg-[#fa4242] hover:brightness-150 text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1">
          <MdDelete className="text-xl" />
          Delete
        </button>
      </div>
    );
  };
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <button className="bg-[#fada1d] hover:brightness-150 text-black px-4 py-2 duration-300 cursor-pointer absolute top-0 right-0">
        <FaPlus />
      </button>
      <DynamicTable columns={columns} data={products} actions={tableActions} />
    </div>
  );
};

export default ProductsList;
