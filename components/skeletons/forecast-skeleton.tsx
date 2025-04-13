"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { motion } from "framer-motion"

interface ForecastSkeletonProps {
  type: "daily" | "hourly"
}

export function ForecastSkeleton({ type }: ForecastSkeletonProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
      <Card className="animate-pulse shadow-md">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center mb-4">
            <Skeleton className="h-5 w-5 rounded-full mr-2" />
            <Skeleton className="h-6 w-40" />
          </div>

          <div className="flex overflow-x-hidden gap-2">
            {[...Array(type === "daily" ? 5 : 6)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px]">
                <div className="flex flex-col items-center p-3 rounded-lg bg-slate-100 dark:bg-slate-800 h-full">
                  <Skeleton className="h-4 w-16 mb-3" />
                  <Skeleton className="h-10 w-10 rounded-full mb-3" />
                  {type === "daily" ? (
                    <>
                      <div className="flex items-center gap-1 mb-2">
                        <Skeleton className="h-4 w-8" />
                        <Skeleton className="h-4 w-2" />
                        <Skeleton className="h-4 w-8" />
                      </div>
                    </>
                  ) : (
                    <Skeleton className="h-4 w-16 mb-2" />
                  )}
                  <Skeleton className="h-3 w-20 mb-2" />
                  <div className="flex items-center justify-center">
                    <Skeleton className="h-3 w-3 rounded-full mr-1" />
                    <Skeleton className="h-3 w-8 mr-1" />
                    <Skeleton className="h-4 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
