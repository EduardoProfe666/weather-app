"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

export function WeatherSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden animate-pulse shadow-md">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-sky-400/70 to-blue-500/70 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="text-center sm:text-left mb-3 sm:mb-0">
                <Skeleton className="h-6 w-32 sm:w-40 bg-white/30 mb-2" />
                <Skeleton className="h-4 w-24 sm:w-32 bg-white/20" />
                <Skeleton className="h-5 w-16 bg-white/20 mt-1 rounded-full" />
              </div>
              <div className="flex items-center">
                <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/30" />
                <div className="ml-3 sm:ml-4">
                  <Skeleton className="h-8 w-16 sm:w-20 bg-white/30 mb-2" />
                  <Skeleton className="h-4 w-20 sm:w-24 bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-2 flex-shrink-0" />
                <div className="w-full">
                  <Skeleton className="h-3 w-16 mb-2" />
                  <Skeleton className="h-4 w-12" />
                  {i === 3 && <Skeleton className="h-4 w-8 mt-1 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
