import { BalldontlieAPI } from "@balldontlie/sdk";
import { MOCK_TEAMS, Team } from "@/mockTeams"; // Import both the data and the interface

export default async function HomePage() {
  const api = new BalldontlieAPI({ apiKey: process.env.BALLDONT_LIE_API_KEY || "" });
  
  // 'teams' is an array of 'Team'
  let teams: Team[] = MOCK_TEAMS; 
  let isMock = true;

  try {
    const response = await api.nba.getTeams();
    // Some versions of SDK return 'directly return data, whereas others may wrap it
    teams = response.data as Team[]; 
    isMock = false;
  } catch (error) {
    console.log("Using fallback mock data.");
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1>{isMock ? "NBA Teams (Offline)" : "NBA Teams (Live)"}</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {teams.map((team) => (
          <div key={team.id} style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
            <h3>{team.full_name}</h3>
            <p>{team.conference} Conference</p>
          </div>
        ))}
      </div>
    </main>
  );
}
