import { useState } from "react";
import { motion } from "framer-motion";

interface CompareData {
  name: string;
  temp: number;
  humidity: number;
  wind: number;
}

export default function CompareCities({
  baseCity,
  baseTemp,
}: {
  baseCity: string;
  baseTemp: number;
}) {
  const [city, setCity] = useState("");
  const [data, setData] = useState<CompareData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    if (!city) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/weather?city=${city}`);
      const result = await res.json();

      if (!result.success) throw new Error(result.error);

      setData({
        name: result.data.name,
        temp: result.data.main.temp,
        humidity: result.data.main.humidity,
        wind: result.data.wind.speed,
      });
    } catch {
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 TEMP COLOR LOGIC
  const getTempColor = (temp: number) => {
    if (temp >= 35) return "text-red-400";
    if (temp >= 25) return "text-orange-400";
    if (temp >= 15) return "text-yellow-300";
    return "text-blue-400";
  };

  // 🔥 WINNER LOGIC
  const getWinner = () => {
    if (!data) return null;
    if (baseTemp > data.temp) return baseCity;
    if (baseTemp < data.temp) return data.name;
    return "equal";
  };

  const winner = getWinner();

  // 🔥 BAR WIDTH
  const maxTemp = data ? Math.max(baseTemp, data.temp) : baseTemp;

  return (
    <div className="mt-6 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">

      {/* 🔥 Heading */}
      <h2 className="text-xl font-semibold text-white mb-4">
        Compare Weather
      </h2>

      {/* 🔥 Input */}
      <div className="flex gap-3 mb-6">
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city..."
          className="flex-1 px-4 py-3 rounded-xl bg-white/10 text-white outline-none border border-white/10 focus:border-blue-400"
        />

        <button
          onClick={handleCompare}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:scale-105 transition"
        >
          {loading ? "..." : "Compare"}
        </button>
      </div>

      {/* 🔥 RESULT */}
      {data && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >

          {/* 🔥 WINNER BADGE */}
          <div className="text-center">
            {winner === "equal" ? (
              <p className="text-gray-300">⚖️ Both cities same temp</p>
            ) : (
              <p className="text-green-400 font-semibold">
                🔥 {winner} is hotter
              </p>
            )}
          </div>

          {/* 🔥 CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* BASE CITY */}
            <div className={`p-4 rounded-xl border ${
              winner === baseCity ? "border-green-400" : "border-white/10"
            } bg-white/5`}>
              <h3 className="text-white font-semibold">{baseCity}</h3>

              <p className={`text-3xl font-bold mt-2 ${getTempColor(baseTemp)}`}>
                {baseTemp}°C
              </p>

              {/* BAR */}
              <div className="mt-3 h-2 bg-white/10 rounded">
                <div
                  className="h-2 bg-blue-400 rounded"
                  style={{ width: `${(baseTemp / maxTemp) * 100}%` }}
                />
              </div>
            </div>

            {/* COMPARED CITY */}
            <div className={`p-4 rounded-xl border ${
              winner === data.name ? "border-green-400" : "border-white/10"
            } bg-white/5`}>
              <h3 className="text-white font-semibold">{data.name}</h3>

              <p className={`text-3xl font-bold mt-2 ${getTempColor(data.temp)}`}>
                {data.temp}°C
              </p>

              <div className="mt-3 h-2 bg-white/10 rounded">
                <div
                  className="h-2 bg-purple-400 rounded"
                  style={{ width: `${(data.temp / maxTemp) * 100}%` }}
                />
              </div>

              <div className="text-sm text-gray-300 mt-3 space-y-1">
                <p>💧 {data.humidity}%</p>
                <p>🌬 {data.wind} km/h</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
