import { BalldontlieAPI } from "@balldontlie/sdk";
import { MOCK_TEAMS, Team } from "@/mockTeams";

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
        <h1>{isMock ? "NBA Teams (Demo Mode)" : "NBA Teams (Live 2024)"}</h1>
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
    </main>
  );
}
