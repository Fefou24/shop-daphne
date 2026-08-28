// Géocodage gratuit via l'API Adresse du gouvernement français (pas de clé).
// https://adresse.data.gouv.fr/api-doc/adresse

export type GeoPoint = { lat: number; lng: number; label: string };

export async function geocodeAddress(query: string): Promise<GeoPoint | null> {
  if (!query || query.trim().length < 4) return null;
  try {
    const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(url, { headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const f = data?.features?.[0];
    if (!f) return null;
    const [lng, lat] = f.geometry.coordinates;
    return { lat, lng, label: f.properties?.label ?? query };
  } catch {
    return null;
  }
}

// Distance en mètres entre deux points (formule de haversine)
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Estimation grossière du temps de trajet en voiture (ville) à partir de la distance à vol d'oiseau. */
export function estimateTravelMinutes(distanceM: number): number {
  const roadKm = (distanceM / 1000) * 1.4; // facteur route
  const speedKmh = 18; // vitesse moyenne en ville (trafic, feux)
  return Math.max(1, Math.round((roadKm / speedKmh) * 60));
}
