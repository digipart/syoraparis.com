export default defineEventHandler(async (event): Promise<any> => {
  const paymentId = getRouterParam(event, 'id');
  const config = useRuntimeConfig();

  if (!paymentId) {
    throw createError({
      statusCode: 400,
      message: 'Payment ID is required',
    });
  }

  try {
    // Fetch payment status from Mollie API
    const response: any = await $fetch<any>(
      `https://api.mollie.com/v2/payments/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${config.mollieApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return {
      success: true,
      status: response?.status,
      paymentId: response?.id,
      payment: response,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.data?.message || error.message || 'Failed to fetch payment status',
    });
  }
});
