export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const receivedToken = req.headers["asaas-access-token"];
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN;

  if (!receivedToken || receivedToken !== expectedToken) {
    return res.status(401).json({ error: "Unauthorized webhook" });
  }

  const event = req.body;

  console.log("Evento recebido:", event.event);

  if (event.event === "PAYMENT_CONFIRMED") {

    const paymentId = event.payment.id;

    try {

      // 1️⃣ Buscar boleto no Base44 pelo paymentId
      const findResponse = await fetch(
        `https://app.base44.com/api/apps/697d0116fccbb3128aabd5bf/entities/Boleto?filter=asaasPaymentId:eq:${paymentId}`,
        {
          headers: {
            "api_key": process.env.BASE44_API_KEY,
            "Content-Type": "application/json"
          }
        }
      );

      const boletos = await findResponse.json();

      if (boletos.length === 0) {
        console.log("Boleto não encontrado no Base44");
        return res.status(200).json({ received: true });
      }

      const boleto = boletos[0];

      // 2️⃣ Atualizar status
      await fetch(
        `https://app.base44.com/api/apps/697d0116fccbb3128aabd5bf/entities/Boleto/${boleto.id}`,
        {
          method: "PUT",
          headers: {
            "api_key": process.env.BASE44_API_KEY,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "CONFIRMADO",
            paid_date: new Date().toISOString()
          })
        }
      );

      console.log("Status atualizado no Base44");

    } catch (err) {
      console.error("Erro ao atualizar Base44:", err);
    }
  }

  return res.status(200).json({ received: true });
}
