"use client"

import { useState, useCallback } from "react"
import { AlertToast } from "@/components/ui/alert-toast"

type AlertType = "success" | "error" | "warning" | "info"

interface Alert {
  id: string
  type: AlertType
  message: string
}

export function useAlert() {
  const [alerts, setAlerts] = useState<Alert[]>([])

  const showAlert = useCallback((type: AlertType, message: string, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9)
    setAlerts((prev) => [...prev, { id, type, message }])
    return id
  }, [])

  const hideAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }, [])

  const AlertsContainer = useCallback(() => {
    if (alerts.length === 0) return null

    return (
      <>
        {alerts.map((alert) => (
          <AlertToast key={alert.id} type={alert.type} message={alert.message} onClose={() => hideAlert(alert.id)} />
        ))}
      </>
    )
  }, [alerts, hideAlert])

  return {
    showAlert,
    hideAlert,
    AlertsContainer,
  }
}
