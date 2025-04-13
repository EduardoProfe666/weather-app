"use client";

import { useState, useEffect } from "react";
import { fetchWeatherData } from "@/lib/api";

export function useWeather(coordinates: { lat: number; lon: number } | null) {
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const [cachedCoords, setCachedCoords] = useState<string | null>(null);

  useEffect(() => {
    if (!coordinates) return;

    const coordsString = `${coordinates.lat},${coordinates.lon}`;
    const now = Date.now();
    const cacheExpiration = 15 * 60 * 1000; // 15 minutes

    const shouldFetchNewData =
      !lastFetchTime ||
      now - lastFetchTime > cacheExpiration ||
      cachedCoords !== coordsString;

    if (shouldFetchNewData) {
      fetchWeatherForLocation(coordinates);
      setCachedCoords(coordsString);
      setLastFetchTime(now);
    }
  }, [coordinates]);

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      if (coordinates) {
        fetchWeatherForLocation(coordinates);
        setLastFetchTime(Date.now());
      }
    }, 15 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [coordinates]);

  const fetchWeatherForLocation = async (coords: {
    lat: number;
    lon: number;
  }) => {
    if (
      !coords ||
      typeof coords.lat !== "number" ||
      typeof coords.lon !== "number"
    ) {
      setError("Invalid coordinates provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchWeatherData(coords.lat, coords.lon);

      if (data.current) {
        setCurrentWeather(data.current);
        setForecast(data.daily || []);
        setHourlyForecast(data.hourly || []);
      } else {
        setError("No weather data available for this location");
      }
    } catch (err) {
      console.error("Error fetching weather data:", err);
      setError("Failed to fetch weather data. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    currentWeather,
    forecast,
    hourlyForecast,
    isLoading,
    error,
    refetch: () => coordinates && fetchWeatherForLocation(coordinates),
  };
}
