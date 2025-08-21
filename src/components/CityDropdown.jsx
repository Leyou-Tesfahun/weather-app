import React, { useEffect, useRef } from 'react';

export default function CityDropdown({ 
  suggestions, 
  isLoading, 
  showDropdown, 
  onSelectCity, 
  onClose,
  selectedIndex,
  onHighlight 
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown, onClose]);

  if (!showDropdown) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto mt-1"
    >
      {isLoading && (
        <div className="flex items-center justify-center py-3">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Searching...</span>
        </div>
      )}
      
      {!isLoading && suggestions.length === 0 && (
        <div className="px-4 py-3 text-sm text-gray-500 text-center">
          No cities found
        </div>
      )}
      
      {!isLoading && suggestions.length > 0 && (
        <ul className="py-1">
          {suggestions.map((city, index) => (
            <li
              key={`${city.lat}-${city.lon}`}
              className={`px-4 py-2 cursor-pointer flex items-center justify-between hover:bg-gray-100 ${
                selectedIndex === index ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
              }`}
              onClick={() => onSelectCity(city)}
              onMouseEnter={() => onHighlight(index)}
            >
              <div className="flex flex-col">
                <span className="font-medium">{city.name}</span>
                <span className="text-sm text-gray-500">
                  {city.state && `${city.state}, `}{city.country}
                </span>
              </div>
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
