import { weatherImages } from '../assets/weatherImages.js';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY || 'demo_key';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

console.log({key: import.meta.env.VITE_WEATHER_API_KEY})

export class WeatherService {
  static async getCurrentWeather(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error(`Weather data not found for ${city}`);
      }
      
      const data = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static async getCurrentWeatherByCoords(lat, lon) {
    try {
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('Weather data not found for coordinates');
      }
      
      const data = await response.json();
      return this.transformWeatherData(data);
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static async getForecast(city) {
    try {
      const response = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&cnt=5`
      );
      
      if (!response.ok) {
        throw new Error(`Forecast data not found for ${city}`);
      }
      
      const data = await response.json();
      return data.list.map(item => this.transformWeatherData(item));
    } catch (error) {
      console.error('Error fetching forecast data:', error);
      throw error;
    }
  }

  static async searchCities(query) {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('City search failed');
      }
      
      const data = await response.json();
      return data.map(city => ({
        name: city.name,
        country: city.country,
        state: city.state,
        lat: city.lat,
        lon: city.lon,
        displayName: `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`,
        searchKey: `${city.name}, ${city.country}`
      }));
    } catch (error) {
      console.error('Error searching cities:', error);
      return [];
    }
  }

  static transformWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind?.speed * 3.6 || 0), 
      pressure: data.main.pressure,
      visibility: data.visibility ? Math.round(data.visibility / 1000) : 0, 
      feelsLike: Math.round(data.main.feels_like),
      cloudCover: data.clouds?.all || 0,
      city: data.name || 'Unknown',
      country: data.sys?.country || '',
      timestamp: data.dt * 1000,
    };
  }

  static getWeatherImage(iconCode) {
    const imageMap = {
      '01d': 'sun.png',
      '01n': 'partial sun.png',
      '02d': 'partial sun.png',
      '02n': 'cloud.png',
      '03d': 'cloud.png',
      '03n': 'cloud.png',
      '04d': 'cloud.png', 
      '04n': 'cloud.png',
      '09d': 'rain.png',
      '09n': 'rain.png',
      '10d': 'rain.png',
      '10n': 'rain.png',
      '11d': 'rain.png',     
      '11n': 'rain.png',
      '13d': 'snow.png',
      '13n': 'snow.png',
      '50d': 'cloud.png',
      '50n': 'cloud.png',
    };
    
    const imageName = imageMap[iconCode] || 'sun.png';
    return weatherImages[imageName] || weatherImages['sun.png'];
  }

  static getWeatherImageAlt(iconCode) {
    const altMap = {
      '01d': 'Clear sunny day',
      '01n': 'Clear night',
      '02d': 'Partly cloudy day',
      '02n': 'Partly cloudy night',
      '03d': 'Scattered clouds',
      '03n': 'Scattered clouds',
      '04d': 'Broken clouds',
      '04n': 'Broken clouds',
      '09d': 'Shower rain',
      '09n': 'Shower rain',
      '10d': 'Rain',
      '10n': 'Rain',
      '11d': 'Thunderstorm',
      '11n': 'Thunderstorm',
      '13d': 'Snow',
      '13n': 'Snow',
      '50d': 'Mist',
      '50n': 'Mist',
    };
    
    return altMap[iconCode] || 'Weather';
  }

  static formatDate(timestamp) {
    const date = new Date(timestamp);
    const options = { 
      weekday: 'short', 
      month: 'long', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }
}
