// components/WeatherCard.jsx
import React from "react";
import { WeatherService } from "../services/weatherService"; // Import WeatherService

export default function WeatherCard({ weather, unit, date }) {
  if (!weather) return null; // Add null check
  
  const tempUnit = unit === "metric" ? "°C" : "°F";
  
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg p-8 flex flex-col sm:flex-row items-center gap-6">
      <div className="flex-1">
        <div className="text-gray-500 dark:text-gray-400">{date}</div>
        <div className="text-5xl font-bold my-2">
          {weather.temperature}{tempUnit}
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
          e.currentTarget.src = WeatherService.getWeatherImage('01d'); // Fallback to sunny image
        }}
        className="w-24 h-24 object-contain"
      />
    </div>
  );
}
