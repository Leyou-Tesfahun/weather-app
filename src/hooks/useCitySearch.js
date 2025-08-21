import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { WeatherService } from '../services/weatherService';

export function useCitySearch() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    const searchCities = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsLoading(true);
      try {
        const cities = await WeatherService.searchCities(debouncedQuery);
        setSuggestions(cities);
        setShowDropdown(cities.length > 0);
      } catch (error) {
        console.error('Error searching cities:', error);
        setSuggestions([]);
        setShowDropdown(false);
      } finally {
        setIsLoading(false);
      }
    };

    searchCities();
  }, [debouncedQuery]);

  const clearSearch = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const hideDropdown = () => {
    setShowDropdown(false);
  };

  const selectCity = (city) => {
    setQuery(city.displayName);
    setShowDropdown(false);
    return city.searchKey;
  };

  return {
    query,
    setQuery,
    suggestions,
    isLoading,
    showDropdown,
    clearSearch,
    hideDropdown,
    selectCity,
    setShowDropdown
  };
}
