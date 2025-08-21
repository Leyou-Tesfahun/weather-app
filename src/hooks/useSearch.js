import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'weather-app-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // Load recent searches from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.warn('Failed to load recent searches:', error);
      setRecentSearches([]);
    }
  }, []);

  // Save recent searches to localStorage
  const saveToStorage = useCallback((searches) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch (error) {
      console.warn('Failed to save recent searches:', error);
    }
  }, []);

  const addToRecentSearches = useCallback((city) => {
    if (!city?.trim()) return;

    const normalizedCity = city.trim().toLowerCase();
    
    setRecentSearches(prev => {
      // Remove if already exists (case insensitive)
      const filtered = prev.filter(
        search => search.toLowerCase() !== normalizedCity
      );
      
      // Add to the beginning and limit to MAX_RECENT_SEARCHES
      const newSearches = [city.trim(), ...filtered].slice(0, MAX_RECENT_SEARCHES);
      
      saveToStorage(newSearches);
      return newSearches;
    });
  }, [saveToStorage]);

  const removeFromRecentSearches = useCallback((city) => {
    setRecentSearches(prev => {
      const filtered = prev.filter(search => 
        search.toLowerCase() !== city.toLowerCase()
      );
      saveToStorage(filtered);
      return filtered;
    });
  }, [saveToStorage]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear recent searches:', error);
    }
  }, []);

  const updateSearchQuery = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearchQuery = useCallback(() => {
    setSearchQuery('');
  }, []);

  return {
    // State
    searchQuery,
    recentSearches,
    
    // Actions
    updateSearchQuery,
    clearSearchQuery,
    addToRecentSearches,
    removeFromRecentSearches,
    clearRecentSearches,
    
    // Computed values
    hasRecentSearches: recentSearches.length > 0,
    hasSearchQuery: searchQuery.trim().length > 0
  };
};
