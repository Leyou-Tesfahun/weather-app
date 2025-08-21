export default function WeatherStatsGrid({ weather, unit }) {
  const speedUnit = unit === "metric" ? "km/h" : "mph";

  const stats = [
    { label: "Feels Like", value: `${weather.feelsLike}${unit === "metric" ? "°C" : "°F"}` },
    { label: "Wind Speed", value: `${weather.windSpeed} ${speedUnit}` },
    { label: "Humidity", value: `${weather.humidity}%` },
    { label: "Pressure", value: `${weather.pressure} hPa` },
    { label: "Visibility", value: `${weather.visibility} km` },
    { label: "Cloud Cover", value: `${weather.cloudCover}%` },
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
