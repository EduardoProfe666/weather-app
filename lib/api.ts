const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

export async function fetchWeatherData(latitude: number, longitude: number) {
  const cacheKey = `weather-${latitude}-${longitude}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  if (!isValidCoordinate(latitude, longitude)) {
    throw new Error("Invalid coordinates provided");
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,uv_index,apparent_temperature,precipitation,pressure_msl,visibility,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&hourly=temperature_2m,weather_code,precipitation_probability,apparent_temperature&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API Error Response:", errorText);
      throw new Error(`Weather API responded with status: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.current) {
      throw new Error("Invalid response from weather API");
    }

    const transformedData = {
      current: {
        temperature: data.current.temperature_2m || 0,
        apparent_temperature: data.current.apparent_temperature || 0,
        relativehumidity: data.current.relative_humidity_2m || 0,
        weathercode: data.current.weather_code || 0,
        windspeed: data.current.wind_speed_10m || 0,
        winddirection: data.current.wind_direction_10m || 0,
        uvindex: data.current.uv_index || 0,
        precipitation: data.current.precipitation || 0,
        pressure: data.current.pressure_msl || 1013,
        visibility: data.current.visibility || 10000,
        is_day: data.current.is_day === 1,
        sunrise: data.daily?.sunrise?.[0] || null,
        sunset: data.daily?.sunset?.[0] || null,
      },
      daily: Array.isArray(data.daily?.time)
        ? data.daily.time.map((time: string, index: number) => ({
            date: time,
            weathercode: data.daily.weather_code?.[index] || 0,
            temperature_max: data.daily.temperature_2m_max?.[index] || 0,
            temperature_min: data.daily.temperature_2m_min?.[index] || 0,
            precipitation_probability:
              data.daily.precipitation_probability_max?.[index] || 0,
            sunrise: data.daily.sunrise?.[index] || null,
            sunset: data.daily.sunset?.[index] || null,
          }))
        : [],
      hourly: Array.isArray(data.hourly?.time)
        ? data.hourly.time.slice(0, 24).map((time: string, index: number) => ({
            time: time,
            temperature: data.hourly.temperature_2m?.[index] || 0,
            apparent_temperature:
              data.hourly.apparent_temperature?.[index] || 0,
            weathercode: data.hourly.weather_code?.[index] || 0,
            precipitation_probability:
              data.hourly.precipitation_probability?.[index] || 0,
          }))
        : [],
    };

    cache[cacheKey] = {
      data: transformedData,
      timestamp: now,
    };

    return transformedData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      current: {
        temperature: 0,
        apparent_temperature: 0,
        relativehumidity: 0,
        weathercode: 0,
        windspeed: 0,
        winddirection: 0,
        uvindex: 0,
        precipitation: 0,
        pressure: 1013,
        visibility: 10000,
        is_day: true,
      },
      daily: [],
      hourly: [],
    };
  }
}

function isValidCoordinate(latitude: number, longitude: number): boolean {
  return (
    !isNaN(latitude) &&
    !isNaN(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export async function searchCities(query: string) {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const cacheKey = `search-${query}`;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].data;
  }

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      query
    )}&count=10&language=es&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(
        `Geocoding API responded with status: ${response.status}`
      );
    }

    const data = await response.json();
    const results = data.results || [];

    cache[cacheKey] = {
      data: results,
      timestamp: now,
    };

    return results;
  } catch (error) {
    console.error("Error searching cities:", error);
    return [];
  }
}
