// Shape of Team object 
export interface Team {
  id: number;
  full_name: string;
  abbreviation: string;
  conference: string;
  city: string;
  division: string;
  name: string;
}

export const MOCK_TEAMS: Team[] = [
  { 
    id: 1, 
    full_name: "Atlanta Hawks", 
    abbreviation: "ATL", 
    conference: "East",
    city: "Atlanta",
    division: "Southeast",
    name: "Hawks"
  },
  { 
    id: 2, 
    full_name: "Boston Celtics", 
    abbreviation: "BOS", 
    conference: "East",
    city: "Boston",
    division: "Atlantic",
    name: "Celtics"
  }
];
