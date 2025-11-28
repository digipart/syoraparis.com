# Google Tag Manager (GTM) Integration

This document explains how Google Tag Manager has been integrated into the UnicodeParis.com application.

## Overview

Google Tag Manager (GTM) is a tag management system that allows you to quickly and easily update tags and code snippets on your website. The integration enables tracking of user interactions, page views, and e-commerce events.

## Setup

### Environment Variables

Add the GTM ID to your environment variables:

```
GTM_ID=GTM-XXXXXXX
```

You can find this in your `.env` file or add it to your deployment environment.

### Configuration

The GTM module is configured in `nuxt.config.ts` with the following options:

- `id`: The GTM container ID from environment variables
- `enabled`: Only enabled if GTM_ID is provided
- `debug`: Enabled in development mode for debugging
- `loadScript`: Automatically loads the GTM script
- `pageTracking`: Automatically tracks page views
- `respectDoNotTrack`: Respects the user's Do Not Track setting

## Available Tracking Functions

The following tracking functions are available in `utils/gtm.ts`:

### Basic Event Tracking

```typescript
import { trackEvent } from '~/utils/gtm';

// Track a custom event
trackEvent('button_click', { 
  button_name: 'subscribe',
  page_section: 'header'
});
```

### E-commerce Event Tracking

```typescript
import { 
  trackProductView,
  trackAddToCart,
  trackRemoveFromCart,
  trackPurchase
} from '~/utils/gtm';

// Track a product view
trackProductView(product);

// Track adding a product to cart
trackAddToCart(product, quantity);

// Track removing a product from cart
trackRemoveFromCart(product, quantity);

// Track a purchase
trackPurchase(order);
```

## Implemented Tracking

The following tracking has been implemented:

1. **Page Views**: Automatically tracked on route changes
2. **Product Views**: Tracked when a user views a product (hover or click)
3. **Add to Cart**: Tracked when a user adds a product to cart

## Adding New Tracking

To add new tracking events:

1. Import the appropriate tracking function from `~/utils/gtm`
2. Call the function with the required parameters at the appropriate point in your code

Example:

```typescript
import { trackEvent } from '~/utils/gtm';

// In your component method
const submitForm = () => {
  // Your existing code
  
  // Track the form submission
  trackEvent('form_submit', { 
    form_name: 'contact',
    form_length: formFields.length
  });
};
```

## Testing GTM Integration

To test if GTM is working correctly:

1. Install the [Google Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome extension
2. Open your website with the extension enabled
3. Check if the GTM container is loaded correctly
4. Use the preview mode in GTM to see events being triggered in real-time

## Troubleshooting

If GTM events are not being tracked:

1. Check if the GTM_ID environment variable is set correctly
2. Verify that the GTM container is published
3. Check browser console for any errors
4. Ensure dataLayer is properly initialized before pushing events
