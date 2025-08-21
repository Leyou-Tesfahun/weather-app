import { weatherImages } from "../assets/weatherImages";

export default function DefaultState() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex flex-col items-center w-full max-w-2xl mb-8">
      <img src={weatherImages["partial sun.png"]} alt="Weather" className="w-16 h-16 mb-4" />
      <div className="text-xl text-gray-600 dark:text-gray-300 mb-2">Welcome to Weather App</div>
      <div className="text-gray-500 dark:text-gray-400">Search for a city or use your location to get started</div>
    </div>
  );
}
