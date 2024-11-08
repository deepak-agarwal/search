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

// Add new type for KV search results
interface KVSearchResult extends SearchResult {
  source: 'kv';
}

// Custom debounce function
function debounce<T extends (...args: unknown[]) => unknown>(
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

  // Add new states for KV search
  const [kvResult, setKvResult] = useState<KVSearchResult | null>(null);
  const [kvIsLoading, setKvIsLoading] = useState(false);
  const [kvError, setKvError] = useState<SearchError | null>(null);

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
    // @ts-expect-error - Debounce type definition doesn't properly handle async functions
    debounce(search, 300),
    []
  );

  useEffect(() => {
    debouncedSearch(input);
  }, [input, debouncedSearch]);

  // KV search function
  const searchKV = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setKvResult(null);
      return;
    }

    setKvIsLoading(true);
    setKvError(null);

    try {
      const response = await fetch(
        `https://search-redis.fast-search.workers.dev/api/search/kv?input=${encodeURIComponent(searchTerm)}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`KV Search failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      const validatedData: KVSearchResult = {
        results: Array.isArray(data.results) ? data.results : [],
        duration: data.duration || 0,
        source: 'kv'
      };

      setKvResult(validatedData);
    } catch (err) {
      setKvError({ 
        message: err instanceof Error ? err.message : 'An unexpected error occurred' 
      });
      setKvResult(null);
    } finally {
      setKvIsLoading(false);
    }
  };

  // Debounced KV search
  const debouncedKVSearch = useCallback(
    // @ts-expect-error - Debounce type definition doesn't properly handle async functions
    debounce(searchKV, 300),
    []
  );

  useEffect(() => {
    debouncedKVSearch(input);
  }, [input, debouncedKVSearch]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="text-center mb-4 text-3xl">
          Fast Search Comparison
        </div>
        <p className="text-sm text-gray-500 flex-1">
          Compare search performance: Redis vs KV Store
        </p>
      </div>
      
      <div className="flex gap-8 w-full max-w-4xl">
        {/* Redis Search Box */}
        <div className="flex-1">
          <h2 className="text-xl mb-2 text-center">Redis Search</h2>
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search Redis..."
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
                      setResult(null);
                    }}
                  >
                    {item}
                  </div>
                ))}
                <div className="p-2 text-xs text-gray-500 border-t">
                  Redis search completed in {result.duration.toFixed(2)}ms
                </div>
              </div>
            )}
          </div>
        </div>

        {/* KV Search Box */}
        <div className="flex-1">
          <h2 className="text-xl mb-2 text-center">KV Search</h2>
          <div className="relative w-full">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search KV..."
            />
            
            {kvIsLoading && (
              <div className="absolute right-3 top-3">
                <div className="w-5 h-5 border-t-2 border-blue-500 rounded-full animate-spin"></div>
              </div>
            )}

            {kvError && (
              <div className="mt-2 text-red-500 text-sm">
                {kvError.message}
              </div>
            )}

            {kvResult && kvResult.results && kvResult.results.length > 0 && (
              <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {kvResult.results.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => {
                      setInput(item);
                      setKvResult(null);
                    }}
                  >
                    {item}
                  </div>
                ))}
                <div className="p-2 text-xs text-gray-500 border-t">
                  KV search completed in {kvResult.duration.toFixed(2)}ms
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
