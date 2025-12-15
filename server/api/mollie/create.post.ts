import { createMollieClient } from '@mollie/api-client';

export default defineEventHandler(async (event) => {
  try {
    const {
      method,
      amount,
      description,
      orderId,
      redirectUrl,
      webhookUrl,
      metadata,
    } = await readBody(event);

    if (!amount || !amount.currency || !amount.value) {
      throw new Error('Invalid amount specified for payment.');
    }

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
  } catch (error: any) {
    console.error('Mollie payment creation failed:', error);
    return createError({
      statusCode: 500,
      statusMessage: 'Server Error',
      message: error.message || 'An unexpected error occurred while creating the payment.',
    });
  }
});
