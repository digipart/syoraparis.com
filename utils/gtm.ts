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
 * Extract variant ID from product or specific attribute ID
 * @param product The product data
 * @param idProductAttribute Optional specific attribute ID
 */
function getSelectedVariantId(product: any, idProductAttribute?: number) {
  if (idProductAttribute) return idProductAttribute.toString();

  const selectedVariant = product.Variant?.find((v: any) => v.Selected);
  return selectedVariant?.Combination?.IdProductAttribute?.toString() || '';
}

/**
 * Track a product view event
 * @param product The product data
 */
export function trackProductView(product: any) {
  const price =
    product.Price?.PromotionalPrice?.PriceTaxIncl ||
    product.Price?.RegularPrice?.PriceTaxIncl ||
    0;

  trackEvent('view_item', {
    ecommerce: {
      items: [
        {
          item_id: product.IdProduct?.toString(),
          item_name: product.Description?.Title || '',
          price: price,
          currency: getCurrency(),
          item_category: product.Category?.Main?.IdCategory?.toString() || '',
          item_variant: getSelectedVariantId(product),
        },
      ],
    },
  });
}

/**
 * Track adding a product to cart
 * @param product The product data
 * @param quantity The quantity added
 * @param idProductAttribute The specific attribute ID added
 */
export function trackAddToCart(
  product: any,
  quantity: number = 1,
  idProductAttribute?: number
) {
  const price =
    product.Price?.PromotionalPrice?.PriceTaxIncl ||
    product.Price?.RegularPrice?.PriceTaxIncl ||
    0;

  trackEvent('add_to_cart', {
    ecommerce: {
      items: [
        {
          item_id: product.IdProduct?.toString(),
          item_name: product.Description?.Title || '',
          price: price,
          currency: getCurrency(),
          quantity: quantity,
          item_category: product.Category?.Main?.IdCategory?.toString() || '',
          item_variant: getSelectedVariantId(product, idProductAttribute),
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
  const price =
    product.Price?.PromotionalPrice?.PriceTaxIncl ||
    product.Price?.RegularPrice?.PriceTaxIncl ||
    0;

  trackEvent('remove_from_cart', {
    ecommerce: {
      items: [
        {
          item_id: product.IdProduct?.toString(),
          item_name: product.Description?.Title || '',
          price: price,
          currency: getCurrency(),
          quantity: quantity,
          item_category: product.Category?.Main?.IdCategory?.toString() || '',
          item_variant: getSelectedVariantId(product),
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
      transaction_id: cart.IdCart?.toString(),
      value: cart.Total?.ToPay?.TaxIncl || 0,
      tax:
        (cart.Total?.ToPay?.TaxIncl || 0) - (cart.Total?.ToPay?.TaxExcl || 0),
      shipping: cart.Total?.Shipping?.TaxIncl || 0,
      currency: getCurrency(),
      items:
        cart.Products?.map((item: any) => {
          const itemPrice =
            item.Price?.PromotionalPrice?.PriceTaxIncl ||
            item.Price?.RegularPrice?.PriceTaxIncl ||
            item.Price?.TaxIncl ||
            0;

          return {
            item_id: item.IdProduct?.toString(),
            item_name: item.Description?.Title || '',
            price: itemPrice,
            quantity: item.Quantity,
            item_category: item.Category?.Main?.IdCategory?.toString() || '',
            item_variant:
              item.IdProductAttribute?.toString() || getSelectedVariantId(item),
          };
        }) || [],
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
        cart.Products?.map((item: any) => {
          const itemPrice =
            item.Price?.PromotionalPrice?.PriceTaxIncl ||
            item.Price?.RegularPrice?.PriceTaxIncl ||
            item.Price?.TaxIncl ||
            0;

          return {
            item_id: item.IdProduct?.toString(),
            item_name: item.Description?.Title || '',
            price: itemPrice,
            quantity: item.Quantity,
            item_category: item.Category?.Main?.IdCategory?.toString() || '',
            item_variant:
              item.IdProductAttribute?.toString() || getSelectedVariantId(item),
          };
        }) || [],
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
        cart.Products?.map((item: any) => {
          const itemPrice =
            item.Price?.PromotionalPrice?.PriceTaxIncl ||
            item.Price?.RegularPrice?.PriceTaxIncl ||
            item.Price?.TaxIncl ||
            0;

          return {
            item_id: item.IdProduct?.toString(),
            item_name: item.Description?.Title || '',
            price: itemPrice,
            quantity: item.Quantity,
            item_category: item.Category?.Main?.IdCategory?.toString() || '',
            item_variant:
              item.IdProductAttribute?.toString() || getSelectedVariantId(item),
          };
        }) || [],
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
        cart.Products?.map((item: any) => {
          const itemPrice =
            item.Price?.PromotionalPrice?.PriceTaxIncl ||
            item.Price?.RegularPrice?.PriceTaxIncl ||
            item.Price?.TaxIncl ||
            0;

          return {
            item_id: item.IdProduct?.toString(),
            item_name: item.Description?.Title || '',
            price: itemPrice,
            quantity: item.Quantity,
            item_category: item.Category?.Main?.IdCategory?.toString() || '',
            item_variant:
              item.IdProductAttribute?.toString() || getSelectedVariantId(item),
          };
        }) || [],
    },
  });
}
