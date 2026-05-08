export default async function handler(req, res) {
  try {
    const upstream = "http://api.open-notify.org/astros.json";
    const r = await fetch(upstream, { method: "GET" });
    if (!r.ok) return res.status(r.status).send(await r.text());
    const data = await r.json();
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
