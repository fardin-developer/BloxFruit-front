import { baseApi } from "../baseApi";

 
 export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => ({
                url: "/upi-payment/all",
                method: "GET",
            }),
        }),
    }),
 });

 export const { useGetOrdersQuery } = orderApi;
 