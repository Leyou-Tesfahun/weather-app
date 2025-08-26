// src/components/WeatherStatsGrid.jsx
export default function WeatherStatsGrid({ 
  feelsLike, 
  windSpeed, 
  humidity, 
  pressure, 
  visibility, 
  cloudCover, 
  unit 
}) {
  const speedUnit = unit === "celsius" ? "km/h" : "mph"; // FIXED: Changed from "metric" to "celsius"

  const stats = [
    { label: "Feels Like", value: `${feelsLike}${unit === "celsius" ? "°C" : "°F"}` }, // FIXED
    { label: "Wind Speed", value: `${windSpeed} ${speedUnit}` },
    { label: "Humidity", value: `${humidity}%` },
    { label: "Pressure", value: `${pressure} hPa` },
    { label: "Visibility", value: `${visibility} km` },
    { label: "Cloud Cover", value: `${cloudCover}%` },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-blue-400 dark:bg-blue-600 text-white rounded-xl p-6 flex flex-col items-center"
        >
          <div className="text-lg">{stat.label}</div>
          <div className="text-2xl font-bold">{stat.value}</div>
        </div>
      ))}
    </div>
  );
}
