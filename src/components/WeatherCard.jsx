// src/components/WeatherCard.jsx
import React from "react";
import { WeatherService } from "../services/weatherService";

export default function WeatherCard({ weather, unit, date }) {
  if (!weather) return null;
  
  const tempUnit = unit === "celsius" ? "°C" : "°F"; // FIXED: Changed from "metric" to "celsius"
  
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1">
        <div className="text-gray-500 dark:text-gray-400">{date}</div>
        <div className="text-5xl font-bold my-2">
          {weather.temperature}{tempUnit} {/* Now shows correct symbol */}
        </div>
        <div className="text-lg capitalize">{weather.description}</div>
        <div className="flex items-center text-gray-600 dark:text-gray-300 mt-2">
          <span role="img" aria-label="Location">📍</span>
          <span className="ml-1">{weather.city}{weather.country && `, ${weather.country}`}</span>
        </div>
      </div>
      <img
        src={WeatherService.getWeatherImage(weather.icon)}
        alt={WeatherService.getWeatherImageAlt(weather.icon)}
        onError={(e) => {
          e.currentTarget.src = WeatherService.getWeatherImage('01d');
        }}
        className="w-24 h-24 object-contain"
      />
    </div>
  );
}
