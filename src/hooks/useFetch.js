import { useState, useCallback, useRef, useEffect } from 'react';

export const useFetch = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortControllerRef = useRef(null);

  // Cleanup function to abort requests
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const fetchData = useCallback(async (fetchFunction, ...args) => {
    // Cancel any ongoing request
    cleanup();
    
    // Create new abort controller
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError('');
    
    try {
      const result = await fetchFunction(...args, {
        signal: abortControllerRef.current.signal
      });
      
      setData(result);
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        // Request was cancelled, don't update state
        return;
      }
      
      const errorMessage = err.message || 'An error occurred while fetching data';
      setError(errorMessage);
      setData(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [cleanup]);

  const reset = useCallback(() => {
    cleanup();
    setData(null);
    setError('');
    setLoading(false);
  }, [cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  return {
    data,
    loading,
    error,
    fetchData,
    reset,
    isLoading: loading,
    hasError: !!error,
    hasData: data !== null
  };
};
