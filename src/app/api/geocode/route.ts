import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'API key not configured' },
      { status: 500 }
    );
  }

  if (!query || query.length < 2) {
    return NextResponse.json(
      { success: false, error: 'Query must be at least 2 characters' },
      { status: 400 }
    );
  }

  try {
    const url = `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=8&appid=${OPENWEATHER_API_KEY}`;
    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      if (response.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Invalid weather API key. Please check NEXT_PUBLIC_WEATHER_API_KEY.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch location suggestions' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Transform the data for the frontend
    const suggestions = data.map((item: {
      name: string;
      local_names?: Record<string, string>;
      lat: number;
      lon: number;
      country: string;
      state?: string;
    }) => ({
      name: item.name,
      localName: item.local_names?.en || item.name,
      lat: item.lat,
      lon: item.lon,
      country: item.country,
      state: item.state,
      displayName: item.state
        ? `${item.name}, ${item.state}, ${item.country}`
        : `${item.name}, ${item.country}`,
    }));

    return NextResponse.json({ success: true, data: suggestions });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    );
  }
}
