export default function SearchBar({ query, onQueryChange, onSubmit, onClear, onLocationClick, onKeyDown }) {
  return (
    <form onSubmit={onSubmit} className="flex items-center bg-white dark:bg-gray-800 rounded-full shadow px-4 py-2">
      <input
        type="text"
        value={query}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="Search for a city..."
        className="flex-1 bg-transparent outline-none text-lg dark:text-white"
        autoComplete="off"
        aria-label="City search input"
      />
      {query && (
        <button type="button" onClick={onClear} aria-label="Clear search" className="p-1 text-gray-500 dark:text-gray-400">
          ✕
        </button>
      )}
      <button type="submit" aria-label="Search" className="p-1 ml-2 text-gray-500 dark:text-gray-400">
        🔍
      </button>
      <button type="button" onClick={onLocationClick} aria-label="Use my location" className="ml-3 p-1 text-blue-500 dark:text-blue-300">
        📍
      </button>
    </form>
  );
}

