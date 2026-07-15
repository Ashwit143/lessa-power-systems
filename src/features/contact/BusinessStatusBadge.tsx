"use client";

import { useEffect, useState } from "react";
import { cn } from "@/utils/cn";

export function BusinessStatusBadge() {
  const [status, setStatus] = useState<"Open" | "Closed" | null>(null);

  useEffect(() => {
    const checkBusinessStatus = () => {
      // Get current time in Asia/Kolkata timezone
      const now = new Date();
      const options = { timeZone: "Asia/Kolkata", hour12: false, hour: "numeric", minute: "numeric", weekday: "short" } as const;
      
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(now);
      
      let currentHour = 0;
      let currentMinute = 0;
      let weekday = "";

      parts.forEach(part => {
        if (part.type === "hour") currentHour = parseInt(part.value, 10);
        if (part.type === "minute") currentMinute = parseInt(part.value, 10);
        if (part.type === "weekday") weekday = part.value;
      });

      // Business hours: Monday (Mon) to Saturday (Sat), 9:00 AM (9) to 7:00 PM (19)
      const isSunday = weekday === "Sun";
      
      // We consider it open if the hour is between 9 and 18 (so 9:00 to 18:59).
      // At 19:00 it's closed.
      const isOpenHour = currentHour >= 9 && currentHour < 19;
      
      if (!isSunday && isOpenHour) {
        setStatus("Open");
      } else {
        setStatus("Closed");
      }
    };

    checkBusinessStatus();
    // Re-check every minute
    const interval = setInterval(checkBusinessStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (status === null) {
    // Avoid hydration mismatch by rendering nothing or a placeholder on the server
    return <span className="inline-block w-16 h-5 bg-neutral-100 rounded-full animate-pulse align-middle ml-2" />;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 ml-2 text-xs font-bold rounded-full align-middle",
        status === "Open" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
      )}
    >
      {status === "Open" ? "Open Now" : "Closed Now"}
    </span>
  );
}
