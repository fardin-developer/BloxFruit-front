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

    
  }),
});

export const { useGetProductsQuery } = productApi;
