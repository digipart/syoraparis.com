export default defineEventHandler(async (event) => {
  const {
    token,
    amount,
    description,
    orderId,
    redirectUrl,
    webhookUrl,
    metadata,
  } = await readBody(event);
  const config = useRuntimeConfig();

  try {
    // Create payment with Mollie API
    const response = await $fetch('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.mollieApiKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: {
          currency: amount.currency,
          value: amount.value,
        },
        description: description,
        redirectUrl: redirectUrl,
        webhookUrl: webhookUrl,
        cardToken: token,
        metadata,
      },
    });

    return { success: true, payment: response };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Payment processing failed',
    });
  }
});
