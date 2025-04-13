"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun,
  Moon,
  RefreshCw,
  Settings,
  ChevronDown,
  Briefcase,
} from "lucide-react";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface AppControlsProps {
  onRefresh: () => void;
  isLoading: boolean;
  className?: string;
}

export function AppControls({
  onRefresh,
  isLoading,
  className,
}: AppControlsProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleRefresh = () => {
    onRefresh();
  };

  if (!mounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className={cn("fixed bottom-4 right-4 z-40", className)}>
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="flex flex-col gap-2 mb-2"
            >
              <Tooltip
                content={isLoading ? "Refreshing..." : "Refresh weather data"}
              >
                <div className="flex justify-center">
                  <motion.button
                    onClick={handleRefresh}
                    disabled={isLoading}
                    className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors disabled:opacity-50"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <RefreshCw
                      className={`h-5 w-5 ${
                        isLoading ? "animate-spin text-sky-500" : ""
                      }`}
                    />
                  </motion.button>
                </div>
              </Tooltip>

              <Tooltip
                content={`Switch to ${
                  theme === "dark" ? "light" : "dark"
                } mode`}
              >
                <div className="flex justify-center">
                  <motion.button
                    onClick={toggleTheme}
                    className="h-10 w-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-colors"
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    {theme === "dark" ? (
                      <Sun className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <Moon className="h-5 w-5 text-indigo-500" />
                    )}
                  </motion.button>
                </div>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col gap-2">
          <Tooltip content={expanded ? "Hide controls" : "Show controls"}>
            <motion.button
              onClick={() => setExpanded(!expanded)}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 dark:from-indigo-600 dark:to-purple-700 shadow-lg flex items-center justify-center text-white"
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
              initial={false}
              animate={
                expanded
                  ? { rotate: 180, backgroundColor: "#3b82f6" }
                  : { rotate: 0, backgroundColor: "#0ea5e9" }
              }
            >
              {expanded ? (
                <ChevronDown className="h-6 w-6" />
              ) : (
                <Settings className="h-6 w-6" />
              )}
            </motion.button>
          </Tooltip>

          <Tooltip content="Visit Portfolio">
            <motion.a
              href="https://eduardoprofe666.github.io"
              target="_blank"
              rel="noopener noreferrer"
              className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 dark:from-purple-700 dark:to-indigo-800 shadow-lg flex items-center justify-center text-white"
              whileTap={{ scale: 0.95 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Briefcase className="h-6 w-6" />
            </motion.a>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
}
