"use client";

import { useState, useEffect, useCallback } from 'react';

// Define types
interface SearchResult {
  results?: string[];
  duration: number;
}

interface SearchError {
  message: string;
}

// Custom debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<SearchError | null>(null);

  // Search function
  const search = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://search-redis.fast-search.workers.dev/api/search?input=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Validate the response data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      // Ensure results is always an array
      const validatedData: SearchResult = {
        results: Array.isArray(data.results) ? data.results : [],
        duration: data.duration || 0
      };

      setResult(validatedData);
    } catch (err) {
      setError({ 
        message: err instanceof Error ? err.message : 'An unexpected error occurred' 
      });
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(search, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(input);
  }, [input, debouncedSearch]);

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="text-center mb-4 text-3xl">
          Fast Search
        </div>
          <p className="text-sm text-gray-500 flex-1">
            A robust api for searching through 100,000+ terms in under 300ms
            using hono and cloudflare workers to deploy it.
          </p>
      </div>
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Search..."
        />
        
        {isLoading && (
          <div className="absolute right-3 top-3">
            <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="mt-2 text-red-500 text-sm">
            {error.message}
          </div>
        )}

        {result && result.results && result.results.length > 0 && (
          <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {result.results.map((item, index) => (
              <div
                key={index}
                className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => {
                  setInput(item);
                  setResult(null); // Close dropdown after selection
                }}
              >
                {item}
              </div>
            ))}
            <div className="p-2 text-xs text-gray-500 border-t">
              Search completed in {result.duration.toFixed(2)}ms
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
