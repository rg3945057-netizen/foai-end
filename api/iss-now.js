export default async function handler(req, res) {
  try {
    const upstream = "https://api.wheretheiss.at/v1/satellites/25544";
    const r = await fetch(upstream, { method: "GET" });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    // Cache for a short time at CDN edge
    res.setHeader("Cache-Control", "s-maxage=10, stale-while-revalidate=59");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
