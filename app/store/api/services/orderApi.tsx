import { baseApi } from "../baseApi";

 
 export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: () => ({
                url: "/upi-payment/all",
                method: "GET",
            }),
        }),

        updateOrderStatus: builder.mutation({
            query: ({ order_id, status }) => ({
                url: `/upi-payment/order-delivery/${order_id}`,
                method: "PUT",
                body: { status },
            }),
        }),
    }),
 });

 export const { useGetOrdersQuery } = orderApi;
 