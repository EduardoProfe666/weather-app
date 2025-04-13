"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudFog,
  CloudLightning,
  Droplets,
  ChevronLeft,
  ChevronRight,
  Moon,
  Clock,
  Calendar,
  Thermometer,
} from "lucide-react";
import { formatDate, formatTime } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

interface ForecastDisplayProps {
  forecast: any[];
  type: "daily" | "hourly";
}

export function ForecastDisplay({ forecast, type }: ForecastDisplayProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [autoScroll, setAutoScroll] = useState(false);
  const [handleScrollEvent, setHandleScrollEvent] = useState<
    (() => void) | null
  >(null);

  if (!forecast || forecast.length === 0) {
    return null;
  }

  const getWeatherIcon = (weatherCode: number, isDay = true) => {
    if (weatherCode === 0 && !isDay) {
      return <Moon className="h-6 w-6 text-indigo-400" />;
    }

    if (weatherCode === 0) return <Sun className="h-6 w-6 text-yellow-500" />;
    if (weatherCode <= 3) return <Cloud className="h-6 w-6 text-gray-400" />;
    if (weatherCode <= 49)
      return <CloudFog className="h-6 w-6 text-gray-400" />;
    if (weatherCode <= 69)
      return <CloudRain className="h-6 w-6 text-blue-400" />;
    if (weatherCode <= 79)
      return <CloudSnow className="h-6 w-6 text-blue-200" />;
    if (weatherCode <= 99)
      return <CloudLightning className="h-6 w-6 text-purple-500" />;
    return <Cloud className="h-6 w-6 text-gray-400" />;
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

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setScrollPosition(scrollLeft);
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount =
        direction === "left" ? -clientWidth / 2 : clientWidth / 2;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getTemperatureColor = (temp: number) => {
    if (temp <= 0) return "text-blue-500";
    if (temp <= 10) return "text-blue-400";
    if (temp <= 20) return "text-green-500";
    if (temp <= 30) return "text-yellow-500";
    return "text-red-500";
  };

  const getPrecipitationBadge = (probability: number) => {
    if (probability === 0) return null;

    let color =
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
    let text = "Low";

    if (probability > 70) {
      color = "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      text = "High";
    } else if (probability > 30) {
      color =
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      text = "Medium";
    }

    return (
      <Badge className={color} variant="outline">
        {text}
      </Badge>
    );
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    let handleScrollEvent: () => void;

    if (isMounted && scrollContainer) {
      handleScrollEvent = () => {
        handleScroll();
      };
      setHandleScrollEvent(() => handleScrollEvent);

      scrollContainer.addEventListener("scroll", handleScrollEvent);
      handleScroll();

      return () => {
        scrollContainer.removeEventListener("scroll", handleScrollEvent);
      };
    }

    return () => {
      if (scrollContainer && handleScrollEvent) {
        scrollContainer.removeEventListener("scroll", handleScrollEvent);
      }
    };
  }, [isMounted]);

  useEffect(() => {
    if (!autoScroll || !isMounted) return;

    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;

        if (scrollLeft + clientWidth >= scrollWidth) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scroll("right");
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [autoScroll, isMounted]);

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-md border-sky-100 dark:border-sky-900">
          <CardContent className="p-4 sm:p-6 relative">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-semibold flex items-center">
                {type === "daily" ? (
                  <>
                    <Calendar className="mr-2 h-5 w-5 text-yellow-500" />
                    5-Day Forecast
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-5 w-5 text-blue-500" />
                    Hourly Forecast
                  </>
                )}
              </h3>

              <div className="flex items-center gap-2">
                <Tooltip
                  content={
                    autoScroll ? "Pause auto-scroll" : "Enable auto-scroll"
                  }
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleAutoScroll}
                    className={`text-xs px-2 h-7 ${
                      autoScroll
                        ? "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300"
                        : ""
                    }`}
                  >
                    {autoScroll ? "Auto ✓" : "Auto"}
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="relative">
              <AnimatePresence>
                {showLeftArrow && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
                  >
                    <Tooltip content="Scroll left">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md border-0"
                        onClick={() => scroll("left")}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {showRightArrow && (
                  <motion.div
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
                  >
                    <Tooltip content="Scroll right">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-md border-0"
                        onClick={() => scroll("right")}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </Tooltip>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                ref={scrollContainerRef}
                className="flex overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {forecast.map((item, index) => {
                  const isDay =
                    type === "hourly"
                      ? new Date(item.time).getHours() >= 6 &&
                        new Date(item.time).getHours() < 20
                      : true;

                  const timeLabel =
                    type === "daily"
                      ? formatDate(new Date(item.date), true)
                      : formatTime(new Date(item.time));

                  const tooltipContent =
                    type === "daily"
                      ? `${formatDate(
                          new Date(item.date),
                          false
                        )}: ${getWeatherDescription(item.weathercode)}`
                      : `${formatTime(
                          new Date(item.time)
                        )}: ${getWeatherDescription(item.weathercode)}`;

                  const isCurrentHour = type === "hourly" && index === 0;
                  const isWeekend =
                    type === "daily" &&
                    [0, 6].includes(new Date(item.date).getDay());

                  return (
                    <Tooltip
                      key={`forecast-${type}-${index}`}
                      content={tooltipContent}
                    >
                      <motion.div
                        className="flex-shrink-0 w-[140px] sm:w-[160px] snap-start mx-1 first:ml-0 last:mr-0"
                        whileHover={{ scale: 1.03 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                        onClick={() =>
                          setSelectedItem(selectedItem === index ? null : index)
                        }
                      >
                        <div
                          className={`flex flex-col items-center p-3 rounded-lg ${
                            selectedItem === index
                              ? "bg-sky-100 dark:bg-sky-900/30 ring-2 ring-sky-300 dark:ring-sky-700"
                              : isCurrentHour
                              ? "bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700"
                              : isWeekend && type === "daily"
                              ? "bg-amber-50 dark:bg-amber-900/20"
                              : "bg-sky-50 dark:bg-slate-800"
                          } h-full cursor-pointer transition-all duration-200 relative`}
                        >
                          {isCurrentHour && (
                            <div className="absolute -top-1 -right-1">
                              <Badge
                                variant="default"
                                className="bg-blue-500 text-[10px] px-1.5 py-0"
                              >
                                Now
                              </Badge>
                            </div>
                          )}

                          {isWeekend && type === "daily" && (
                            <div className="absolute -top-1 -right-1">
                              <Badge
                                variant="outline"
                                className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-[10px] px-1.5 py-0 border-amber-200 dark:border-amber-800"
                              >
                                Weekend
                              </Badge>
                            </div>
                          )}

                          <div className="text-xs sm:text-sm font-medium">
                            {timeLabel}
                          </div>

                          <motion.div
                            className="my-2"
                            animate={
                              selectedItem === index
                                ? { rotate: [0, 10, 0, -10, 0] }
                                : {}
                            }
                            transition={{
                              repeat:
                                selectedItem === index
                                  ? Number.POSITIVE_INFINITY
                                  : 0,
                              duration: 5,
                              ease: "easeInOut",
                            }}
                          >
                            {getWeatherIcon(item.weathercode, isDay)}
                          </motion.div>

                          {type === "daily" ? (
                            <div className="text-xs sm:text-sm text-center">
                              <div className="font-medium flex items-center justify-center gap-1">
                                <span className="text-red-500">
                                  {Math.round(item.temperature_max)}°
                                </span>
                                <span>/</span>
                                <span className="text-blue-500">
                                  {Math.round(item.temperature_min)}°
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {getWeatherDescription(item.weathercode)}
                              </div>
                              <div className="flex items-center justify-center mt-1 text-xs gap-1">
                                <Droplets className="h-3 w-3 text-blue-500" />
                                <span>{item.precipitation_probability}%</span>
                                {getPrecipitationBadge(
                                  item.precipitation_probability
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="text-xs sm:text-sm text-center">
                              <div
                                className={`font-medium ${getTemperatureColor(
                                  item.temperature
                                )}`}
                              >
                                {Math.round(item.temperature)}°C
                              </div>
                              <div className="text-xs text-muted-foreground line-clamp-1">
                                {getWeatherDescription(item.weathercode)}
                              </div>
                              <div className="flex flex-col items-center justify-center mt-1 text-xs gap-1">
                                <div className="flex items-center">
                                  <Droplets className="h-3 w-3 text-blue-500 mr-1" />
                                  <span>{item.precipitation_probability}%</span>
                                </div>
                                {item.apparent_temperature && (
                                  <div className="flex items-center mt-1">
                                    <Thermometer className="h-3 w-3 text-orange-500 mr-1" />
                                    <span>
                                      Feels:{" "}
                                      {Math.round(item.apparent_temperature)}°
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </Tooltip>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
}
