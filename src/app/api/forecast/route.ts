import { NextRequest, NextResponse } from 'next/server';

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city');
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');

  if (!OPENWEATHER_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'API key not configured' },
      { status: 500 }
    );
  }

  if (!city && (!lat || !lon)) {
    return NextResponse.json(
      { success: false, error: 'City name or coordinates required' },
      { status: 400 }
    );
  }

  try {
    let url: string;
    
    if (lat && lon) {
      url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    } else {
      url = `${BASE_URL}/forecast?q=${encodeURIComponent(city!)}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    }

    const response = await fetch(url, { cache: 'no-store' });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { success: false, error: 'Forecast not available for this location' },
          { status: 404 }
        );
      }

      if (response.status === 401) {
        return NextResponse.json(
          { success: false, error: 'Invalid weather API key. Please check NEXT_PUBLIC_WEATHER_API_KEY.' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Failed to fetch forecast data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Network error. Please try again.' },
      { status: 500 }
    );
  }
}
