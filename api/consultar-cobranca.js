export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "Missing id" });
  }

  try {
    const response = await fetch(
      `${process.env.ASAAS_BASE_URL}/payments/${id}`,
      {
        method: "GET",
        headers: {
          access_token: process.env.ASAAS_API_KEY
        }
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}