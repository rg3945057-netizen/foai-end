export default async function handler(req, res) {
  try {
    const { lat, lon, format } = req.query;
    const upstream = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lon)}&format=${encodeURIComponent(format || "json")}`;
    const r = await fetch(upstream, {
      method: "GET",
      headers: {
        "User-Agent": "ISS-Orbit-Dashboard/1.0 (your-email@example.com)",
      },
    });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
