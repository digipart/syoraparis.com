/**
 * Google Tag Manager utility functions
 */

/**
 * Push an event to the dataLayer
 * @param eventName The name of the event
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(
  eventName: string,
  eventParams: Record<string, any> = {}
) {
  // Check if we're in the browser and dataLayer exists
  if (process.client && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams,
    });
  }
}

/**
 * Get current currency from AppStore
 */
function getCurrency() {
  try {
    const appStore = useAppStore();
    return appStore.currencyIsoCode || 'EUR';
  } catch (e) {
    return 'EUR';
  }
}

/**
 * Track a product view event
 * @param product The product data
 */
export function trackProductView(product: any) {
  trackEvent('view_item', {
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          currency: getCurrency(),
          item_category: product.category?.name || '',
          item_variant: product.variant || '',
        },
      ],
    },
  });
}

/**
 * Track adding a product to cart
 * @param product The product data
 * @param quantity The quantity added
 */
export function trackAddToCart(product: any, quantity: number = 1) {
  trackEvent('add_to_cart', {
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          currency: getCurrency(),
          quantity: quantity,
          item_category: product.category?.name || '',
          item_variant: product.variant || '',
        },
      ],
    },
  });
}

/**
 * Track removing a product from cart
 * @param product The product data
 * @param quantity The quantity removed
 */
export function trackRemoveFromCart(product: any, quantity: number = 1) {
  trackEvent('remove_from_cart', {
    ecommerce: {
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          price: product.price,
          currency: getCurrency(),
          quantity: quantity,
          item_category: product.category?.name || '',
          item_variant: product.variant || '',
        },
      ],
    },
  });
}

/**
 * Track a purchase event
 * @param order The order data
 */
export function trackPurchase(cart: any) {
  trackEvent('purchase', {
    ecommerce: {
      transaction_id: cart.IdCart,
      value: cart.Total?.ToPay?.TaxIncl || 0,
      tax: cart.Total?.ToPay?.TaxIncl - cart.Total?.ToPay?.TaxExcl || 0,
      shipping: cart.Total?.Shipping?.TaxIncl || 0,
      currency: getCurrency(),
      items:
        cart.Products?.map((item: any) => ({
          item_id: item.IdProduct,
          item_name: item.Description?.Title,
          price: item.Price?.TaxIncl,
          quantity: item.Quantity,
          item_category: item.Category?.Name || '',
          item_variant: item.Variant?.find((v: any) => v.Selected)?.Name || '',
        })) || [],
    },
  });
}
/**
 * Track beginning of checkout
 * @param cart The cart data
 */
export function trackBeginCheckout(cart: any) {
  trackEvent('begin_checkout', {
    ecommerce: {
      value: cart.Total?.ToPay?.TaxIncl || 0,
      currency: getCurrency(),
      items:
        cart.Products?.map((item: any) => ({
          item_id: item.IdProduct,
          item_name: item.Description?.Title,
          price: item.Price?.TaxIncl,
          quantity: item.Quantity,
          item_category: item.Category?.Name || '',
          item_variant: item.Variant?.find((v: any) => v.Selected)?.Name || '',
        })) || [],
    },
  });
}

/**
 * Track adding shipping info
 * @param cart The cart data
 * @param shippingTier The selected shipping tier
 */
export function trackAddShippingInfo(cart: any, shippingTier: string = '') {
  trackEvent('add_shipping_info', {
    ecommerce: {
      value: cart.Total?.ToPay?.TaxIncl || 0,
      currency: getCurrency(),
      shipping_tier: shippingTier,
      items:
        cart.Products?.map((item: any) => ({
          item_id: item.IdProduct,
          item_name: item.Description?.Title,
          price: item.Price?.TaxIncl,
          quantity: item.Quantity,
          item_category: item.Category?.Name || '',
          item_variant: item.Variant?.find((v: any) => v.Selected)?.Name || '',
        })) || [],
    },
  });
}

/**
 * Track adding payment info
 * @param cart The cart data
 * @param paymentType The selected payment type
 */
export function trackAddPaymentInfo(cart: any, paymentType: string = '') {
  trackEvent('add_payment_info', {
    ecommerce: {
      value: cart.Total?.ToPay?.TaxIncl || 0,
      currency: getCurrency(),
      payment_type: paymentType,
      items:
        cart.Products?.map((item: any) => ({
          item_id: item.IdProduct,
          item_name: item.Description?.Title,
          price: item.Price?.TaxIncl,
          quantity: item.Quantity,
          item_category: item.Category?.Name || '',
          item_variant: item.Variant?.find((v: any) => v.Selected)?.Name || '',
        })) || [],
    },
  });
}
