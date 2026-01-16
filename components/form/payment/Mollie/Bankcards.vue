<template>
  <div class="mollie-payment-form">
    <div class="wrapper-mollie-components grid grid-cols-12 gap-5">
      <div class="form-group col-span-12">
        <label class="label">{{ $t('tunnel.payment.card.holder') }}</label>
        <div :id="`card-holder-${uid}`" class="input-container"></div>
        <div
          :id="`card-holder-error-${uid}`"
          class="error-text"
          role="alert"
        ></div>
      </div>

      <div class="form-group col-span-12">
        <label class="label">{{ $t('tunnel.payment.card.number') }}</label>
        <div :id="`card-number-${uid}`" class="input-container"></div>
        <div
          :id="`card-number-error-${uid}`"
          class="error-text"
          role="alert"
        ></div>
      </div>

      <div class="form-group col-span-12 md:col-span-6">
        <label class="label">{{ $t('tunnel.payment.card.expiry') }}</label>
        <div :id="`expiry-date-${uid}`" class="input-container"></div>
        <div
          :id="`expiry-date-error-${uid}`"
          class="error-text"
          role="alert"
        ></div>
      </div>

      <div class="form-group col-span-12 md:col-span-6">
        <label class="label">{{ $t('tunnel.payment.card.cvc') }}</label>
        <div :id="`verification-code-${uid}`" class="input-container"></div>
        <div
          :id="`verification-code-error-${uid}`"
          class="error-text"
          role="alert"
        ></div>
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
        {{
          isProcessing
            ? $t('tunnel.payment.card.redirecting')
            : $t('tunnel.payment.card.button')
        }}
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
const { customerSaveAddress } = auth;
const { registerAndPrepareGuestAddress } = useCheckoutGuest();
const checkoutStore = useCheckoutStore();
const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);
const isProcessing = ref(false);
const paymentStatus = ref<{ type: string; message: string } | null>(null);
// Mollie references
// We use a global variable on window to ensure singleton across component re-mounts
const getMollieInstance = () => mollie.value; // Use composable value
let cardHolder: any = null;
let cardNumber: any = null;
let expiryDate: any = null;
let verificationCode: any = null;
const isMollieInitialized = ref(false);
const uid = Math.random().toString(36).substring(7);
const { mollie, loadMollie } = useMollie();
const cleanUpMollieComponents = () => {
  try {
    if (cardHolder) {
      cardHolder.unmount();
      cardHolder = null;
    }
    if (cardNumber) {
      cardNumber.unmount();
      cardNumber = null;
    }
    if (expiryDate) {
      expiryDate.unmount();
      expiryDate = null;
    }
    if (verificationCode) {
      verificationCode.unmount();
      verificationCode = null;
    }
    isMollieInitialized.value = false;
    console.log('Mollie components cleaned up');
  } catch (e) {
    console.warn('Error during Mollie cleanup', e);
  }
};
const mountMollieComponents = async () => {
  // Always clean up potential previous instances first
  cleanUpMollieComponents();

  await nextTick();
  const mollieInst = mollie.value;
  if (!mollieInst) {
    console.error('Mollie instance not loaded when trying to mount components');
    return;
  }
  try {
    const options = {
      styles: {
        base: {
          fontSize: '14px',
          color: '#333333',
          '::placeholder': {
            color: '#888888',
          },
        },
        valid: {
          color: 'black',
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
      console.warn(
        'Mollie mount points not found in DOM, retrying in 100ms...'
      );
      setTimeout(mountMollieComponents, 100);
      return;
    }
    cardHolder = mollieInst.createComponent('cardHolder', options);
    cardHolder.mount('#' + cardHolderId);
    cardNumber = mollieInst.createComponent('cardNumber', options);
    cardNumber.mount('#' + cardNumberId);
    expiryDate = mollieInst.createComponent('expiryDate', options);
    expiryDate.mount('#' + expiryDateId);
    verificationCode = mollieInst.createComponent('verificationCode', options);
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
    console.error('Error initializing Mollie components:', e);
  }
};
onMounted(async () => {
  try {
    const profileId = config.public.mollieProfileId;
    const isTestMode =
      config.public.mollieTestMode === 'true' ||
      config.public.mollieTestMode === true ||
      config.public.mollieTestMode === 'enabled';

    console.log('Loading Mollie via singleton...');
    await loadMollie(profileId, isTestMode);
    console.log('Mollie loaded, mounting components...');
    mountMollieComponents();
  } catch (e) {
    console.error('Failed to load Mollie', e);
  }
});
onUnmounted(() => {
  cleanUpMollieComponents();
});
const handleSubmit = async () => {
  console.log('handleSubmit called - starting payment flow');

  try {
    const allValid = await checkoutStore.validateCheckoutBeforePayment();
    console.log('Validation result (validateCheckoutBeforePayment):', allValid);
    console.log('Checkout errors:', checkoutStore.checkoutErrors);
    if (!allValid) {
      console.warn('Validation failed. Searching for error elements...');
      await nextTick(); // Wait for DOM updates
      const firstError = document.querySelector(
        '.formShipping .text-red-500, .inputText.error, .v-select.error'
      );
      console.log('Validation error DOM element found:', firstError);

      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        // Fallback if no visual error is found but validation failed
        console.error('Validation failed but no error element found in DOM.');
        alert(
          t('tunnel.payment.error.check_form') ||
            'Please check your information.'
        );
      }
      return;
    }

    const mollie = getMollieInstance();
    // Check initialization status first
    if (!isMollieInitialized.value || !mollie) {
      console.error('Mollie instance not fully initialized', {
        initialized: isMollieInitialized.value,
        hasInstance: !!mollie,
      });
      paymentStatus.value = {
        type: 'error',
        message:
          t('tunnel.payment.error.init') ||
          'Payment system not ready. Please refresh.',
      };
      return;
    }
    if (isProcessing.value) {
      console.log('Already processing payment, ignoring click.');
      return;
    }
    isProcessing.value = true;
    paymentStatus.value = null;
    console.log('Creating Mollie token from components...');
    // Create token with timeout to prevent hanging
    const createTokenPromise = mollie.createToken();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error('Mollie createToken timed out after 10s')),
        10000
      )
    );
    let tokenResult;
    try {
      tokenResult = await Promise.race([createTokenPromise, timeoutPromise]);
    } catch (err: any) {
      console.error('Token creation race error:', err);
      paymentStatus.value = {
        type: 'error',
        message:
          t('tunnel.payment.error.timeout') ||
          'Payment system did not respond in time. Please try again.',
      };
      isProcessing.value = false;
      return;
    }
    const { token, error } = tokenResult;
    console.log('Mollie createToken result:', { token, error });

    if (error) {
      console.error('Token creation error:', error);
      paymentStatus.value = {
        type: 'error',
        message: error.message,
      };
      isProcessing.value = false;
      return;
    }
    if (!token) {
      console.error(
        'No token received from Mollie but no error object returned.'
      );
      paymentStatus.value = {
        type: 'error',
        message: 'Payment authorization failed.',
      };
      isProcessing.value = false;
      return;
    }
    paymentStatus.value = {
      type: 'info',
      message: t('tunnel.payment.card.preparing'),
    };
    console.log('Registering/Preparing guest address...');

    await customerSaveAddress();
    await registerAndPrepareGuestAddress();

    console.log('Guest address prepared.');
    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });

    // Use startPayement which handles the token
    console.log('Starting payment via helper (API call)...');
    const response = await mollieHelper.startPayement({
      token: token,
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
    });

    console.log('Payment API response:', response);
    // Check if payment object exists
    const payment = response?.payment || response;
    const links = payment?._links;

    // console.log('Redirecting logic check:', {
    //   hasPayment: !!payment,
    //   hasLinks: !!links,
    //   checkoutHref: links?.checkout?.href,
    //   status: payment?.status,
    // });
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
    } else {
      // If status is paid/authorized directly w/o redirect (unlikely for 3DS but possible)
      if (payment?.status === 'paid' || payment?.status === 'authorized') {
        console.log('Payment authorized without redirect. Finalizing...');
        // Handle success w/o redirect? Usually we still redirect to order confirmation
        const orderId = cart.value.IdCart;
        window.location.href = `${config.public.url}/order/accepted?orderid=${orderId}&init=1`;
      } else {
        console.error('No redirect URL found in response', payment);
        throw new Error(
          t('tunnel.payment.error.payment_url') ||
            'No redirection URL provided by payment gateway.'
        );
      }
    }
  } catch (error: any) {
    isProcessing.value = false;
    console.error('Payment failed (exception caught):', error);
    paymentStatus.value = {
      type: 'error',
      message:
        error.data?.message || error.message || t('tunnel.payment.card.failed'),
    };
    emit('error', error.message || t('tunnel.payment.error.processing'));
  }
};
</script>

<style lang="scss">
.mollie-payment-form {
  .wrapper-mollie-components {
    background: #fff;

    .form-group {
      @apply relative;
    }

    .label {
      display: block;
      font-weight: 400;
      font-size: 12px;
      color: #374151;
    }

    .input-container {
      height: 44px;
      padding: 10px 12px;
      border: 1px solid #d1d5db;
      transition: all 0.2s;

      // Mollie injects iframe here, we style the container
      &.is-focused {
        background-color: #fff;
        border-color: #000;
        box-shadow: 0 0 0 1px #000;
      }
    }

    .error-text {
      font-size: 10px;
      color: #e74c3c;
      margin-top: 0px;
      min-height: 18px;
      position: absolute;
      bottom: 0;
      @apply translate-y-full;
    }
  }

  .status-message {
    font-size: 12px;
    margin-top: 12px;
    padding: 8px 12px;
    text-align: center;

    color: #000000;
    background-color: #fcfcfc;
    border: 1px solid #d1d5db;

    &.error {
      color: #e74c3c;
      background-color: #fadbd8;
      border-color: #ef5350;
    }
  }
}
</style>
