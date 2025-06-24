"use client";
import DynamicTable, {
  TableColumn,
} from "@/components/ui/DynamicTable/DynamicTable";
import React, { useState, useMemo } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from "next/link";
import { useDeleteProductMutation, useGetProductsQuery } from "@/app/store/api/services/productApi";
import { useRouter } from "next/navigation";
import Pagination from "@/components/ui/Pagination/Pagination";

const ProductsList = () => {
  const router = useRouter()
  const { data: products, isLoading, refetch } = useGetProductsQuery(undefined);
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const productsData = products?.data;
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  console.log(productsData);

  const handleDelete =  async (id:string)=>{
    if(confirm("Are you sure you want to delete this product?")){
    const res = await deleteProduct(id)
    if(res.data?.success){
        alert("Product deleted successfully");
        refetch();
      }
    }
  };

  const dateFormatter = (date:string)=>{
    return new Date(date).toLocaleString();
  }

  const priceFormatter = (price:number)=>{
    return `$${price}`;
  }

  const imageFormatter = (image:string)=>{
    // const url = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image}`;
    const url = `${image}`;
    console.log(url, "url");
    console.log('Generated image URL:',encodeURI(url));
    return encodeURI(url);
  }

  // Format all data first
  const allFormattedData = useMemo(() => {
    return productsData?.map((product:any)=>({
      ...product,
      regularPrice: priceFormatter(product.regularPrice),
      created_at: dateFormatter(product.created_at),
      imageUrl: imageFormatter(product.imageUrl),
    })) || [];
  }, [productsData]);

  // Calculate pagination
  const totalItems = allFormattedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  
  // Get current page data
  const currentPageData = allFormattedData.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns: TableColumn[] = [
    { key: "imageUrl", label: "Image", type: "image" },
    { key: "name", label: "Product Name", type: "text" },
    { key: "type", label: "Rarity", type: "text" },
    { key: "regularPrice", label: "Price", type: "text" },
    { key: "created_at", label: "Created Date & Time", type: "text" },
    { key: "category", label: "Category", type: "text" },
  ];

  const tableActions = (row: any) => {
    return (
      <div className="flex gap-2">
        <button onClick={()=>router.push(`/dashboard/add-fruits?id=${row.id}`)} className="bg-[#80fa1d] hover:brightness-150 group text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1 relative">
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div className="w-full h-full group-hover:bg-[radial-gradient(white_1px,transparent_1px)] [background-size:5px_5px] opacity-100 " />
          </div>
          <MdEdit className="text-xl" />
          Update
        </button>
        <button onClick={()=>handleDelete(row.id)} className="bg-[#fa4242] hover:brightness-150 text-black font-bold px-4 py-2 duration-300 cursor-pointer flex items-center gap-1">
          <MdDelete className="text-xl" />
          Delete
        </button>
      </div>
    );
  };

  return (
    <div className="relative">
      <h1 className="text-2xl font-bold mb-4">Products List</h1>
      <Link href="/dashboard/add-fruits" className="bg-[#fada1d] hover:brightness-150 text-black px-4 py-2 duration-300 cursor-pointer absolute top-0 right-0">
        <FaPlus />
      </Link>
      
      <DynamicTable 
        columns={columns} 
        data={currentPageData} 
        actions={tableActions} 
        loading={isLoading} 
      />
      
      {/* Pagination */}
      {!isLoading && totalItems > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      )}
    </div>
  );
};

export default ProductsList;
