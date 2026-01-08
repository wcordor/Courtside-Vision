import { BalldontlieAPI } from "@balldontlie/sdk";
import { MOCK_TEAMS, Team } from "@/mockTeams";
import { MOCK_GAMES, Game } from "@/mockGames";
import Dashboard from "./dashboard";

export const revalidate = 60; // Refresh data every 60 seconds at most

export default async function HomePage() {
  const apiKey = process.env.BALLDONTLIE_API_KEY || "";
  
  // Initialize with mocks as starting point
  let teams: Team[] = MOCK_TEAMS;
  let mockTeams = true;
  let games: Game[] = MOCK_GAMES;
  let mockGames = true;

  try {
    // Checks if key is being read
    console.log("Attempting API Fetch with key:", apiKey ? "EXISTS" : "MISSING");

    // Fetch data using SDK
    const api = new BalldontlieAPI({ apiKey });
    const teamResponse = await api.nba.getTeams();

    // Verify that team data is actually there and are no errors are occurring
    if (teamResponse && teamResponse.data && teamResponse.data.length > 0) {
      teams = teamResponse.data as Team[];
      mockTeams = false;
      console.log("SUCCESS: Live data loaded.");
    }

    const getRelativeDate = (offset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      return date.toISOString().split('T')[0];
    }

    const today = getRelativeDate(0);
    const yesterday = getRelativeDate(-1);
    const tomorrow = getRelativeDate(1);

    const dateStrings = [yesterday, today, tomorrow];

    const dates = dateStrings;
    const gameResponse = await api.nba.getGames({ dates });
    console.log("Fetched Games:", games.length);
    
    // If gameResponse data exists, check if it's an array. If not, wrap it in [].
    const dataToUse = gameResponse.data ? (Array.isArray(gameResponse.data) ? gameResponse.data : [gameResponse.data]) : [gameResponse];

    if (dataToUse && dataToUse.length > 0) {
      games = (dataToUse as unknown) as Game[];
      mockGames = false;
    }

  } catch (error: any) {
    // Catch 429 & 401 errors specifically
    console.error("API Error - Falling back to Mocks:", error.message);
  }

  return <Dashboard initialGames={games} isUsingMock={mockGames}/>

}
