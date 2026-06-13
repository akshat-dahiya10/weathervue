import type { Weather } from "@/lib/types";

export function getAIInsight(weather: Weather): string {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const wind = weather.wind.speed;
  const condition = weather.weather[0].main;

  if (condition.includes("Rain")) {
    return "Rain expected 🌧️ due to atmospheric conditions.";
  }

  if (humidity > 80) {
    return "High humidity detected — chances of rain 🌦️.";
  }

  if (wind > 10) {
    return "Strong winds 🌬️ — stay cautious outdoors.";
  }

  if (temp > 35) {
    return "Extreme heat 🔥 — avoid going out in afternoon.";
  }

  if (temp < 10) {
    return "Cold weather ❄️ — keep yourself warm.";
  }

  return "Weather looks stable and normal 👍";
}

export function getOutfitSuggestion(weather: Weather): string {
  const temp = weather.main.temp;
  const condition = weather.weather[0].main;

  if (condition.includes("Rain")) {
    return "☔ Carry umbrella + wear waterproof footwear";
  }

  if (temp > 30) {
    return "👕 Wear light cotton clothes & stay hydrated";
  }

  if (temp < 15) {
    return "🧥 Wear jacket or warm clothes";
  }

  return "👕 Comfortable casual wear recommended";
}
