import { baseApi } from "../baseApi";

export const emailSubscriptionApi =baseApi.injectEndpoints({
    endpoints: (builder) => ({
        subscribeToEmail: builder.mutation({
            query: (email) => ({
                url: "/admin/subscribe",
                method: "POST",
                body: email,
            }),
        }),
    }),
})

export const { useSubscribeToEmailMutation } = emailSubscriptionApi;