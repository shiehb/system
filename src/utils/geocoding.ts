export async function geocodeAddress(
  address: string
): Promise<{ lat: string; lon: string } | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}&limit=1`
    );

    if (!response.ok) throw new Error("Geocoding failed");

    const data = await response.json();
    if (data.length === 0) return null;

    return {
      lat: data[0].lat,
      lon: data[0].lon,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
