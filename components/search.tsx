"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SearchIcon,
  MapPin,
  Loader2,
  X,
  History,
  Star,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { searchCities } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

interface SearchProps {
  onCitySelect: (city: string, lat: number, lon: number) => void;
  onGetLocation: () => void;
}

export function Search({ onCitySelect, onGetLocation }: SearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [recentSearches, setRecentSearches] = useState<
    Array<{ name: string; lat: number; lon: number; timestamp?: number }>
  >([]);
  const [favorites, setFavorites] = useState<
    Array<{ name: string; lat: number; lon: number }>
  >([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentSearches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }

      const savedFavorites = localStorage.getItem("favoriteLocations");
      if (savedFavorites) {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavorites(parsedFavorites);
        }
      }
    } catch (error) {
      console.error("Error loading saved locations:", error);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchCitiesDebounced = setTimeout(async () => {
      if (query.length >= 2) {
        setIsLoading(true);
        try {
          const data = await searchCities(query);

          const uniqueResults = data.reduce((acc: any[], current: any) => {
            const uniqueId = `${current.name}-${current.country}-${current.latitude}-${current.longitude}`;

            const exists = acc.some(
              (item) =>
                `${item.name}-${item.country}-${item.latitude}-${item.longitude}` ===
                uniqueId
            );

            if (!exists) {
              acc.push({
                ...current,
                uniqueId,
              });
            }
            return acc;
          }, []);

          setResults(uniqueResults);
          setShowResults(true);
        } catch (error) {
          console.error("Error searching cities:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(searchCitiesDebounced);
  }, [query]);

  const handleLocationClick = async () => {
    setIsGettingLocation(true);
    await onGetLocation();
    setIsGettingLocation(false);
    setQuery("");
  };

  const handleCitySelect = (result: any) => {
    const cityName = `${result.name}, ${result.country}`;
    onCitySelect(cityName, result.latitude, result.longitude);
    setQuery("");
    setShowResults(false);

    const newSearch = {
      name: cityName,
      lat: result.latitude,
      lon: result.longitude,
      timestamp: Date.now(),
    };

    const updatedSearches = [
      newSearch,
      ...recentSearches.filter(
        (item) => !(item.lat === newSearch.lat && item.lon === newSearch.lon)
      ),
    ].slice(0, 5);

    setRecentSearches(updatedSearches);

    try {
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches));
    } catch (error) {
      console.error("Error saving recent searches:", error);
    }
  };

  const handleRecentSearchSelect = (search: {
    name: string;
    lat: number;
    lon: number;
  }) => {
    onCitySelect(search.name, search.lat, search.lon);
    setQuery("");
    setShowResults(false);
  };

  const toggleFavorite = (location: {
    name: string;
    lat: number;
    lon: number;
  }) => {
    const isFavorite = favorites.some(
      (fav) => fav.lat === location.lat && fav.lon === location.lon
    );

    let updatedFavorites;
    if (isFavorite) {
      updatedFavorites = favorites.filter(
        (fav) => !(fav.lat === location.lat && fav.lon === location.lon)
      );
    } else {
      updatedFavorites = [...favorites, location];
    }

    setFavorites(updatedFavorites);
    try {
      localStorage.setItem(
        "favoriteLocations",
        JSON.stringify(updatedFavorites)
      );
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  };

  const isLocationFavorite = (location: { lat: number; lon: number }) => {
    return favorites.some(
      (fav) => fav.lat === location.lat && fav.lon === location.lon
    );
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return "";

    const now = Date.now();
    const diff = now - timestamp;

    if (diff < 60000) return "just now";

    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}d ago`;
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  return (
    <TooltipProvider>
      <div className="relative w-full sm:w-72 md:w-80" ref={searchRef}>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search for a city..."
              className="pl-8 pr-8 h-10 text-sm sm:text-base transition-all duration-200 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (query.length >= 2) {
                  setShowResults(true);
                } else if (recentSearches.length > 0 || favorites.length > 0) {
                  setShowResults(true);
                }
              }}
            />
            {query && (
              <button
                onClick={clearSearch}
                className="absolute right-2.5 top-2.5 h-5 w-5 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3 w-3" />
              </button>
            )}
            {isLoading && (
              <Loader2 className="absolute right-2.5 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          <Tooltip content="Use current location">
            <Button
              variant="outline"
              size="icon"
              onClick={handleLocationClick}
              disabled={isGettingLocation}
              className="h-10 w-10 flex-shrink-0 transition-all duration-200 hover:bg-sky-100 dark:hover:bg-sky-900"
              aria-label="Use current location"
            >
              {isGettingLocation ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MapPin className="h-4 w-4 text-sky-500" />
              )}
            </Button>
          </Tooltip>
        </div>

        <AnimatePresence>
          {showResults && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="absolute z-[999] w-full mt-1 max-h-80 overflow-auto shadow-lg border-sky-100 dark:border-sky-900">
                <div className="py-1">
                  {query.length >= 2 ? (
                    results.length > 0 ? (
                      <div>
                        <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                          Search Results
                        </div>
                        <ul>
                          {results.map((result) => (
                            <li
                              key={result.uniqueId}
                              className="px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer text-sm sm:text-base transition-colors duration-150 flex items-center justify-between group"
                            >
                              <div
                                className="flex items-center"
                                onClick={() => handleCitySelect(result)}
                              >
                                <MapPin className="h-4 w-4 mr-2 text-sky-500 flex-shrink-0" />
                                <div>
                                  <div className="font-medium truncate">
                                    {result.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center">
                                    <span className="truncate">
                                      {result.country}
                                    </span>
                                    {result.admin1 && (
                                      <Badge
                                        variant="outline"
                                        className="ml-1 text-[10px] h-4 px-1"
                                      >
                                        {result.admin1}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Tooltip
                                content={
                                  isLocationFavorite({
                                    lat: result.latitude,
                                    lon: result.longitude,
                                  })
                                    ? "Remove from favorites"
                                    : "Add to favorites"
                                }
                              >
                                <button
                                  onClick={() =>
                                    toggleFavorite({
                                      name: `${result.name}, ${result.country}`,
                                      lat: result.latitude,
                                      lon: result.longitude,
                                    })
                                  }
                                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-full"
                                >
                                  <Star
                                    className={`h-4 w-4 ${
                                      isLocationFavorite({
                                        lat: result.latitude,
                                        lon: result.longitude,
                                      })
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "text-gray-400"
                                    }`}
                                  />
                                </button>
                              </Tooltip>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        No cities found. Try a different search term.
                      </div>
                    )
                  ) : (
                    <>
                      {favorites.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center">
                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                            Favorites
                          </div>
                          <ul>
                            {favorites.map((favorite, index) => (
                              <li
                                key={`favorite-${index}-${favorite.lat}-${favorite.lon}`}
                                className="px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between group"
                              >
                                <div
                                  className="flex items-center"
                                  onClick={() =>
                                    handleRecentSearchSelect(favorite)
                                  }
                                >
                                  <Star className="h-4 w-4 mr-2 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                  <span className="truncate">
                                    {favorite.name}
                                  </span>
                                </div>
                                <Tooltip content="Remove from favorites">
                                  <button
                                    onClick={() => toggleFavorite(favorite)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-full"
                                  >
                                    <X className="h-3 w-3 text-gray-400" />
                                  </button>
                                </Tooltip>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {recentSearches.length > 0 && (
                        <div>
                          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground flex items-center">
                            <History className="h-3 w-3 mr-1 text-gray-400" />
                            Recent Searches
                          </div>
                          <ul>
                            {recentSearches.map((search, index) => (
                              <li
                                key={`recent-${index}-${search.lat}-${search.lon}`}
                                className="px-3 py-2 hover:bg-sky-50 dark:hover:bg-sky-900/20 cursor-pointer text-sm transition-colors duration-150 flex items-center justify-between group"
                              >
                                <div
                                  className="flex items-center flex-1 min-w-0"
                                  onClick={() =>
                                    handleRecentSearchSelect(search)
                                  }
                                >
                                  <Clock className="h-4 w-4 mr-2 text-muted-foreground flex-shrink-0" />
                                  <div className="flex flex-col min-w-0">
                                    <span className="truncate">
                                      {search.name}
                                    </span>
                                    {search.timestamp && (
                                      <span className="text-xs text-muted-foreground">
                                        {formatTimestamp(search.timestamp)}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <Tooltip
                                  content={
                                    isLocationFavorite(search)
                                      ? "Remove from favorites"
                                      : "Add to favorites"
                                  }
                                >
                                  <button
                                    onClick={() => toggleFavorite(search)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-full"
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        isLocationFavorite(search)
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-400"
                                      }`}
                                    />
                                  </button>
                                </Tooltip>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  );
}
