export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const city = searchParams.get("city");
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  try {
    let url = "";

    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;
    }

    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      return Response.json({ success: false, error: data.message });
    }

    return Response.json({ success: true, data });
  } catch (err) {
    return Response.json({ success: false, error: "Server error" });
  }
}
