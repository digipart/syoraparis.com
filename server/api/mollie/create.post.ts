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

    const config = useRuntimeConfig();
    
    // Check if API key exists
    if (!config.mollieApiKey) {
      throw createError({
        statusCode: 500,
        message: 'Mollie API key not configured'
      });
    }

    const mollie = createMollieClient({
      apiKey: config.mollieApiKey, // Server-side only!
    });

    // Validate webhook URL is not localhost in production
    if (webhookUrl && webhookUrl.includes('localhost')) {
      console.warn('Warning: webhook URL contains localhost');
    }

    const payment = await mollie.payments.create({
      amount: { 
        currency: amount.currency, 
        value: amount.value 
      },
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
    console.error('Mollie payment creation error:', error);
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to create payment'
    });
  }
});