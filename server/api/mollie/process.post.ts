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
    paymentBody.redirectUrl = redirectUrl || `${process.env.NUXT_PUBLIC_URL || 'https://unicodeparis.com'}/order/accepted?orderid=${orderId}&init=1`;

    console.log('Sending payload to Mollie:', JSON.stringify(paymentBody, null, 2));

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
    console.error('Mollie API Error:', error);
    if (error.data) {
      console.error('Mollie Error Data:', JSON.stringify(error.data, null, 2));
    }
    throw createError({
      statusCode: 400,
      message: error.data?.detail || error.message || 'Payment processing failed',
      data: error.data // Pass details to frontend
    });
  }
});
