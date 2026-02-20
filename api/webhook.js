export default async function handler(req, res) {
  console.log("Webhook recebido:", req.body);
  return res.status(200).json({ received: true });
}