<template>
  <div class="mollie-payment-form">
    <div class="wrapper-mollie-components">
      <div class="form-group">
        <label class="label">{{ $t('tunnel.payment.card.holder') }}</label>
        <div :id="`card-holder-${uid}`" class="input-container"></div>
        <div :id="`card-holder-error-${uid}`" class="error-text" role="alert"></div>
      </div>
      
      <div class="form-group">
        <label class="label">{{ $t('tunnel.payment.card.number') }}</label>
        <div :id="`card-number-${uid}`" class="input-container"></div>
        <div :id="`card-number-error-${uid}`" class="error-text" role="alert"></div>
      </div>

      <div class="flex-row">
        <div class="form-group half">
          <label class="label">{{ $t('tunnel.payment.card.expiry') }}</label>
          <div :id="`expiry-date-${uid}`" class="input-container"></div>
          <div :id="`expiry-date-error-${uid}`" class="error-text" role="alert"></div>
        </div>

        <div class="form-group half">
          <label class="label">{{ $t('tunnel.payment.card.cvc') }}</label>
          <div :id="`verification-code-${uid}`" class="input-container"></div>
          <div :id="`verification-code-error-${uid}`" class="error-text" role="alert"></div>
        </div>
      </div>
    </div>

    <div class="text-center mt-6">
      <BaseButton
        :disabled="isProcessing"
        class="w-full"
        type="primary"
        @click="handleSubmit"
        :title="$t('tunnel.payment.card.button')"
      >
        {{ isProcessing ? $t('tunnel.payment.card.redirecting') : $t('tunnel.payment.card.button') }}
      </BaseButton>
    </div>
    <div
      v-if="paymentStatus"
      class="status-message"
      :class="paymentStatus.type"
    >
      {{ paymentStatus.message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import MollieHelper from '~/helpers/payments/MollieHelper';
import type { PaymentMethodType } from '~/types/PaymentType';

const { t } = useI18n();
const config = useRuntimeConfig();

const emit = defineEmits<{
  error: [error: string];
}>();

const props = defineProps<{
  paymentMethod: PaymentMethodType;
}>();

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);
const auth = useAuth();
const { customer } = toRefs(auth);

const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const checkoutStore = useCheckoutStore();

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const isProcessing = ref(false);
const paymentStatus = ref<{ type: string; message: string } | null>(null);

// Mollie references
// Mollie references
let mollie: any = null;
let cardHolder: any = null;
let cardNumber: any = null;
let expiryDate: any = null;
let verificationCode: any = null;
const isMollieInitialized = ref(false);
const uid = Math.random().toString(36).substring(7);

useHead({
  script: [
    {
      src: 'https://js.mollie.com/v1/mollie.js',
      defer: true,
      onload: () => {
        initializeMollie();
      },
    }
  ]
});

const cleanUpMollieComponents = () => {
    try {
        if (cardHolder) { cardHolder.unmount(); cardHolder = null; }
        if (cardNumber) { cardNumber.unmount(); cardNumber = null; }
        if (expiryDate) { expiryDate.unmount(); expiryDate = null; }
        if (verificationCode) { verificationCode.unmount(); verificationCode = null; }
        isMollieInitialized.value = false;
        console.log('Mollie components cleaned up');
    } catch (e) {
        console.warn('Error during Mollie cleanup', e);
    }
};

const initializeMollie = async () => {
  // Always clean up potential previous instances first
  cleanUpMollieComponents();
  
  await nextTick();

  if (typeof (window as any).Mollie === 'undefined') {
    console.error('Mollie JS not loaded');
    return;
  }
  
  const profileId = config.public.mollieProfileId;
  if (!profileId) {
      console.error('Mollie Profile ID is missing in config');
      return;
  }
  
  console.log('Initializing Mollie with profile:', profileId);

  try {
      // Initialize Mollie if not already done
      if (!mollie) {
        // @ts-ignore
        mollie = (window as any).Mollie(profileId, {
            locale: 'fr_FR', // Or dynamic based on locale
            testmode: config.public.mollieTestMode === 'true' || config.public.mollieTestMode === true || config.public.mollieTestMode === 'enabled'
        });
      }

      const options = {
        styles: {
          base: {
            fontSize: '16px',
            color: '#333333',
            '::placeholder': {
              color: '#888888',
            },
          },
          valid: {
            color: '#00af5c',
          },
          invalid: {
            color: '#e74c3c',
          },
        },
      };

      const cardHolderId = `card-holder-${uid}`;
      const cardNumberId = `card-number-${uid}`;
      const expiryDateId = `expiry-date-${uid}`;
      const verificationCodeId = `verification-code-${uid}`;

      // Ensure elements exist before mounting
      const holderEl = document.getElementById(cardHolderId);
      if (!holderEl) {
          console.warn('Mollie mount points not found in DOM, retrying in 100ms...');
          setTimeout(initializeMollie, 100);
          return;
      }

      cardHolder = mollie.createComponent('cardHolder', options);
      cardHolder.mount('#' + cardHolderId);

      cardNumber = mollie.createComponent('cardNumber', options);
      cardNumber.mount('#' + cardNumberId);

      expiryDate = mollie.createComponent('expiryDate', options);
      expiryDate.mount('#' + expiryDateId);

      verificationCode = mollie.createComponent('verificationCode', options);
      verificationCode.mount('#' + verificationCodeId);
      
      isMollieInitialized.value = true;
      
      // Error handling listeners
      const addErrorListener = (component: any, errorId: string) => {
        component.addEventListener('change', (event: any) => {
          const errorElement = document.getElementById(errorId);
          if (errorElement) {
              // Safe access
            if (event && event.error && event.touched) {
              errorElement.textContent = event.error;
            } else {
              errorElement.textContent = '';
            }
          }
        });
      };

      addErrorListener(cardHolder, 'card-holder-error-' + uid);
      addErrorListener(cardNumber, 'card-number-error-' + uid);
      addErrorListener(expiryDate, 'expiry-date-error-' + uid);
      addErrorListener(verificationCode, 'verification-code-error-' + uid);
      
      console.log('Mollie components initialized successfully');
  } catch (e) {
      console.error('Error initializing Mollie:', e);
  }
};

onMounted(() => {
   // If script is already loaded (e.g. navigation back)
   if (typeof (window as any).Mollie !== 'undefined') {
       initializeMollie();
   }
});

onUnmounted(() => {
    cleanUpMollieComponents();
});

const handleSubmit = async () => {
  console.log('handleSubmit called');
  
  const allValid = await checkoutStore.validateCheckoutBeforePayment();
  console.log('Validation result:', allValid);

  if (!allValid) {
    const firstError = document.querySelector(
      '.formShipping .text-red-500, .inputText.error, .v-select.error'
    );
    console.log('Validation error found:', firstError);
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  
  if (!mollie) {
     console.error('Mollie instance is missing');
     paymentStatus.value = {
        type: 'error',
        message: 'Payment system not initialized. Please refresh the page.',
     };
     return;
  }

  if (isProcessing.value) {
      console.log('Already processing');
      return;
  }

  isProcessing.value = true;
  paymentStatus.value = null;

  try {
     console.log('Creating Mollie token...');
     // Create token
    const { token, error } = await mollie.createToken();
    console.log('Token created:', token);
    
    if (error) {
      console.error('Token creation error:', error);
      paymentStatus.value = {
        type: 'error',
        message: error.message,
      };
      isProcessing.value = false;
      return;
    }

    paymentStatus.value = {
      type: 'info',
      message: t('tunnel.payment.card.preparing'),
    };

    await registerAndPrepareGuestAddress();

    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });
    
    // Use startPayement which handles the token
    console.log('Starting payment via helper...');
    const response = await mollieHelper.startPayement({
      token: token,
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
    });
    
    console.log('Payment response:', response);

    // Check if payment object exists
    const payment = response?.payment || response;
    const links = payment?._links;
    
    console.log('Redirecting check:', { 
        hasPayment: !!payment,
        hasLinks: !!links, 
        checkoutHref: links?.checkout?.href,
        status: payment?.status 
    });

    // Redirect to Mollie checkout if needed (mostly for 3DS)
    if (links?.checkout?.href) {
      console.log('Redirecting to 3DS/Checkout:', links.checkout.href);
      paymentStatus.value = {
        type: 'info',
        message: t('tunnel.payment.card.redirect_secure'),
      };
      window.location.href = links.checkout.href;
    } else if (response?.paymentUrl) {
       console.log('Redirecting to paymentUrl:', response.paymentUrl);
       paymentStatus.value = {
        type: 'info',
        message: t('tunnel.payment.card.redirect_secure'),
      };
       window.location.href = response.paymentUrl;
    } 
    else {
        // If status is paid/authorized directly w/o redirect (unlikely for 3DS but possible)
        if (payment?.status === 'paid' || payment?.status === 'authorized')  {
           console.log('Payment authorized without redirect. Finalizing...');
           // Handle success w/o redirect? Usually we still redirect to order confirmation
           const orderId = cart.value.IdCart;
           window.location.href = `${config.public.url}/order/accepted?orderid=${orderId}&init=1`;
        } else {
             console.error('No redirect URL found', payment);
             throw new Error(t('tunnel.payment.error.payment_url'));
        }
    }

  } catch (error: any) {
    isProcessing.value = false;
    console.error('Payment failed', error);
    paymentStatus.value = {
      type: 'error',
      message: error.data?.message || error.message || t('tunnel.payment.card.failed'),
    };
    emit('error', error.message || t('tunnel.payment.error.processing'));
  }
};


</script>

<style lang="scss">
.mollie-payment-form {
  .wrapper-mollie-components {
    background: #fff;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    
    .form-group {
      margin-bottom: 20px;
      
      &.half {
          width: 48%;
      }
    }
    
    .flex-row {
        display: flex;
        justify-content: space-between;
    }
    
    .label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      font-size: 14px;
      color: #374151;
    }
    
    .input-container {
      height: 44px;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      background-color: #f9fafb;
      transition: all 0.2s;
      
      // Mollie injects iframe here, we style the container
      &.is-focused {
          background-color: #fff;
          border-color: #000;
          box-shadow: 0 0 0 1px #000;
      }
    }
    
    .error-text {
        font-size: 12px;
        color: #e74c3c;
        margin-top: 4px;
        min-height: 18px;
    }
  }

  .status-message {
    font-size: 12px;
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    text-align: center;
    
    &.error {
      color: #e74c3c;
      background-color: #fadbd8;
    }
    
    &.success {
      color: #27ae60;
      background-color: #d5f4e6;
    }
    
    &.info {
      color: #3498db;
      background-color: #d6eaf8;
    }
  }
}
</style>
