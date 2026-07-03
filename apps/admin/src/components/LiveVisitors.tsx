"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Users, Eye, Clock, Activity } from "lucide-react";

export default function LiveVisitors() {
  const [activeUsers, setActiveUsers] = useState(128);
  const [pageViews, setPageViews] = useState(12450);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fluctuate active users by a random value between -4 and +4
      setActiveUsers((prev) => {
        const change = Math.floor(Math.random() * 9) - 4;
        const nextValue = prev + change;
        return nextValue > 10 ? nextValue : 12; // Keep at least 12 visitors active
      });

      // Periodically increment page views slightly
      setPageViews((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="shadow-lg border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden relative">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" />
          Live Traffic
        </CardTitle>
        <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs px-2.5 py-0.5 rounded-full font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          LIVE
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <div className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {activeUsers}
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">
              Active visitors on site
            </p>
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800">
            <Users className="h-6 w-6 text-zinc-400 dark:text-zinc-500" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">
              <Eye className="h-3.5 w-3.5 text-zinc-400" />
              Page Views
            </div>
            <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              {new Intl.NumberFormat("en-IN").format(pageViews)}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium mb-1">
              <Clock className="h-3.5 w-3.5 text-zinc-400" />
              Avg. Duration
            </div>
            <div className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
              3m 42s
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
