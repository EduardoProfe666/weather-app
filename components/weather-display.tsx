"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Wind,
  Droplets,
  Compass,
  Moon,
  ThermometerSun,
  ThermometerSnowflake,
  MapPin,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

interface WeatherDisplayProps {
  currentWeather: any;
  city: string;
}

export function WeatherDisplay({ currentWeather, city }: WeatherDisplayProps) {
  if (!currentWeather) return null;

  const getWeatherIcon = (
    weatherCode: number,
    size: "sm" | "lg" = "lg",
    isDay = true
  ) => {
    const sizeClass = size === "lg" ? "h-12 w-12 sm:h-16 sm:w-16" : "h-5 w-5";

    if (weatherCode === 0 && !isDay) {
      return <Moon className={`${sizeClass} text-indigo-400`} />;
    }

    if (weatherCode === 0)
      return <Sun className={`${sizeClass} text-yellow-500`} />;
    if (weatherCode <= 3)
      return <Cloud className={`${sizeClass} text-gray-400`} />;
    if (weatherCode <= 49)
      return <CloudFog className={`${sizeClass} text-gray-400`} />;
    if (weatherCode <= 69)
      return <CloudRain className={`${sizeClass} text-blue-400`} />;
    if (weatherCode <= 79)
      return <CloudSnow className={`${sizeClass} text-blue-200`} />;
    if (weatherCode <= 99)
      return <CloudLightning className={`${sizeClass} text-purple-500`} />;
    return <Cloud className={`${sizeClass} text-gray-400`} />;
  };

  const getWeatherDescription = (weatherCode: number) => {
    if (weatherCode === 0) return "Clear sky";
    if (weatherCode <= 3) return "Partly cloudy";
    if (weatherCode <= 49) return "Fog";
    if (weatherCode <= 69) return "Rain";
    if (weatherCode <= 79) return "Snow";
    if (weatherCode <= 99) return "Thunderstorm";
    return "Unknown";
  };

  const getWindDirection = (degrees: number) => {
    const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
    const index = Math.round((degrees || 0) / 45) % 8;
    return directions[index];
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "text-blue-500";
    if (temp <= 10) return "text-blue-400";
    if (temp <= 20) return "text-green-500";
    if (temp <= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getUVIndexDescription = (uvIndex: number) => {
    if (uvIndex <= 2)
      return {
        text: "Low",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      };
    if (uvIndex <= 5)
      return {
        text: "Moderate",
        color:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
      };
    if (uvIndex <= 7)
      return {
        text: "High",
        color:
          "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
      };
    if (uvIndex <= 10)
      return {
        text: "Very High",
        color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      };
    return {
      text: "Extreme",
      color:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    };
  };

  const temperature = currentWeather.temperature || 0;
  const apparentTemperature =
    currentWeather.apparent_temperature || temperature;
  const relativehumidity = currentWeather.relativehumidity || 0;
  const windspeed = currentWeather.windspeed || 0;
  const winddirection = currentWeather.winddirection || 0;
  const uvindex = currentWeather.uvindex || 0;
  const isDay =
    currentWeather.is_day !== undefined ? currentWeather.is_day : true;
  const weathercode = currentWeather.weathercode || 0;

  const uvIndexInfo = getUVIndexDescription(uvindex);
  const tempDiff = apparentTemperature - temperature;
  const feelsLikeIcon =
    tempDiff >= 0 ? (
      <ThermometerSun className="h-4 w-4 text-orange-500" />
    ) : (
      <ThermometerSnowflake className="h-4 w-4 text-blue-500" />
    );

  const isGoodOutdoorDay = () => {
    if (weathercode > 3) return false;
    if (windspeed > 25) return false;
    if (uvindex > 7) return false;

    return true;
  };

  const outdoorRecommendation = isGoodOutdoorDay()
    ? {
        text: "Great day for outdoor activities!",
        color:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      }
    : {
        text: "Indoor activities recommended",
        color:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden shadow-lg border-sky-100 dark:border-sky-900">
          <CardContent className="p-0">
            <div
              className={`${
                isDay
                  ? "bg-gradient-to-r from-sky-500 to-blue-600"
                  : "bg-gradient-to-r from-indigo-800 to-purple-900"
              } text-white p-4 sm:p-6 relative overflow-hidden`}
            >
              <div className="absolute inset-0 overflow-hidden">
                {isDay ? (
                  <>
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full bg-yellow-300 opacity-20 blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-blue-300 opacity-20 blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 1,
                      }}
                    />
                  </>
                ) : (
                  <>
                    <motion.div
                      className="absolute top-0 right-0 w-32 h-32 rounded-full bg-indigo-300 opacity-10 blur-2xl"
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                      }}
                    />
                    <motion.div
                      className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-purple-300 opacity-10 blur-xl"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.1, 0.2, 0.1],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 1,
                      }}
                    />
                  </>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center relative z-10">
                <div className="text-center sm:text-left mb-3 sm:mb-0">
                  <Tooltip content="Current location">
                    <h2 className="text-xl sm:text-2xl font-bold truncate max-w-[200px] sm:max-w-none flex items-center justify-center sm:justify-start">
                      <MapPin className="h-5 w-5 mr-1 inline-block" />
                      {city || "Unknown Location"}
                    </h2>
                  </Tooltip>
                  <p className="text-xs sm:text-sm opacity-90">
                    {formatDate(new Date())}
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="border-white/20 text-white/90"
                    >
                      {isDay ? "Day" : "Night"}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={outdoorRecommendation.color}
                    >
                      {outdoorRecommendation.text}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center">
                  <Tooltip content={getWeatherDescription(weathercode)}>
                    <motion.div
                      animate={{ rotate: [0, 10, 0, -10, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      {getWeatherIcon(weathercode, "lg", isDay)}
                    </motion.div>
                  </Tooltip>
                  <div className="ml-3 sm:ml-4">
                    <Tooltip
                      content={`Current temperature: ${Math.round(
                        temperature
                      )}°C`}
                    >
                      <div
                        className={`text-3xl sm:text-4xl font-bold ${getTemperatureColor(
                          temperature
                        )}`}
                      >
                        {Math.round(temperature)}°C
                      </div>
                    </Tooltip>
                    <div className="text-sm sm:text-base">
                      {getWeatherDescription(weathercode)}
                    </div>
                    <div className="flex items-center mt-1 text-xs">
                      {feelsLikeIcon}
                      <span className="ml-1">
                        Feels like {Math.round(apparentTemperature)}°C (
                        {tempDiff > 0 ? "+" : ""}
                        {Math.round(tempDiff)}°)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
              <Tooltip content="Current humidity level">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Droplets className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Humidity
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      {relativehumidity}%
                    </p>
                  </div>
                </motion.div>
              </Tooltip>

              <Tooltip content="Current wind speed">
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Wind className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Wind Speed
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      {Math.round(windspeed)} km/h
                    </p>
                  </div>
                </motion.div>
              </Tooltip>

              <Tooltip
                content={`Wind direction: ${getWindDirection(winddirection)}`}
              >
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Compass className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Wind Direction
                    </p>
                    <p className="text-sm sm:text-base font-medium">
                      {getWindDirection(winddirection)} (
                      {Math.round(winddirection)}°)
                    </p>
                  </div>
                </motion.div>
              </Tooltip>

              <Tooltip content={`UV Index: ${uvIndexInfo.text}`}>
                <motion.div
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Sun className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-yellow-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      UV Index
                    </p>
                    <div className="flex items-center gap-1">
                      <p className="text-sm sm:text-base font-medium">
                        {uvindex}
                      </p>
                      {uvindex > 0 && (
                        <Badge className={uvIndexInfo.color} variant="outline">
                          {uvIndexInfo.text}
                        </Badge>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Tooltip>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
