"use client";

export default function CompareWeather({ city1, city2 }: any) {
  if (!city1 || !city2) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      
      {/* City 1 */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          {city1.name}
        </h2>
        <p>🌡️ Temp: {Math.round(city1.main.temp)}°C</p>
        <p>💧 Humidity: {city1.main.humidity}%</p>
        <p>💨 Wind: {city1.wind.speed} m/s</p>
        <p>☁️ {city1.weather[0].description}</p>
      </div>

      {/* City 2 */}
      <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
        <h2 className="text-xl font-semibold mb-4">
          {city2.name}
        </h2>
        <p>🌡️ Temp: {Math.round(city2.main.temp)}°C</p>
        <p>💧 Humidity: {city2.main.humidity}%</p>
        <p>💨 Wind: {city2.wind.speed} m/s</p>
        <p>☁️ {city2.weather[0].description}</p>
      </div>

    </div>
  );
}
