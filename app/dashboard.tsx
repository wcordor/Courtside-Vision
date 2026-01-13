'use client';
import { Game, MOCK_GAMES } from "@/mockGames";
import { useEffect, useState } from "react";
import { getGamesByDate } from "./actions";

const getRelativeDate = (offset: number) => {

  // Today's date according to EST
  const ETString = new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York'
  });

  // 'T00:00:00' ensures timezone doesn't shift
  const date = new Date(`${ETString}T00:00:00`);

  date.setDate(date.getDate() + offset);

  // Returns date in YYYY-MM-DD format
  return date.toISOString().split('T')[0];
};

export default function Dashboard({ initialGames, isUsingMock }: { initialGames: Game[], isUsingMock: boolean }) {

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(getRelativeDate(0));
  const [selectedTeam, setSelectedTeam] = useState("All Teams");
  const [isCustomDate, setIsCustomDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extraGames, setExtraGames] = useState<Game[]>(() => {

    // Checks if we are in browser or not
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("courtside_cache");

      if (saved) {
        const parsed = JSON.parse(saved) as Game[];

        // Only keeps games that have finished
        // Re-fetches unfinished games to get latest scores
        return parsed.filter(game => game.status === 'Final');
      }
    }
    return [];
  });

  const [fetchError, setFetchError] = useState<string | null>(null);

  const allGames = Array.from(
    new Map([...initialGames, ...extraGames].map(game => [game.id, game])).values()
  );

  const filteredGames = allGames.filter(game => {
    console.log("Comparing:", game.date, "to", selectedDate);

    const matchesSearch = game.home_team.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.visitor_team.full_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = game.date.slice(0, 10) === selectedDate;

    const matchesTeam = selectedTeam === "All Teams" || game.home_team.full_name === selectedTeam ||
      game.visitor_team.full_name === selectedTeam;

    return matchesSearch && matchesDate && matchesTeam;
  });
  
  const getGameStatus = (game: Game) => {
    if (game.period === 0) return "Scheduled";
    if (game.status === "Final") return "Final";
    return `Q${game.period} - ${game.time}`;
  };

  const isFuture = (game: Game) => {
    if (game.period === 0) return true;
    return false;
  }

  const isLive = (game: Game) => {
    if (game.status !== "Final" && game.period !== 0) return true;
    return false;
  }

  const isFinal = (game: Game) => {
    if (game.status === "Final") return true;
    return false;
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "custom") {
      setIsCustomDate(true);
    }
    else {
      setIsCustomDate(false);
      setSelectedDate(value);
    }
  };

  const handleManualFetch = async () => {
    setIsLoading(true);
    setFetchError(null);
    try {
      console.log("Fetching new data for:", selectedDate);

      // Calls server action
      const newGames = await getGamesByDate(selectedDate);

      const isRealData = newGames.length > 0 && newGames[0].date.includes(selectedDate);

      if (isRealData) {
        setExtraGames((prev) => {
          const combined = [...prev, ...newGames];

          const unique = Array.from(
            new Map(combined.map((g) => [g.id, g])).values()
          );

          if (typeof window !== "undefined") {
            localStorage.setItem("courtside_cache", JSON.stringify(unique));
          }

          return unique;
        });
      }

      else {
        setFetchError("Rate limit reached or no data found. Please try again in 60s.");
      }
    } catch (error) {
      setFetchError("An unexpected error occurred.")
    } finally {
      setIsLoading(false);
    }
  };

  return (

    <main style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
        <h1>{"Courtside Vision"}</h1>
        <input type="text" placeholder="Search teams or games" style={{ backgroundColor: '#000000ff', color: '#ffffff', borderRadius: '8px',
          padding: '0.3rem', textAlign: 'center', fontSize: '0.9rem', border: '1px solid #f1ededbe' }}
          value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </header>

      {isUsingMock && (
        <p style={{ color: '#856404', backgroundColor: '#fff3cd', padding: '0.5rem', borderRadius: '4px' }}>
          <strong>Note:</strong> Using mock data.
        </p>
      )}

      {initialGames.length > 0 ? new Date(selectedDate + "T00:00:00").toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : "No Games Scheduled"}

      <section style={{ borderBottom: '0rem' }}>
        
        <div style={{ display: 'flex', gap: '1rem', padding: '1rem 0' }}>

          <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 8px', cursor: 'pointer',
            textAlign: 'center', borderRadius: '4px' }} value={isCustomDate ? "custom" : selectedDate} onChange={handleDateChange}>
              <option value={getRelativeDate(-1)}>Yesterday</option><option value={getRelativeDate(0)}>Today</option><option value={getRelativeDate(1)}>Tomorrow</option>
                <option value="custom">Specific Date</option>
          </select>

          {isCustomDate && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}
                style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33',
                padding: '4px', borderRadius: '4px' }}>                 
              </input>
              <button 
                onClick={handleManualFetch}
                disabled={isLoading}
                style={{ 
                  padding: '4px 12px', 
                  backgroundColor: isLoading ? '#333' : '#007bff', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {isLoading ? '...' : 'Fetch'}
              </button>
            </div>
          )}
          
          <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 8px', cursor: 'pointer',
            textAlign: 'center', borderRadius: '4px' }}>
            <option>All Teams</option><option>Atlanta Hawks</option> <option>Specific Date</option> {/* add in all 30 teams */}
          </select>

          <select style={{ background: '#1a1a1a', color: 'white', border: '1px solid #ffffff33', appearance: 'none', padding: '4px 16px', cursor: 'pointer',
            textAlign: 'center', borderRadius: '4px' }}>
            <option>Start Time</option> <option>Score</option>
          </select>

        </div>

      </section>

      {isLoading && (
        <div className="text-center p-4 animate pulse">
          Searching archives for {selectedDate}...
        </div>
      )}

      {!isLoading && fetchError && (
        <div style={{ color: '#ff4d4d', textAlign: 'center', padding: '1rem' }}>
          {fetchError}
        </div>
      )}
      
      {!isLoading && !fetchError && filteredGames.length === 0 && (
        <div className="text-center p-4">
          {allGames.some(game => game.date.includes(selectedDate))
            ? "No games scheduled for this date." : "Select \"Fetch\" to see games."
          }        
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {filteredGames.map((game) => (
          <div key={game.id} style={{ 
            backgroundColor: '#1a1a1a', 
            color: 'white', 
            padding: '1.5rem', 
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            {/* Header: Status */}
            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#aaa', marginBottom: '1rem', textTransform: 'uppercase' }}>
              {getGameStatus(game)}
            </div>

            {/* Home Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.home_team.full_name}</span>
              {!isFuture(game) && <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.home_team_score}</span>}
            </div>

            {/* Visitor Team */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{game.visitor_team.full_name}</span>
              {!isFuture(game) && <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{game.visitor_team_score}</span>}
            </div>

            {/* Footer */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '0.5rem', fontSize: '0.8rem', color: '#888', textAlign: 'center' }}>
              {isFinal(game) ? <span style={{ fontSize: '0.8rem', color: '#aaa', marginBottom: '4rem' }}>Final Score</span> :
                isLive(game) ? <span style={{ fontSize: '0.8rem', color: '#f00', marginBottom: '4rem' }}>Live</span> :
                (game.datetime && !isNaN(Date.parse(game.datetime)) ? `${new Date(game.datetime).toLocaleTimeString('en-US', { 
                  hour: 'numeric', 
                  minute: '2-digit', 
                  timeZoneName: 'short' 
                  })}`
                : `Date: ${game.date}` 
                )
              }
              </div>
            </div>
          ))}
        </div>
    </main>
  );
}
