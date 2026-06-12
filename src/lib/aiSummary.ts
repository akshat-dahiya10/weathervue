import type { Weather, Forecast } from './types';

export function generateWeatherSummary(
  weather: Weather,
  forecast?: Forecast
) {
  const temp = Math.round(weather.main.temp);
  const desc = weather.weather[0].description;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;

  let summary = '';

  // 🌡️ Temperature logic
  if (temp > 38) {
    summary += 'Extreme heat conditions expected. ';
  } else if (temp > 30) {
    summary += 'Hot weather throughout the day. ';
  } else if (temp > 20) {
    summary += 'Pleasant temperature conditions. ';
  } else {
    summary += 'Cool weather expected. ';
  }

  // 🌧️ Rain logic
  if (desc.includes('rain')) {
    summary += 'Rainfall is likely, carry an umbrella. ';
  }

  // 💨 Wind logic
  if (wind > 8) {
    summary += 'Strong winds detected. ';
  } else if (wind > 4) {
    summary += 'Moderate wind conditions. ';
  }

  // 💧 Humidity logic
  if (humidity > 70) {
    summary += 'High humidity may cause discomfort. ';
  }

  // 📊 Forecast logic (bonus)
  if (forecast?.list?.length) {
    const rainChance =
      forecast.list.slice(0, 3).reduce((a, b) => a + b.pop, 0) / 3;

    if (rainChance > 0.5) {
      summary += 'Rain chances increasing in upcoming hours. ';
    }
  }

  return summary.trim();
}
