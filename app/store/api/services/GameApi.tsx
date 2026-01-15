import { baseApi } from "../baseApi";

export interface Game {
    _id: string;
    name: string;
    image: string;
    productId: string;
    publisher: string;
    ogcode: string;
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
    }),
});

export const { useGetAllGamesQuery, useGetGameProductsQuery } = GameApi;
