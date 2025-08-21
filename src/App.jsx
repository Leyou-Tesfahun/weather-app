import React, { useState } from "react";
import { useWeather } from "./hooks/useWeather";
import { useCitySearch } from "./hooks/useCitySearch";
import { WeatherService } from "./services/weatherService";
import { weatherImages } from "./assets/weatherImages";
import CityDropdown from "./components/CityDropdown";

export default function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByLocation } = useWeather();
  const { 
    query, 
    setQuery, 
    suggestions, 
    isLoading: searchLoading, 
    showDropdown, 
    clearSearch, 
    hideDropdown, 
    selectCity,
    setShowDropdown
  } = useCitySearch();
  
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      fetchWeather(query.trim());
      clearSearch();
      setSelectedIndex(-1);
    }
  };

  const handleLocationClick = () => {
    fetchWeatherByLocation();
    clearSearch();
    setSelectedIndex(-1);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
    if (e.target.value.length >= 2) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          const cityKey = selectCity(suggestions[selectedIndex]);
          fetchWeather(cityKey);
          setSelectedIndex(-1);
        } else {
          handleSearch(e);
        }
        break;
      case 'Escape':
        hideDropdown();
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSelectCity = (city) => {
    const cityKey = selectCity(city);
    fetchWeather(cityKey);
    setSelectedIndex(-1);
  };

  const handleHighlight = (index) => {
    setSelectedIndex(index);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
      {/* Search Bar */}
      <div className="w-full max-w-xl mb-8 relative">
        <form onSubmit={handleSearch} className="flex items-center bg-white rounded-full shadow px-4 py-2">
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-lg"
            autoComplete="off"
          />
          {query && (
            <button 
              type="button"
              onClick={clearSearch}
              className="p-1 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
          <button type="submit" className="p-1 ml-1">
            <svg
              className="w-5 h-5 text-gray-400 hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
          <button 
            type="button"
            onClick={handleLocationClick}
            className="ml-2 p-1 text-blue-500 hover:text-blue-700"
            title="Use my location"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </button>
        </form>
        
        <CityDropdown
          suggestions={suggestions}
          isLoading={searchLoading}
          showDropdown={showDropdown}
          onSelectCity={handleSelectCity}
          onClose={hideDropdown}
          selectedIndex={selectedIndex}
          onHighlight={handleHighlight}
        />
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full max-w-2xl">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center w-full max-w-2xl mb-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-lg text-gray-600">Loading weather data...</span>
        </div>
      )}

      {/* Main Weather Card */}
      {weather && !loading && (
        <div className="bg-white rounded-2xl shadow p-8 flex items-center w-full max-w-2xl mb-8">
          <div className="flex-1">
            <div className="text-gray-500 mb-2">{WeatherService.formatDate(weather.timestamp)}</div>
            <div className="text-5xl font-bold mb-2">{weather.temperature}°C</div>
            <div className="text-lg text-gray-600 mb-2 capitalize">{weather.description}</div>
            <div className="flex items-center text-xl text-gray-700">
              <svg
                className="w-5 h-5 mr-1 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {weather.city}{weather.country && `, ${weather.country}`}
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img 
              src={WeatherService.getWeatherImage(weather.icon)}
              alt={WeatherService.getWeatherImageAlt(weather.icon)}
              className="w-20 h-20 object-contain"
              onError={(e) => {
                e.target.src = weatherImages['sun.png'];
              }}
            />
          </div>
        </div>
      )}

      {/* Weather Details Grid */}
      {weather && !loading && (
        <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
          <div className="bg-teal-400 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Feels Like</div>
            <div className="text-2xl font-bold">{weather.feelsLike}°C</div>
          </div>
          <div className="bg-blue-400 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Wind Speed</div>
            <div className="text-2xl font-bold">
              {weather.windSpeed} <span className="text-base font-normal">km/h</span>
            </div>
          </div>
          <div className="bg-teal-300 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Humidity</div>
            <div className="text-2xl font-bold">{weather.humidity}%</div>
          </div>
          <div className="bg-yellow-300 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Pressure</div>
            <div className="text-2xl font-bold">
              {weather.pressure} <span className="text-base font-normal">hPa</span>
            </div>
          </div>
          <div className="bg-cyan-300 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Visibility</div>
            <div className="text-2xl font-bold">
              {weather.visibility} <span className="text-base font-normal">km</span>
            </div>
          </div>
          <div className="bg-purple-400 text-white rounded-xl p-6 flex flex-col items-center">
            <div className="text-lg">Cloud Cover</div>
            <div className="text-2xl font-bold">{weather.cloudCover}%</div>
          </div>
        </div>
      )}

      {/* Default state when no weather data */}
      {!weather && !loading && !error && (
        <div className="bg-white rounded-2xl shadow p-8 flex items-center justify-center w-full max-w-2xl mb-8">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <img 
                src={weatherImages['partial sun.png']}
                alt="Weather"
                className="w-16 h-16 object-contain"
                onError={(e) => {
                  e.target.src = weatherImages['sun.png'];
                }}
              />
            </div>
            <div className="text-xl text-gray-600 mb-2">Welcome to Weather App</div>
            <div className="text-gray-500">Search for a city or use your location to get started</div>
          </div>
        </div>
      )}
    </div>
  );
}

