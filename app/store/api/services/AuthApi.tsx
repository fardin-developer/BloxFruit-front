import { baseApi } from "../baseApi";

export const AuthApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                body: data,
            }),
        }),
        sendOtp: build.mutation({
            query: (data) => ({
                url: "/user/send-otp",
                method: "POST",
                body: data,
            }),
        }),
        verifyOtp: build.mutation({
            query: (data) => ({
                url: "/user/verify-otp",
                method: "POST",
                body: data,
            }),
        }),
        getMe: build.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
        }),
        completeRegistration: build.mutation({
            query: (data) => ({
                url: "/user/complete-registration",
                method: "POST",
                body: data,
            }),
        }),
    }),
})

export const { useLoginMutation, useSendOtpMutation, useVerifyOtpMutation, useGetMeQuery, useCompleteRegistrationMutation } = AuthApi;