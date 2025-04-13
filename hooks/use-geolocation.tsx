"use client"

import { useState } from "react"

export function useGeolocation() {
  const [locationError, setLocationError] = useState<string | null>(null)

  const getLocation = async (): Promise<{ lat: number; lon: number } | null> => {
    setLocationError(null)

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      return null
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        })
      })

      return {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      }
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("User denied the request for geolocation")
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable")
            break
          case error.TIMEOUT:
            setLocationError("The request to get user location timed out")
            break
          default:
            setLocationError("An unknown error occurred")
            break
        }
      } else {
        setLocationError("Failed to get location")
      }
      return null
    }
  }

  return { getLocation, locationError }
}
