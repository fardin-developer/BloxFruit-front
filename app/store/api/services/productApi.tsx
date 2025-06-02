import { baseApi } from "../baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query({
      query: () => ({
        url: "/dashboard/products",
        method: "GET",
      }),
      providesTags: ["products"],
    }),

    addProduct: build.mutation({
      query: (formData) => ({
        url: "/dashboard/product",
        method: "POST",
        body: formData,
      }),
    }),

    deleteProduct: build.mutation({
      query: (id) => ({
        url: `/dashboard/products/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useGetProductsQuery, useAddProductMutation, useDeleteProductMutation } = productApi;
