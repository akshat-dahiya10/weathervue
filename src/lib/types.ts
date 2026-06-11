// Weather API Types for OpenWeatherMap

export interface Coordinates {
  lat: number;
  lon: number;
}

export interface WeatherCondition {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface MainWeatherData {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
}

export interface WindData {
  speed: number;
  deg: number;
  gust?: number;
}

export interface CloudsData {
  all: number;
}

export interface SysData {
  type?: number;
  id?: number;
  country: string;
  sunrise: number;
  sunset: number;
}

export interface Weather {
  coord: Coordinates;
  weather: WeatherCondition[];
  base: string;
  main: MainWeatherData;
  visibility: number;
  wind: WindData;
  clouds: CloudsData;
  sys: SysData;
  dt: number;
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

// Forecast types
export interface ForecastItem {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: WeatherCondition[];
  clouds: CloudsData;
  wind: WindData;
  visibility: number;
  pop: number;
  dt_txt: string;
}

export interface Forecast {
  cod: string;
  message: number;
  cnt: number;
  list: ForecastItem[];
  city: {
    id: number;
    name: string;
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Geocoding types for autocomplete
export interface GeoLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}

// App state types
export interface SearchCity {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}

export interface RecentSearch {
  id: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  timestamp: number;
}

export interface StoredSearchLocation {
  city: string;
  country?: string;
  lat?: number;
  lon?: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
