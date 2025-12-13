import { createMollieClient } from '@mollie/api-client';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
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
    apiKey: config.public.mollieApiKey,
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
