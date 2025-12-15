import { createMollieClient } from '@mollie/api-client';

export default defineEventHandler(async (event) => {
  const {
    method,
    amount,
    description,
    orderId,
    redirectUrl,
    webhookUrl,
    metadata,
  } = await readBody(event);

  const config = useRuntimeConfig();
  const mollie = createMollieClient({
    apiKey: config.mollieApiKey,
  });

  const payment = await mollie.payments.create({
    amount: { currency: amount.currency, value: amount.value },
    description: description,
    method: method,
    redirectUrl: redirectUrl,
    webhookUrl: webhookUrl,
    metadata,
  });

  return {
    paymentUrl: payment.getCheckoutUrl(),
  };
});
