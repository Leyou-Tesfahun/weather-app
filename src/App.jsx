import React, { useState, useEffect } from "react";
import { useWeather } from "./hooks/useWeather";
import { useCitySearch } from "./hooks/useCitySearch";
import { WeatherService } from "./services/weatherService";
import CityDropdown from "./components/CityDropdown";
import DefaultState from "./components/DefaultState";
import ErrorAlert from "./components/ErrorAlert";
import Header from "./components/Header";
import Loader from "./components/Loader";
import SearchBar from "./components/SearchBar";
import ThemeToggle from "./components/ThemeToggle";
import UnitToggle from "./components/UnitToggle";
import WeatherCard from "./components/WeatherCard";
import WeatherStatsGrid from "./components/WeatherStatsGrid";

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
  const [theme, setTheme] = useState('light');
  const [unit, setUnit] = useState('metric'); // CHANGED: from 'celsius' to 'metric'

  // Sync theme with HTML class and localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  // Load saved theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

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

  const handleQueryChange = (value) => {
    setQuery(value);
    setSelectedIndex(-1);
    if (value.length >= 2) {
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

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleUnit = () => {
    setUnit(prev => prev === 'metric' ? 'imperial' : 'metric'); // CHANGED: from celsius/fahrenheit to metric/imperial
  };

  // Convert temperature based on unit
  const convertTemperature = (temp) => {
    if (unit === 'imperial') { // CHANGED: from 'fahrenheit' to 'imperial'
      return Math.round((temp * 9/5) + 32);
    }
    return temp;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header with Theme and Unit Toggles */}
        <Header 
          title="Weather App"
          rightSection={
            <div className="flex items-center gap-4">
              <UnitToggle unit={unit} onToggle={toggleUnit} />
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          }
        />

        {/* Search Bar Component */}
        <div className="w-full max-w-xl mx-auto mb-8 relative">
          <SearchBar
            query={query}
            onQueryChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onClear={clearSearch}
            onSubmit={handleSearch}
            onLocationClick={handleLocationClick}
            placeholder="Search for a city..."
          />
          
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

        {/* Error Alert */}
        {error && (
          <div className="max-w-2xl mx-auto mb-6">
            <ErrorAlert 
              title="Error" 
              message={error}
              type="error"
            />
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-2xl mx-auto mb-8">
            <Loader 
              message="Loading weather data..."
              showSpinner={true}
            />
          </div>
        )}

        {/* Main Weather Content */}
        {weather && !loading && (
          <>
            {/* Weather Card */}
            <div className="max-w-2xl mx-auto mb-8">
              <WeatherCard
                weather={{
                  city: weather.city,
                  country: weather.country,
                  temperature: convertTemperature(weather.temperature),
                  description: weather.description,
                  icon: weather.icon,
                  feelsLike: convertTemperature(weather.feelsLike)
                }}
                unit={unit} // Now passes 'metric' or 'imperial'
                date={WeatherService.formatDate(weather.timestamp)}
              />
            </div>

            {/* Weather Stats Grid */}
            <div className="max-w-4xl mx-auto mb-8">
              <WeatherStatsGrid
                feelsLike={convertTemperature(weather.feelsLike)}
                windSpeed={weather.windSpeed}
                humidity={weather.humidity}
                pressure={weather.pressure}
                visibility={weather.visibility}
                cloudCover={weather.cloudCover}
                unit={unit} // Now passes 'metric' or 'imperial'
              />
            </div>
          </>
        )}

        {/* Default state when no weather data */}
        {!weather && !loading && !error && (
          <div className="max-w-2xl mx-auto">
            <DefaultState 
              title="Welcome to Weather App"
              message="Search for a city or use your location to get started"
              icon="partial sun.png"
            />
          </div>
        )}
      </div>
    </div>
  );
}
