'use server'
import { Game, MOCK_GAMES } from "@/mockGames";
import { BalldontlieAPI } from "@balldontlie/sdk";

export async function getGamesByDate(date: string) {
    const apiKey = process.env.BALLDONTLIE_API_KEY || "";

    let games: Game[] = MOCK_GAMES;

    try {
        const api = new BalldontlieAPI({ apiKey });
        const gameResponse = await api.nba.getGames({ dates: [date] });
        
        const dataToUse = gameResponse.data ? (Array.isArray(gameResponse.data) ? gameResponse.data : [gameResponse.data]) : [gameResponse];
        
        if (dataToUse && dataToUse.length > 0) {
            games = (dataToUse as unknown) as Game[];
        }
    } catch (error: any) {
        console.error("API Error - Falling back to Mocks:", error.message);
    }
}
