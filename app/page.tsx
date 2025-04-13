"use client";

import { useEffect, useState } from "react";
import { Search } from "@/components/search";
import { WeatherDisplay } from "@/components/weather-display";
import { ForecastDisplay } from "@/components/forecast-display";
import { WeatherDetails } from "@/components/weather-details";
import { ErrorDisplay } from "@/components/error-display";
import { useWeather } from "@/hooks/use-weather";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useAlert } from "@/hooks/use-alert";
import { WeatherSkeleton } from "@/components/skeletons/weather-skeleton";
import { ForecastSkeleton } from "@/components/skeletons/forecast-skeleton";
import { Loader } from "@/components/ui/loader";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Clock, MapPin, Info } from "lucide-react";
import { AppControls } from "@/components/app-controls";
import { TooltipProvider, Tooltip } from "@/components/ui/tooltip";

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [coordinates, setCoordinates] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const { getLocation, locationError } = useGeolocation();
  const { showAlert, AlertsContainer } = useAlert();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("daily");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const {
    currentWeather,
    forecast,
    hourlyForecast,
    isLoading,
    error,
    refetch,
  } = useWeather(coordinates);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading === false) {
      setLastUpdated(new Date());
    }
  }, [isLoading]);

  useEffect(() => {
    if (!isMounted) return;

    const loadSavedLocation = async () => {
      try {
        let lastCity = null;
        let lastCoords = null;

        try {
          lastCity = localStorage.getItem("lastCity");
          lastCoords = localStorage.getItem("lastCoordinates");
        } catch (storageError) {
          console.error("Error accessing localStorage:", storageError);
        }

        if (lastCity) {
          setCity(lastCity);
        }

        if (lastCoords) {
          try {
            const parsedCoords = JSON.parse(lastCoords);
            if (
              parsedCoords &&
              typeof parsedCoords.lat === "number" &&
              typeof parsedCoords.lon === "number"
            ) {
              setCoordinates(parsedCoords);
            } else {
              setCity("Madrid, Spain");
              setCoordinates({ lat: 40.4168, lon: -3.7038 });
            }
          } catch (parseError) {
            console.error("Error parsing coordinates:", parseError);
            setCity("Madrid, Spain");
            setCoordinates({ lat: 40.4168, lon: -3.7038 });
          }
        } else {
          try {
            const location = await getLocation();
            if (location) {
              setCoordinates(location);
              setCity("Current Location");
              showAlert("info", "Using your current location");
            } else {
              setCity("Madrid, Spain");
              setCoordinates({ lat: 40.4168, lon: -3.7038 });
              showAlert("info", "Using default location: Madrid");
            }
          } catch (geoError) {
            console.error("Geolocation error:", geoError);
            setCity("Madrid, Spain");
            setCoordinates({ lat: 40.4168, lon: -3.7038 });
            showAlert("info", "Using default location: Madrid");
          }
        }
      } catch (err) {
        console.error("Error loading location:", err);
        setCity("Madrid, Spain");
        setCoordinates({ lat: 40.4168, lon: -3.7038 });
        showAlert("info", "Using default location: Madrid");
      } finally {
        setTimeout(() => setIsInitialLoading(false), 1000);
      }
    };

    loadSavedLocation();
  }, [isMounted, showAlert]);

  const handleCitySelect = (selectedCity: string, lat: number, lon: number) => {
    if (
      typeof lat !== "number" ||
      typeof lon !== "number" ||
      isNaN(lat) ||
      isNaN(lon)
    ) {
      console.error("Invalid coordinates:", { lat, lon });
      showAlert("error", "Invalid location coordinates");
      return;
    }

    setCity(selectedCity);
    setCoordinates({ lat, lon });
    showAlert("success", `Weather updated for ${selectedCity}`);

    try {
      localStorage.setItem("lastCity", selectedCity);
      localStorage.setItem("lastCoordinates", JSON.stringify({ lat, lon }));
    } catch (err) {
      console.error("Error saving to localStorage:", err);
    }
  };

  const handleGetLocation = async () => {
    showAlert("info", "Getting your location...");
    const location = await getLocation();
    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lon === "number"
    ) {
      setCoordinates(location);
      setCity("Current Location");
      showAlert("success", "Using your current location");
      try {
        localStorage.setItem("lastCoordinates", JSON.stringify(location));
        localStorage.setItem("lastCity", "Current Location");
      } catch (err) {
        console.error("Error saving to localStorage:", err);
      }
    } else if (locationError) {
      showAlert("error", locationError);
    }
  };

  const handleRefresh = () => {
    showAlert("info", "Refreshing weather data...");
    refetch();
  };

  if (!isMounted || isInitialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader
            size="lg"
            className="border-sky-500"
            text="Loading Weather App..."
          />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-50 dark:from-slate-900 dark:to-slate-800 p-2 sm:p-4 md:p-6 lg:p-8">
        <motion.div
          className="max-w-4xl mx-auto space-y-4 sm:space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            staggerChildren: 0.1,
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center justify-between w-full sm:w-auto">
              <motion.h1
                className="text-2xl sm:text-3xl font-bold flex items-center"
                initial={{ x: -20 }}
                animate={{ x: 0 }}
              >
                <Sun className="mr-2 h-6 w-6 text-yellow-500" />
                Weather App
              </motion.h1>
              <div className="flex items-center gap-2 sm:hidden">
                <Tooltip content="Current location">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate max-w-[120px]">{city}</span>
                  </div>
                </Tooltip>
              </div>
            </div>
            <Search
              onCitySelect={handleCitySelect}
              onGetLocation={handleGetLocation}
            />
          </div>

          {error || locationError ? (
            <ErrorDisplay
              message={error || locationError || "An error occurred"}
            />
          ) : (
            <>
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    className="space-y-6"
                    exit={{ opacity: 0 }}
                  >
                    <WeatherSkeleton />
                    <ForecastSkeleton type="daily" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {currentWeather ? (
                      <>
                        <WeatherDisplay
                          currentWeather={currentWeather}
                          city={city}
                        />
                        <WeatherDetails weatherData={currentWeather} />
                      </>
                    ) : (
                      <WeatherSkeleton />
                    )}

                    <Tabs
                      defaultValue="daily"
                      className="w-full"
                      onValueChange={setActiveTab}
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger
                          value="daily"
                          className="flex items-center gap-1"
                        >
                          <Sun className="h-4 w-4" />
                          <span>5-Day Forecast</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="hourly"
                          className="flex items-center gap-1"
                        >
                          <Clock className="h-4 w-4" />
                          <span>Hourly Forecast</span>
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="daily">
                        {forecast && forecast.length > 0 ? (
                          <ForecastDisplay forecast={forecast} type="daily" />
                        ) : (
                          <ForecastSkeleton type="daily" />
                        )}
                      </TabsContent>
                      <TabsContent value="hourly">
                        {hourlyForecast && hourlyForecast.length > 0 ? (
                          <ForecastDisplay
                            forecast={hourlyForecast}
                            type="hourly"
                          />
                        ) : (
                          <ForecastSkeleton type="hourly" />
                        )}
                      </TabsContent>
                    </Tabs>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}

          <motion.div
            className="text-center text-xs text-muted-foreground mt-8 pb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p>
              Data provided by{" "}
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-sky-500 transition-colors"
              >
                Open-Meteo
              </a>
            </p>
            <p className="mt-1 flex items-center justify-center">
              <Info className="h-3 w-3 mr-1" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
            </p>
          </motion.div>
        </motion.div>

        {/* Floating controls */}
        <AppControls onRefresh={handleRefresh} isLoading={isLoading} />

        <AlertsContainer />
      </main>
    </TooltipProvider>
  );
}
