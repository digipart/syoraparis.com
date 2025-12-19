export default defineEventHandler(async (event) => {
  const {
    token,
    amount,
    description,
    orderId,
    redirectUrl,
    webhookUrl,
    metadata,
    customerId,
  } = await readBody(event);
  const config = useRuntimeConfig();

  try {
    // Create payment with Mollie API - force creditcard method for direct processing
    const paymentBody: any = {
      amount: {
        currency: amount.currency,
        value: amount.value,
      },
      method: 'creditcard',
      description: description,
      webhookUrl: webhookUrl,
      cardToken: token,
      metadata,
    };

    // redirectUrl is required by Mollie even for direct card payments (for 3DS fallback)
    paymentBody.redirectUrl = redirectUrl || `${process.env.NUXT_PUBLIC_URL || 'https://syoraparis.com'}/order/accepted?orderid=${orderId}`;

    const response = await $fetch<any>('https://api.mollie.com/v2/payments', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.mollieApiKey}`,
        'Content-Type': 'application/json',
      },
      body: paymentBody,
    });

    return { 
      success: true, 
      payment: response,
      paymentId: response?.id,
      status: response?.status,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.data?.message || error.message || 'Payment processing failed',
    });
  }
});
