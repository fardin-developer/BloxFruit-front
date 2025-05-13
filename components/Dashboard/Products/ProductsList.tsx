"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React from "react";

const products = [
  {
    image_url: "",
    name: "Product 1",
    clinic_count: 10,
    created_at: "2021-01-01 12:00:00",
  },
  {
    image_url: "",
    name: "Product 2",
    clinic_count: 20,
    created_at: "2021-01-01 12:00:00",
  },
  {
    image_url: "",
    name: "Product 3",
    clinic_count: 30,
    created_at: "2021-01-01 12:00:00",
  },
];

const ProductsList = () => {
  const columns: TableColumn[] = [
    { key: "image_url", label: "Image", type: "image" },
    { key: "name", label: "Procedures Name", type: "text" },
    { key: "clinic_count", label: "Clinics", type: "text" },
    { key: "created_at", label: "Join Date & Time", type: "text" },
  ];

  const tableActions = (row: any) => {
    return (
      <div>
        <button>Edit</button>
      </div>
    );
  };
  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <button className="bg-[#fada1d] text-black px-4 py-2 rounded-md absolute top-0 right-0">
        +
      </button>
      <DynamicTable columns={columns} data={products} actions={tableActions} />
    </div>
  );
};

export default ProductsList;
