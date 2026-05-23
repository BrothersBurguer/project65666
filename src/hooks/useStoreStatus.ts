"use client";

import { useState, useEffect } from "react";

export function useStoreStatus() {
  const [isOpen, setIsOpen] = useState(true);
  const [closingTime, setClosingTime] = useState<string | null>(null);

  useEffect(() => {
    function check() {
      const now = new Date();
      const hours = now.getHours();

      if (hours >= 0 && hours < 2) {
        setIsOpen(true);
        setClosingTime("até 02:00");
      } else if (hours >= 8 && hours < 23) {
        setIsOpen(true);
        setClosingTime(null);
      } else {
        setIsOpen(true);
        setClosingTime(null);
      }
    }

    check();
    const interval = setInterval(check, 60000);
    return () => clearInterval(interval);
  }, []);

  return { isOpen, closingTime };
}
