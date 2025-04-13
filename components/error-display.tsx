"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface ErrorDisplayProps {
  message: string
  code?: number
}

export function ErrorDisplay({ message, code }: ErrorDisplayProps) {
  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="my-8"
    >
      <Card className="border-red-200 shadow-md overflow-hidden">
        <div className="bg-red-50 dark:bg-red-900/20 p-2 border-b border-red-200 dark:border-red-800">
          <div className="flex items-center text-red-700 dark:text-red-400 font-medium">
            <AlertCircle className="h-4 w-4 mr-2" />
            {code ? `Error ${code}` : "Error"}
          </div>
        </div>
        <CardContent className="p-6 flex flex-col items-center text-center">
          <motion.div
            animate={{
              rotate: [0, 5, 0, -5, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ repeat: 2, duration: 0.5 }}
          >
            <div className="relative">
              <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-500/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Number.POSITIVE_INFINITY, duration: 2, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-muted-foreground mb-6 max-w-md">{message}</p>

          <Button onClick={handleRefresh} className="flex items-center gap-2 px-6 py-5" variant="default" size="lg">
            <RefreshCw className="h-5 w-5" />
            Refresh Page
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
