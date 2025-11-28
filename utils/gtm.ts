/**
 * Google Tag Manager utility functions
 */

/**
 * Push an event to the dataLayer
 * @param eventName The name of the event
 * @param eventParams Additional parameters for the event
 */
export function trackEvent(eventName: string, eventParams: Record<string, any> = {}) {
  // Check if we're in the browser and dataLayer exists
  if (process.client && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventParams
    });
  }
}

/**
 * Track a product view event
 * @param product The product data
 */
export function trackProductView(product: any) {
  trackEvent('view_item', {
    ecommerce: {
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        currency: 'EUR',
        item_category: product.category?.name || '',
        item_variant: product.variant || ''
      }]
    }
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
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        currency: 'EUR',
        quantity: quantity,
        item_category: product.category?.name || '',
        item_variant: product.variant || ''
      }]
    }
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
      items: [{
        item_id: product.id,
        item_name: product.name,
        price: product.price,
        currency: 'EUR',
        quantity: quantity,
        item_category: product.category?.name || '',
        item_variant: product.variant || ''
      }]
    }
  });
}

/**
 * Track a purchase event
 * @param order The order data
 */
export function trackPurchase(order: any) {
  trackEvent('purchase', {
    ecommerce: {
      transaction_id: order.id,
      value: order.total,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      currency: 'EUR',
      items: order.items.map((item: any) => ({
        item_id: item.product.id,
        item_name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        item_category: item.product.category?.name || '',
        item_variant: item.variant || ''
      }))
    }
  });
}
