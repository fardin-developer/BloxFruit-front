import { baseApi } from "../baseApi";

export interface Game {
    _id: string;
    name: string;
    image: string;
    productId: string;
    publisher: string;
    ogcode: string;
    category?: string;
}

export const GameApi = baseApi.injectEndpoints({
    endpoints: (build) => ({
        getAllGames: build.query<{ success: boolean; count: number; games: Game[] }, void>({
            query: () => ({
                url: "/games/get-all",
                method: "GET",
            }),
        }),
        getGameProducts: build.query<any, string>({
            query: (id) => ({
                url: `/games/${id}/diamond-packs`,
                method: "GET",
            }),
        }),
        validateUser: build.mutation<any, { gameId: string; playerId: string; serverId?: string; game?: string }>({
            query: (data) => ({
                url: "/games/validate-user",
                method: "POST",
                body: data,
            }),
        }),
        createDiamondPackOrder: build.mutation<any, { diamondPackId: string; playerId: string; server?: string; quantity: number }>({
            query: (data) => ({
                url: "/order/diamond-pack",
                method: "POST",
                body: data,
            }),
        }),
        createDiamondPackUpiOrder: build.mutation<any, { diamondPackId: string; playerId: string; server?: string; quantity: number; redirectUrl: string }>({
            query: (data) => ({
                url: "/order/diamond-pack-upi",
                method: "POST",
                body: data,
            }),
        }),
    }),
});

export const { 
    useGetAllGamesQuery, 
    useGetGameProductsQuery,
    useValidateUserMutation,
    useCreateDiamondPackOrderMutation,
    useCreateDiamondPackUpiOrderMutation
} = GameApi;
