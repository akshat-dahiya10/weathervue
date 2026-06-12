import type { Weather, Forecast } from './types';

export function predictRainProbability(
  weather: Weather,
  forecast?: Forecast
) {
  let score = 0;

  // 🌧 If already raining
  if (
    weather.weather[0].main
      .toLowerCase()
      .includes('rain')
  ) {
    score += 40;
  }

  // ☁️ Cloud factor
  const clouds = weather.clouds?.all ?? 0;
  score += clouds * 0.3;

  // 💧 Humidity
  const humidity = weather.main.humidity;
  score += humidity * 0.2;

  // 🌬 Wind
  const wind = weather.wind.speed;
  if (wind < 2) score += 10;
  else if (wind < 5) score += 5;

  // 📊 Forecast data (REAL)
  if (forecast?.list?.length) {
    const next3 = forecast.list.slice(0, 3);

    const avgPop =
      next3.reduce(
        (acc, item) => acc + item.pop,
        0
      ) / next3.length;

    score += avgPop * 100 * 0.5;
  }

  score = Math.min(100, Math.round(score));

  let label = 'Stable';
  if (score > 70) label = 'High chance of rain';
  else if (score > 40) label = 'Possible rain';

  return {
    probability: score,
    label
  };
}
