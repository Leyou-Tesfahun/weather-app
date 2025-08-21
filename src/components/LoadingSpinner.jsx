export default function LoadingSpinner() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 flex items-center justify-center w-full max-w-2xl mb-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <span className="ml-4 text-lg text-gray-600 dark:text-gray-300">Loading weather data...</span>
    </div>
  );
}
