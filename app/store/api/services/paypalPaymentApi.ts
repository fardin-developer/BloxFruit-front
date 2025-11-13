//app/store/api/services/paymentApi.tsx

import { baseApi } from '../baseApi';

export interface PaymentIntentDto {
  name: string;
  email: string;
  phone: string;
  address: string;
  amount: string | number;
  description?: string;
  notes?: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface PaypalPaymentDto extends PaymentIntentDto {}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaymentIntentResponse {
  paymentUrl: string;
  transactionId: string;
}

export interface PaypalPaymentResponse {
  approval_url: string;
  payment_id: string;
  order_id: string;
}

export interface PaymentStatusResponse {
  status: string;
  amount: number;
  currency: string;
  created_at: string;
  raw_status?: string;
}

export const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing UPI payment endpoint
    createPaymentIntent: builder.mutation<ApiResponse<PaymentIntentResponse>, PaymentIntentDto>({
      query: (data) => ({
        url: '/payments/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // New PayPal payment endpoint
    createPaypalPayment: builder.mutation<ApiResponse<PaypalPaymentResponse>, PaypalPaymentDto>({
      query: (data) => ({
        url: '/payments/paypal/create',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // Execute PayPal payment after approval
    executePaypalPayment: builder.mutation<ApiResponse<any>, { paymentId: string; payerId: string }>({
      query: ({ paymentId, payerId }) => ({
        url: '/payments/paypal/execute',
        method: 'POST',
        body: { paymentId, payerId },
      }),
      invalidatesTags: ['Payment'],
    }),
    
    // Get payment status (works for both UPI and PayPal)
    getPaymentStatus: builder.query<ApiResponse<PaymentStatusResponse>, string>({
      query: (transactionId) => `/payments/status/${transactionId}`,
      providesTags: ['Payment'],
    }),
    
    // Get all payments
    getAllPayments: builder.query<ApiResponse<any[]>, void>({
      query: () => '/payments',
      providesTags: ['Payment'],
    }),
    
    // Update order delivery status
    updateOrderDelivery: builder.mutation<ApiResponse<any>, string>({
      query: (orderId) => ({
        url: `/payments/${orderId}/delivery`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Payment'],
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreatePaypalPaymentMutation,
  useExecutePaypalPaymentMutation,
  useGetPaymentStatusQuery,
  useGetAllPaymentsQuery,
  useUpdateOrderDeliveryMutation,
} = paymentApi;