export default async function handler(req, res) {

  const receivedToken = req.headers['asaas-access-token'];
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (receivedToken !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized webhook" });
  }

  const event = req.body;

  console.log("Webhook recebido:", event);

  // Exemplo de tratamento:
  if (event.event === "PAYMENT_CONFIRMED") {
    const paymentId = event.payment.id;
    console.log("Pagamento confirmado:", paymentId);

    // Aqui você atualiza banco e libera bônus
  }

  return res.status(200).json({ received: true });
}
