"use client";

import React, { useSyncExternalStore, useEffect, useState } from "react";

// 1. Define a clean subscriber to the browser's online status
function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export default function OfflineAlert() {
  // 2. Modern React state synchronization (Server-Safe)
  const isOnline = useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true, // Default to true on the server to prevent hydration mismatches
  );

  const [status, setStatus] = useState<"connected" | "offline" | null>(null);

  // 3. Keep your exact visual state logic intact
  useEffect(() => {
    if (!isOnline) {
      setStatus("offline");
    } else if (status === "offline") {
      setStatus("connected");

      const timer = setTimeout(() => {
        setStatus(null);
      }, 5000); // 10-second delay before disappearing

      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!status) return null;

  return (
    <div
      className={`fixed top-0 left-1/2 -translate-x-1/2 p-4 flex items-center justify-center max-w-md w-full rounded-lg z-50 shadow-md text-white font-medium transition-all ${
        status === "offline" ? "bg-red-600" : "bg-green-600 animate-fade-in"
      }`}
    >
      {status === "offline"
        ? "You are offline. Trying to reconnect..."
        : "Back online! Connection restored."}
    </div>
  );
}
