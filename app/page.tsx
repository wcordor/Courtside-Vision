import { BalldontlieAPI } from "@balldontlie/sdk";
import { MOCK_TEAMS, Team } from "@/mockTeams";
import { MOCK_GAMES, Game } from "@/mockGames";

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

    const gameResponse = await api.nba.getGame(15907925);
    console.log("Response Type:", typeof gameResponse) // Diagnostic: Identify if SDK response is a 'Box' (wrapper) or the 'Item' (game object)
    
    // Normalization: Extract Game object from response wrapper
    const dataToUse = gameResponse.data ? (Array.isArray(gameResponse.data) ? gameResponse.data : [gameResponse.data]) : [gameResponse];

    if (dataToUse && dataToUse.length > 0) {
      games = (dataToUse as unknown) as Game[];
      mockGames = false;
      console.log("DEBUG GAME:", gameResponse);
    }

  } catch (error: any) {
    // Catch 429 & 401 errors specifically
    console.error("API Error - Falling back to Mocks:", error.message);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <h1>{"Courtside Vision"}</h1>
        <input type="text" placeholder="Search teams or games" style={{ backgroundColor: '#000000ff', color: '#ffffff', borderRadius: '8px',
           padding: '0.3rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #f1ededbe' }}/>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </header>

        {mockTeams && (
          <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.5rem', borderRadius: '4px' }}>
            <strong>Note:</strong> You are seeing mock data because the API limit was reached or the key is missing.
          </p>
        )}

      <section style={{ borderBottom: '0rem' }}>
        
          <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0' }}>

            <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 8px', cursor: 'pointer',
              textAlign: 'center', textIndent: '5px', width: '130px', borderRadius: '4px' }}>
              <option>Today</option> 
              <option>Yesterday</option> 
              <option>Specific Date</option>
            </select>
          
          <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 8px', cursor: 'pointer',
            textAlign: 'center', borderRadius: '4px' }}>
            <option>All Teams</option> <option>Atlanta Hawks</option> <option>Specific Date</option> {/* add in all 30 teams */}
          </select>

          <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 8px', cursor: 'pointer',
            textAlign: 'center', borderRadius: '4px' }}>
            <option>Start Time</option> <option>Score</option>
          </select>

        </div>

      </section>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {games.map((game) => (
          <div key={game.id} style={{ 
            backgroundColor: '#1a1a1a', 
            color: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {/* Header: Status */}
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {game.status} {game.time !== game.status ? `| ${game.time}` : ''} - Period {game.period}
            </div>

            {/* Home Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.home_team?.full_name}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.home_team_score}</span>
            </div>

            {/* Visitor Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.visitor_team?.full_name}</span>
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
    </main>
  );
}
