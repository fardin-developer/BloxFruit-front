import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = 'https://api.bloxfruithub.com/api/v1';

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery:fetchBaseQuery({
        baseUrl,
        prepareHeaders:(headers,api)=>{
            const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
            if(token){
                headers.set("Authorization",`Bearer ${token}`)
            }
            return headers;
        },
    }),
    endpoints:()=>({}),
    tagTypes:["products","PaypalAccount"]

});

export const {useQuery,useMutation} = baseApi as any;
