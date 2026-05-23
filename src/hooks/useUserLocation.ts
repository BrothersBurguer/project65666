"use client";

import { useState, useEffect } from "react";

type UserLocation = {
  city: string;
  state: string;
  full: string;
  loading: boolean;
};

export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    city: "",
    state: "",
    full: "",
    loading: true,
  });

  useEffect(() => {
    const applyLocation = (city: string, state?: string) => {
      const safeCity = city?.trim();
      const safeState = (state || "").trim();

      if (!safeCity) return false;

      setLocation({
        city: safeCity,
        state: safeState,
        full: safeState ? `${safeCity} - ${safeState}` : safeCity,
        loading: false,
      });

      return true;
    };

    const finishWithoutLocation = () => {
      setLocation((prev) => ({ ...prev, loading: false }));
    };

    const tryBrowserGeolocation = () => {
      if (!navigator.geolocation) {
        finishWithoutLocation();
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=pt-BR`;
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) {
              finishWithoutLocation();
              return;
            }

            const data = (await res.json()) as {
              address?: {
                city?: string;
                town?: string;
                village?: string;
                municipality?: string;
                state?: string;
              };
            };

            const address = data.address || {};
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.municipality ||
              "";

            if (!applyLocation(city, address.state)) {
              finishWithoutLocation();
            }
          } catch {
            finishWithoutLocation();
          }
        },
        () => {
          finishWithoutLocation();
        },
        { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 }
      );
    };

    fetch("/api/location")
      .then((res) => res.json())
      .then((data: { city: string; state: string }) => {
        if (!applyLocation(data.city, data.state)) {
          tryBrowserGeolocation();
        }
      })
      .catch(() => {
        tryBrowserGeolocation();
      });
  }, []);

  return location;
}
