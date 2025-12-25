import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BALLDONTLIE_API_KEY;

  // Logs whether or not key is shown in terminal
  console.log("DEBUG: API Key exists?", !!apiKey);
  console.log("DEBUG: Key Length:", apiKey?.length);
  console.log("DEBUG: Key starts with:", apiKey?.substring(0, 5));
  
  // Checks if key is actually loading
  if (!apiKey) {
    console.error("API Key is missing from environment variables");
    return NextResponse.json({ error: "Config error" }, { status: 500 });
  }

  try {
    const response = await fetch('https://nba.balldontlie.io/v1/teams', {
        headers: { 'Authorization': 'YOUR_KEY' }
    });

    const errorText = await response.text(); // Get the raw error message
    console.log("STATUS:", response.status);
    console.log("ERROR BODY:", errorText);

    if (!response.ok) {
      // Checks if error code is 401 or something else
      const errorData = await response.json();
      return NextResponse.json(
        { error: `API responded with ${response.status}`, details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
