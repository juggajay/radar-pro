import { NextRequest, NextResponse } from "next/server";

// Use OpenStreetMap's Nominatim API for free geocoding
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 });
  }

  try {
    // Search with Australian bias
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?` +
        new URLSearchParams({
          q: `${query}, Australia`,
          format: "json",
          addressdetails: "1",
          limit: "10",
          countrycodes: "au",
        }),
      {
        headers: {
          "User-Agent": "RadarPro Weather App",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Geocoding API error");
    }

    const data = await response.json();

    // Transform results to our format
    const results = data.map((item: any) => ({
      name: item.address?.suburb || item.address?.city || item.address?.town || item.name,
      displayName: item.display_name,
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      state: item.address?.state || "",
      postcode: item.address?.postcode || "",
      type: item.type,
    }));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Geocoding error:", error);
    return NextResponse.json({ error: "Failed to search locations" }, { status: 500 });
  }
}
