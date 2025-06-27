"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React from "react";
import image from "@/public/mainCardImages/legendary.png";
import image2 from "@/public/mainCardImages/common.png";
import image3 from "@/public/mainCardImages/uncommon.png";
import { MdCheckCircle } from "react-icons/md";
import { useGetOrdersQuery } from "@/app/store/api/services/orderApi";
const products = [
  {
    image_url: image,
    name: "Product 1",
    roblox_username: "John Doe",
    rarity: "Common",
    created_at: "2021-01-01 12:00:00",
    status: "Pending",
  },
  {
    image_url: image2,
    name: "Product 2",
    roblox_username: "John Doe",
    rarity: "Uncommon",
    created_at: "2021-01-01 12:00:00",
    status: "Pending",
  },
  {
    image_url: image3,
    name: "Product 3",
    roblox_username: "John Doe",
    rarity: "Rare",
    created_at: "2021-01-01 12:00:00",
    status: "Completed",
  },
];
const OrdersList = () => {
  const { data: orders, isLoading } = useGetOrdersQuery(null);
  const ordersData = orders?.data;
console.log(ordersData);
const items  =  ordersData?.map((item:any)=>{

  
}) 
  const columns: TableColumn[] = [
    { key: "image_url", label: "Image", type: "image" },
    { key: "name", label: "Procedures Name", type: "text" },
    { key: "roblox_username", label: "Roblox Username", type: "text" },
    { key: "rarity", label: "Rarity", type: "text" },
    { key: "created_at", label: "Order Date & Time", type: "text" },
    { key: "status", label: "Status", type: "text" },
  ];

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <button disabled={row.status === "Completed"} className="bg-[#80fa1d] hover:brightness-150 text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed">
          {row.status === "Completed" ? <MdCheckCircle className="text-xl text-green-800" /> :""}
          {row.status === "Completed" ? "Completed" : "Complete"}
        </button>
      </div>
    );
  };
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Orders List</h1>
      <DynamicTable columns={columns} data={products} actions={tableActions} loading={isLoading} />
    </div>
  );
};

export default OrdersList;
