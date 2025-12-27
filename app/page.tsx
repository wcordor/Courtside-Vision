import { BalldontlieAPI } from "@balldontlie/sdk";
import { MOCK_TEAMS, Team } from "@/mockTeams";
import { MOCK_GAMES, Game } from "@/mockGames";

export default async function HomePage() {
  const apiKey = process.env.BALLDONTLIE_API_KEY || "";
  
  // Initialize with mocks as starting point
  let teams: Team[] = MOCK_TEAMS;
  let isMock = true;

  try {
    // Checks if key is being read
    console.log("Attempting API Fetch with key:", apiKey ? "EXISTS" : "MISSING");

    // Fetch data using SDK
    const api = new BalldontlieAPI({ apiKey });
    const response = await api.nba.getTeams();

    // Verify that data is actually there and are no errors are occurring
    if (response && response.data && response.data.length > 0) {
      teams = response.data as Team[];
      isMock = false;
      console.log("SUCCESS: Live data loaded.");
    }
  } catch (error: any) {
    // Catch 429 & 401 errors specifically
    console.error("API Error - Falling back to Mocks:", error.message);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h1>{isMock ? "NBA Teams (Demo Mode)" : "NBA Teams (2025-26)"}</h1>
        {isMock && (
          <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.5rem', borderRadius: '4px' }}>
            <strong>Note:</strong> You are seeing mock data because the API limit was reached or the key is missing.
          </p>
        )}
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
        gap: '1rem' 
      }}>
        {teams.map((team) => (
          <div key={team.id} style={{ 
            border: '1px solid #ddd', 
            padding: '1rem', 
            borderRadius: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>{team.full_name}</h3>
            <span style={{ 
              fontSize: '0.8rem', 
              background: '#eee', 
              padding: '2px 8px', 
              borderRadius: '12px' 
            }}>
              {team.conference}
            </span>
          </div>
        ))}
      </div>
      {/* --- Independent Matchboard Test --- */}
      <section style={{ marginTop: '4rem', borderTop: '2px solid #eee', paddingTop: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem' }}>Live Matchboard (Test Bench)</h2>
  
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {MOCK_GAMES.map((game) => (
            <div key={game.id} style={{ 
              backgroundColor: '#1a1a1a', 
              color: 'white', 
              padding: '1.5rem', 
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              {/* Header: Status */}
              <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase' }}>
                {game.status} - Period {game.period}
              </div>

              {/* Home Team */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.home_team.full_name}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.home_team_score}</span>
              </div>

              {/* Visitor Team */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.visitor_team.full_name}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.visitor_team_score}</span>
              </div>

              {/* Footer: Date */}
              <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                {game.datetime && !isNaN(Date.parse(game.datetime)) 
                  ? `Scheduled: ${new Date(game.datetime).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    timeZone: 'UTC' 
                    })}`
                  : `Date: ${game.date}` 
                }
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
