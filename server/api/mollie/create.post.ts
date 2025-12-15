export default defineEventHandler(async (event) => {
  try {
    // Step 1: Check if we can read the body
    console.log('[STEP 1] Reading body...');
    const body = await readBody(event);
    console.log('[STEP 1] Body received:', body);

    // Step 2: Check if config is accessible
    console.log('[STEP 2] Getting config...');
    const config = useRuntimeConfig();
    console.log('[STEP 2] Config retrieved');

    // Step 3: Check if API key exists
    console.log('[STEP 3] Checking API key...');
    if (!config.mollieApiKey) {
      throw new Error('MOLLIE_API_KEY is not set in environment');
    }
    console.log('[STEP 3] API key exists, prefix:', config.mollieApiKey.substring(0, 10));

    // Step 4: Try to import Mollie
    console.log('[STEP 4] Importing Mollie...');
    const { createMollieClient } = await import('@mollie/api-client');
    console.log('[STEP 4] Mollie imported successfully');

    // Step 5: Create Mollie client
    console.log('[STEP 5] Creating Mollie client...');
    const mollie = createMollieClient({
      apiKey: config.mollieApiKey,
    });
    console.log('[STEP 5] Mollie client created');

    // Step 6: Create payment
    console.log('[STEP 6] Creating payment...');
    const payment = await mollie.payments.create({
      amount: { 
        currency: body.amount.currency, 
        value: body.amount.value 
      },
      description: body.description,
      method: body.method,
      redirectUrl: body.redirectUrl,
      webhookUrl: body.webhookUrl,
      metadata: body.metadata,
    });
    console.log('[STEP 6] Payment created:', payment.id);

    return {
      paymentUrl: payment.getCheckoutUrl(),
    };

  } catch (error: any) {
    console.error('❌ ERROR AT STEP:', error.message);
    console.error('❌ FULL ERROR:', error);
    
    return {
      error: true,
      message: error.message,
      stack: error.stack
    };
  }
});