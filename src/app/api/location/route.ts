import { NextRequest, NextResponse } from "next/server";

type LocationResult = { city: string; state: string } | null;

function cleanText(value: string | null): string {
  if (!value) return "";
  const raw = value.trim();
  if (!raw) return "";

  let text = raw;
  try {
    text = decodeURIComponent(raw);
  } catch {
    text = raw;
  }

  if (!text) return "";

  const invalid = new Set(["-", "unknown", "undefined", "null"]);
  return invalid.has(text.toLowerCase()) ? "" : text;
}

function getLocationFromHeaders(req: NextRequest): LocationResult {
  const cityHeaders = [
    "x-vercel-ip-city",
    "cf-ipcity",
    "x-geo-city",
    "x-appengine-city",
  ];

  const stateHeaders = [
    "x-vercel-ip-country-region",
    "x-vercel-ip-region",
    "cf-region",
    "x-geo-region",
    "x-appengine-region",
  ];

  let city = "";
  for (const header of cityHeaders) {
    city = cleanText(req.headers.get(header));
    if (city) break;
  }

  if (!city) return null;

  let state = "";
  for (const header of stateHeaders) {
    state = cleanText(req.headers.get(header));
    if (state) break;
  }

  return { city, state };
}

function getClientIp(req: NextRequest): string {
  const cfConnectingIp = req.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "";
}

function jsonResponse(data: { city: string; state: string }) {
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}

export async function GET(req: NextRequest) {
  const locationFromHeaders = getLocationFromHeaders(req);
  if (locationFromHeaders) {
    return jsonResponse(locationFromHeaders);
  }

  const clientIp = getClientIp(req);

  const apis: Array<{
    url: string;
    parse: (d: Record<string, unknown>) => LocationResult;
  }> = [];

  if (clientIp) {
    apis.push(
      {
        url: `https://ipwho.is/${encodeURIComponent(clientIp)}?lang=pt-BR`,
        parse: (d) =>
          d.success === true && typeof d.city === "string"
            ? {
                city: d.city,
                state: typeof d.region === "string" ? d.region : "",
              }
            : null,
      },
      {
        url: `https://ipapi.co/${encodeURIComponent(clientIp)}/json/`,
        parse: (d) =>
          typeof d.city === "string"
            ? {
                city: d.city,
                state: typeof d.region === "string" ? d.region : "",
              }
            : null,
      }
    );
  }

  // Fallback for localhost/dev when no forwarded client IP is available.
  apis.push(
    {
      url: "https://ipwho.is/?lang=pt-BR",
      parse: (d) =>
        d.success === true && typeof d.city === "string"
          ? {
              city: d.city,
              state: typeof d.region === "string" ? d.region : "",
            }
          : null,
    },
    {
      url: "https://ipapi.co/json/",
      parse: (d) =>
        typeof d.city === "string"
          ? {
              city: d.city,
              state: typeof d.region === "string" ? d.region : "",
            }
          : null,
    }
  );

  for (const api of apis) {
    try {
      const res = await fetch(api.url, { cache: "no-store" });
      if (!res.ok) continue;
      const data = (await res.json()) as Record<string, unknown>;
      const result = api.parse(data);
      if (result) {
        return jsonResponse(result);
      }
    } catch {
      continue;
    }
  }

  return jsonResponse({ city: "", state: "" });
}
