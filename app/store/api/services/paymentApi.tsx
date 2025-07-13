import { baseApi } from "../baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        createPaymentIntent: build.mutation({
            query: (formData) => ({
                url: "/mobalegends-payment",
                method: "POST",
                body: formData,
            }),
        }),
    }),
})

export const { useCreatePaymentIntentMutation } = paymentApi;