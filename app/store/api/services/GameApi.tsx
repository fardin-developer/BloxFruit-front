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
    }),
});

export const { useGetAllGamesQuery } = GameApi;
