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
    fetch("/api/location")
      .then((res) => res.json())
      .then((data: { city: string; state: string }) => {
        if (data.city && data.state) {
          setLocation({
            city: data.city,
            state: data.state,
            full: `${data.city} - ${data.state}`,
            loading: false,
          });
        } else {
          setLocation((prev) => ({ ...prev, loading: false }));
        }
      })
      .catch(() => {
        setLocation((prev) => ({ ...prev, loading: false }));
      });
  }, []);

  return location;
}
