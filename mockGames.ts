import { Team } from "@/mockTeams";
// Shape of Game object 
export interface Game {
  id: number;
  date: string;
  season: number;
  status: "Final" | "Scheduled" | string;
  period: number;
  time: string;
  postseason: boolean;
  home_team_score: number;
  visitor_team_score: number;
  datetime: string;
  home_q1: number;
  home_q2: number;
  home_q3: number;
  home_q4: number;
  home_ot1: number | null;
  home_ot2: number | null;
  home_ot3: number | null;
  home_timeouts_remaining: number | null;
  home_in_bonus: boolean | null;
  visitor_q1: number;
  visitor_q2: number;
  visitor_q3: number;
  visitor_q4: number;
  visitor_ot1: number | null;
  visitor_ot2: number | null;
  visitor_ot3: number | null;
  visitor_timeouts_remaining: number | null;
  visitor_in_bonus: boolean | null;
  ist_stage: string | null;
  home_team: Team;
  visitor_team: Team;
}

export const MOCK_GAMES: Game[] = [
    {
        id: 1,
        date: "2025-12-26",
        season: 2025,
        status: "Final",
        period: 4,
        time: "Final",
        postseason: false,
        home_team_score: 122,
        visitor_team_score: 140,
        datetime: "2025-12-26T19:00:00.000Z",
        home_q1: 39,
        home_q2: 22,
        home_q3: 30,
        home_q4: 31,
        home_ot1: null,
        home_ot2: null,
        home_ot3: null,
        home_timeouts_remaining: null,
        home_in_bonus: null,
        visitor_q1: 28,
        visitor_q2: 47,
        visitor_q3: 36,
        visitor_q4: 29,
        visitor_ot1: null,
        visitor_ot2: null,
        visitor_ot3: null,
        visitor_timeouts_remaining: null,
        visitor_in_bonus: null,
        ist_stage: null,
        home_team: {
            id: 1,
            full_name: "Indiana Pacers",
            abbreviation: "IND",
            conference: "East",
            city: "Indianapolis",
            division: "Central",
            name: "Pacers"
        },
        visitor_team: {
            id: 2,
            full_name: "Boston Celtics",
            abbreviation: "BOS",
            conference: "East",
            city: "Boston",
            division: "Atlantic",
            name: "Celtics"
        }
    }
];
