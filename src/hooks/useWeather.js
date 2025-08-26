// hooks/useWeather.js
import { useState, useEffect } from 'react';
import { WeatherService } from '../services/weatherService';

export function useWeather(initialCity = 'San Francisco') {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null); // Add forecast state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(initialCity);

  const fetchWeather = async (searchCity) => {
    if (!searchCity?.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const weatherData = await WeatherService.getCurrentWeather(searchCity);
      setWeather(weatherData);
      setCity(searchCity);
      
      // Optionally fetch forecast
      try {
        const forecastData = await WeatherService.getForecast(searchCity);
        setForecast(forecastData);
      } catch (forecastError) {
        console.warn('Forecast not available:', forecastError);
      }
    } catch (err) {
      setError(err.message);
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const weatherData = await WeatherService.getCurrentWeatherByCoords(latitude, longitude);
          setWeather(weatherData);
          setCity(weatherData.city);
          
          // Optionally fetch forecast for location
          try {
            const forecastData = await WeatherService.getForecast(weatherData.city);
            setForecast(forecastData);
          } catch (forecastError) {
            console.warn('Forecast not available:', forecastError);
          }
        } catch (err) {
          setError(err.message);
          setWeather(null);
          setForecast(null);
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setLoading(false);
      }
    );
  };

  return {
    weather,
    forecast, // Add forecast to return
    loading,
    error,
    city,
    fetchWeather,
    fetchWeatherByLocation,
  };
}
