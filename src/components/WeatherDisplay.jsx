export default function WeatherDisplay({ data, unit }) {
  const tempUnit = unit === "metric" ? "°C" : "°F";
  const speedUnit = unit === "metric" ? "m/s" : "mph";

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-2xl shadow-lg text-center w-full max-w-md mx-auto border border-gray-200 dark:border-gray-700">
      {/* Location */}
      <h2 className="text-2xl font-semibold mb-1">
        {data.name}, {data.sys.country}
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Current Weather</p>

      {/* Weather Icon */}
      <img
        src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`}
        alt={`Weather icon: ${data.weather[0].description}`}
        className="mx-auto w-20 h-20"
      />

      {/* Temperature & Description */}
      <p className="text-5xl font-bold mb-1">
        {Math.round(data.main.temp)}{tempUnit}
      </p>
      <p className="capitalize text-gray-600 dark:text-gray-300 text-lg mb-4">
        {data.weather[0].description}
      </p>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
          <span role="img" aria-label="Humidity">💧</span> Humidity:{" "}
          <span className="font-semibold">{data.main.humidity}%</span>
        </div>

        <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
          <span role="img" aria-label="Wind">💨</span> Wind:{" "}
          <span className="font-semibold">{data.wind.speed} {speedUnit}</span>
        </div>

        {data.visibility !== undefined && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
            <span role="img" aria-label="Visibility">👁</span> Visibility:{" "}
            <span className="font-semibold">
              {(data.visibility / 1000).toFixed(1)} km
            </span>
          </div>
        )}

        {data.clouds?.all !== undefined && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg shadow-sm">
            <span role="img" aria-label="Cloud Cover">☁️</span> Cloud Cover:{" "}
            <span className="font-semibold">{data.clouds.all}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

