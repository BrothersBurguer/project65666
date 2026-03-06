import { NextResponse } from "next/server";

export async function GET() {
  const apis = [
    {
      url: "http://ip-api.com/json/?lang=pt-BR&fields=city,regionName,status",
      parse: (d: Record<string, string>) =>
        d.status === "success"
          ? { city: d.city, state: d.regionName }
          : null,
    },
    {
      url: "https://get.geojs.io/v1/ip/geo.json",
      parse: (d: Record<string, string>) =>
        d.city && d.region ? { city: d.city, state: d.region } : null,
    },
  ];

  for (const api of apis) {
    try {
      const res = await fetch(api.url, { next: { revalidate: 300 } });
      if (!res.ok) continue;
      const data = await res.json();
      const result = api.parse(data);
      if (result) {
        return NextResponse.json(result);
      }
    } catch {
      continue;
    }
  }

  return NextResponse.json({ city: "", state: "" });
}
