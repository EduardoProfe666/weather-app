"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Droplets,
  Gauge,
  Thermometer,
  Sun,
  Sunrise,
  Sunset,
  CloudRain,
  Wind,
  Eye,
  ThermometerSun,
  Umbrella,
} from "lucide-react";
import { formatTime } from "@/lib/utils";
import { motion } from "framer-motion";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

interface WeatherDetailsProps {
  weatherData: any;
}

export function WeatherDetails({ weatherData }: WeatherDetailsProps) {
  if (!weatherData) return null;

  const temperature = weatherData.temperature || 0;
  const apparentTemperature = weatherData.apparent_temperature || temperature;
  const relativehumidity = weatherData.relativehumidity || 0;
  const pressure = weatherData.pressure || 1013;
  const visibility = weatherData.visibility || 10000;
  const precipitation = weatherData.precipitation || 0;
  const windspeed = weatherData.windspeed || 0;
  const uvindex = weatherData.uvindex || 0;
  const sunrise = weatherData.sunrise ? new Date(weatherData.sunrise) : null;
  const sunset = weatherData.sunset ? new Date(weatherData.sunset) : null;

  const tempDiff = apparentTemperature - temperature;
  let feelsLikeText = "Similar to actual temperature";
  let feelsLikeColor = "text-gray-500";

  if (tempDiff <= -3) {
    feelsLikeText = "Feels much colder";
    feelsLikeColor = "text-blue-500";
  } else if (tempDiff < 0) {
    feelsLikeText = "Feels slightly colder";
    feelsLikeColor = "text-blue-400";
  } else if (tempDiff >= 3) {
    feelsLikeText = "Feels much warmer";
    feelsLikeColor = "text-red-500";
  } else if (tempDiff > 0) {
    feelsLikeText = "Feels slightly warmer";
    feelsLikeColor = "text-orange-400";
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  const getComfortIndex = () => {
    const comfortScore =
      100 -
      Math.abs(temperature - 21) * 3 -
      Math.max(0, relativehumidity - 50) * 0.5;
    const normalizedScore = Math.max(0, Math.min(100, comfortScore));

    if (normalizedScore >= 80)
      return { text: "Very comfortable", color: "text-green-500" };
    if (normalizedScore >= 60)
      return { text: "Comfortable", color: "text-green-400" };
    if (normalizedScore >= 40)
      return { text: "Moderately comfortable", color: "text-yellow-500" };
    if (normalizedScore >= 20)
      return { text: "Uncomfortable", color: "text-orange-500" };
    return { text: "Very uncomfortable", color: "text-red-500" };
  };

  const comfortIndex = getComfortIndex();

  const detailItems = [
    {
      icon: <ThermometerSun className="h-5 w-5 text-orange-500" />,
      label: "Feels Like",
      value: `${Math.round(apparentTemperature)}°C`,
      description: feelsLikeText,
      color: feelsLikeColor,
      tooltip: `Temperature feels ${Math.abs(Math.round(tempDiff))}°C ${
        tempDiff >= 0 ? "warmer" : "colder"
      } than actual`,
    },
    {
      icon: <Droplets className="h-5 w-5 text-blue-500" />,
      label: "Humidity",
      value: `${relativehumidity}%`,
      description:
        relativehumidity < 30
          ? "Very dry"
          : relativehumidity < 50
          ? "Comfortable"
          : relativehumidity < 70
          ? "Moderately humid"
          : "Very humid",
      color:
        relativehumidity < 30
          ? "text-yellow-500"
          : relativehumidity < 50
          ? "text-green-500"
          : relativehumidity < 70
          ? "text-blue-400"
          : "text-blue-600",
      tooltip: `${relativehumidity}% relative humidity`,
    },
    {
      icon: <Gauge className="h-5 w-5 text-purple-500" />,
      label: "Pressure",
      value: `${pressure} hPa`,
      description:
        pressure < 1000
          ? "Low pressure"
          : pressure > 1020
          ? "High pressure"
          : "Normal pressure",
      color:
        pressure < 1000
          ? "text-blue-500"
          : pressure > 1020
          ? "text-red-500"
          : "text-green-500",
      tooltip: `Atmospheric pressure: ${pressure} hPa`,
    },
    {
      icon: <Eye className="h-5 w-5 text-gray-500" />,
      label: "Visibility",
      value: `${(visibility / 1000).toFixed(1)} km`,
      description:
        visibility < 1000
          ? "Very poor"
          : visibility < 4000
          ? "Poor"
          : visibility < 10000
          ? "Moderate"
          : "Good",
      color:
        visibility < 1000
          ? "text-red-500"
          : visibility < 4000
          ? "text-orange-500"
          : visibility < 10000
          ? "text-yellow-500"
          : "text-green-500",
      tooltip: `Visibility: ${(visibility / 1000).toFixed(1)} kilometers`,
    },
    {
      icon: <CloudRain className="h-5 w-5 text-blue-400" />,
      label: "Precipitation",
      value: `${precipitation} mm`,
      description:
        precipitation === 0
          ? "No precipitation"
          : precipitation < 2.5
          ? "Light"
          : precipitation < 10
          ? "Moderate"
          : "Heavy",
      color:
        precipitation === 0
          ? "text-gray-500"
          : precipitation < 2.5
          ? "text-blue-300"
          : precipitation < 10
          ? "text-blue-500"
          : "text-blue-700",
      tooltip: `${precipitation} mm of precipitation in the last hour`,
    },
    {
      icon: <Wind className="h-5 w-5 text-teal-500" />,
      label: "Wind Speed",
      value: `${Math.round(windspeed)} km/h`,
      description:
        windspeed < 5
          ? "Calm"
          : windspeed < 20
          ? "Light breeze"
          : windspeed < 40
          ? "Moderate wind"
          : "Strong wind",
      color:
        windspeed < 5
          ? "text-gray-500"
          : windspeed < 20
          ? "text-green-500"
          : windspeed < 40
          ? "text-yellow-500"
          : "text-red-500",
      tooltip: `Wind speed: ${Math.round(windspeed)} km/h`,
    },
    {
      icon: <Sun className="h-5 w-5 text-yellow-500" />,
      label: "UV Index",
      value: uvindex.toString(),
      description:
        uvindex <= 2
          ? "Low"
          : uvindex <= 5
          ? "Moderate"
          : uvindex <= 7
          ? "High"
          : uvindex <= 10
          ? "Very high"
          : "Extreme",
      color:
        uvindex <= 2
          ? "text-green-500"
          : uvindex <= 5
          ? "text-yellow-500"
          : uvindex <= 7
          ? "text-orange-500"
          : uvindex <= 10
          ? "text-red-500"
          : "text-purple-500",
      tooltip: `UV Index: ${uvindex} (${
        uvindex <= 2
          ? "Low risk"
          : uvindex <= 5
          ? "Moderate risk"
          : uvindex <= 7
          ? "High risk"
          : uvindex <= 10
          ? "Very high risk"
          : "Extreme risk"
      })`,
    },
    {
      icon: <Umbrella className="h-5 w-5 text-cyan-500" />,
      label: "Comfort",
      value: comfortIndex.text,
      description: "Weather comfort index",
      color: comfortIndex.color,
      tooltip: "Based on temperature, humidity and wind conditions",
    },
  ];

  if (sunrise && sunset) {
    detailItems.push(
      {
        icon: <Sunrise className="h-5 w-5 text-orange-400" />,
        label: "Sunrise",
        value: formatTime(sunrise),
        description: "Morning",
        color: "text-orange-400",
        tooltip: `Sunrise at ${formatTime(sunrise)}`,
      },
      {
        icon: <Sunset className="h-5 w-5 text-orange-500" />,
        label: "Sunset",
        value: formatTime(sunset),
        description: "Evening",
        color: "text-orange-500",
        tooltip: `Sunset at ${formatTime(sunset)}`,
      }
    );
  }

  return (
    <TooltipProvider>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mt-4"
      >
        <Card className="shadow-md border-sky-100 dark:border-sky-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Thermometer className="mr-2 h-5 w-5 text-sky-500" />
              Weather Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {detailItems.map((item, index) => (
                <Tooltip key={index} content={item.tooltip}>
                  <motion.div
                    variants={item}
                    className="flex flex-col items-center text-center p-3 rounded-lg bg-sky-50 dark:bg-slate-800 hover:bg-sky-100 dark:hover:bg-slate-700 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="mb-1">{item.icon}</div>
                    <div className="text-xs text-muted-foreground">
                      {item.label}
                    </div>
                    <div className="font-medium text-sm">{item.value}</div>
                    <div className={`text-xs mt-1 ${item.color}`}>
                      {item.description}
                    </div>
                  </motion.div>
                </Tooltip>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
