"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  baseCity: string;
}

export default function CompareCities({ baseCity }: Props) {
  const [compareCity, setCompareCity] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

  const handleCompare = async () => {
    if (!compareCity) return;

    try {
      setLoading(true);

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${compareCity}&appid=${API_KEY}&units=metric`
      );

      const result = await res.json();

      if (result.cod !== 200) {
        alert("City not found ❌");
        return;
      }

      setData(result);
    } catch (err) {
      alert("Error fetching data ⚠️");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-semibold mb-4">
        Compare with {baseCity}
      </h2>

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Enter city name"
          value={compareCity}
          onChange={(e) => setCompareCity(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg bg-white/20 outline-none"
        />

        <button
          onClick={handleCompare}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          {loading ? "Loading..." : "Compare"}
        </button>
      </div>

      {data && (
        <motion.div
          className="mt-6 grid grid-cols-2 gap-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white/10 p-4 rounded-xl">
            <p className="text-sm text-gray-300">{data.name}</p>
            <p className="text-2xl font-bold">
              {data.main.temp}°C
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
