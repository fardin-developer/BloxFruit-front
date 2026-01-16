import { baseApi } from "../baseApi";

export interface OrderItem {
    itemId: string;
    itemName: string;
    quantity: number;
    price: number;
    _id: string;
}

export interface Order {
    _id: string;
    userId: string;
    orderType: string;
    orderId: string;
    gameName: string;
    amount: number;
    currency: string;
    status: string;
    manualOrder: boolean;
    paymentMethod: string;
    items: OrderItem[];
    description: string;
    nextStatusCheck: string;
    statusCheckCount: number;
    maxStatusChecks: number;
    retryCount: number;
    lastRetryAt: string | null;
    apiResults: any[];
    retryHistory: any[];
    createdAt: string;
    updatedAt: string;
}

export interface OrderHistoryResponse {
    success: boolean;
    orders: Order[];
    pagination: {
        currentPage: number;
        totalPages: number;
        totalOrders: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface OrderHistoryParams {
    page?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
}
 
export const orderApi = baseApi.injectEndpoints({
   endpoints: (builder) => ({
       getOrders: builder.query({
           query: (params?: { page?: number; limit?: number }) => ({
               url: "/upi-payment/all",
               method: "GET",
               params: {
                   page: params?.page || 1,
                   limit: params?.limit || 10,
               },
           }),
       }),

        updateOrderStatus: builder.mutation({
            query: ({ order_id, status }) => ({
                url: `/upi-payment/order-delivery/${order_id}`,
                method: "PATCH",
                body: { status },
            }),
        }),

        getOrderStatus: builder.query({
            query: (orderId: string) => ({
                url: `/order/order-status?orderId=${orderId}`,
                method: "GET",
            }),
        }),

        getOrderHistory: builder.query<OrderHistoryResponse, OrderHistoryParams>({
            query: (params) => ({
                url: "/order/history",
                method: "GET",
                params: {
                    page: params?.page || 1,
                    limit: params?.limit || 10,
                    startDate: params?.startDate,
                    endDate: params?.endDate,
                },
            }),
        }),
    }),
 });

 export const { useGetOrdersQuery, useUpdateOrderStatusMutation, useGetOrderStatusQuery, useGetOrderHistoryQuery } = orderApi;
 