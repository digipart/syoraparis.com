<script setup lang="ts">
import PayzenHelper from '~/helpers/payments/PayzenHelper';
import type { PaymentMethodType } from '~/types/PaymentType';

// Define KR type for TypeScript
declare global {
  interface Window {
    KR: any;
  }
}

const { t } = useI18n();
const { locale } = useI18n();
const localePath = useLocalePath();
const router = useRouter();
const config = useRuntimeConfig();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addresses } = toRefs(addressStore);
const formDeliveryFastStore = useFormDeliveryFastStore();
const formInvoiceFastStore = useFormInvoiceFastStore();

const checkoutStore = useCheckoutStore();
const { hasSameAddressForShipping } = storeToRefs(checkoutStore);
const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const props = defineProps<{
  disabled?: boolean;
  paymentMethod?: PaymentMethodType;
}>();

const formToken = ref('');
const loading = ref(false);
const error = ref('');
const paymentFormInitialized = ref(false);
const generalConditionsSale = ref(false);
const krInstance = ref<any>(undefined);
const payzenPayment = ref<PayzenHelper>();
const shouldValidateFastForms = computed(() => addresses.value.length === 0);

const scrollToValidationError = (params: {
  deliveryValid: boolean;
  invoiceValid: boolean;
}) => {
  const selectors = [
    !params.deliveryValid
      ? '#delivery-fast-form .text-red-500, #delivery-fast-form .address-selector.has-errors, #delivery-fast-form .inputText.error, #delivery-fast-form .v-select.error'
      : null,
    !params.invoiceValid
      ? '#invoice-fast-form .text-red-500, #invoice-fast-form .address-selector.has-errors, #invoice-fast-form .inputText.error, #invoice-fast-form .v-select.error'
      : null,
    '.formShipping .text-red-500, .formShipping .base-alert',
    '.inputText.error, .v-select.error',
  ].filter(Boolean) as string[];

  for (const selector of selectors) {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
  }
};

// Fonction pour envoyer les données de paiement
const postData = async () => {
  try {
    if (!addressDelivery?.value || !props.paymentMethod) {
      return false;
    }

    const response = await payzenPayment.value?.postData({
      clientSecret: formToken.value,
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressDelivery.value,
    });

    return !!response;
  } catch (error) {
    console.error('Error posting payment data:', error);
    return false;
  }
};

// Initialisation du formulaire Payzen
const initializePayzen = () => {
  try {
    if (typeof window === 'undefined' || !window.KR) {
      console.error('KR is not defined');
      error.value = t('Payment form failed to load');
      return;
    }

    krInstance.value = window.KR;

    const publicKey = config.public.payzenPublicKey;
    if (!publicKey) {
      console.error('Payzen public key is not configured');
      error.value = t('Payment method not properly configured');
      return;
    }

    // Configuration du formulaire de paiement
    krInstance.value.setFormConfig({
      formToken: formToken.value,
      language: locale.value || 'fr',
      'kr-public-key': publicKey,
      'kr-theme': 'neon',
      debugMode: process.env.NODE_ENV !== 'production',
      'kr-placeholder-pan': '4970 1000 0000 0000',
      'kr-placeholder-expiry': 'MM/YY',
      'kr-placeholder-security-code': '123',
      'kr-hide-debug-message': process.env.NODE_ENV === 'production',
    });

    // Ajout des écouteurs d'événements
    krInstance.value.onError((event: any) => {
      const code = event.errorCode;
      const message = event.errorMessage;
      console.error(`Payzen error: ${code} - ${message}`);
      error.value = t('Payment processing failed');
      loading.value = false;
    });

    krInstance.value.onSubmit(() => {
      loading.value = true;
    });

    krInstance.value.onTransactionCreated((paymentResponse: any) => {
      console.log(
        'Transaction created - Full response:',
        JSON.stringify(paymentResponse, null, 2)
      );

      if (!cart.value || !cart.value.IdCart) {
        error.value = t('Cart information is missing');
        loading.value = false;
        return;
      }

      const idOrder = cart.value.IdCart;

      // Extract status information from the Payzen response structure
      const clientAnswer = paymentResponse?.clientAnswer || {};
      const orderStatus = clientAnswer?.orderStatus;
      const transaction = clientAnswer?.transactions?.[0] || {};
      const transactionStatus = transaction?.status;
      const detailedStatus = transaction?.detailedStatus;

      console.log('Payment statuses:', {
        orderStatus,
        transactionStatus,
        detailedStatus,
      });

      // Check for success with Payzen-specific status values
      const isSuccess =
        orderStatus === 'PAID' ||
        transactionStatus === 'PAID' ||
        detailedStatus === 'AUTHORISED' ||
        detailedStatus === 'AUTHORIZED';

      if (isSuccess) {
        console.log('Payment successful, redirecting to success page');

        // Create a new cart after successful payment
        try {
          cartStore.newIdCart().catch((err) => {
            console.error('Failed to create new cart:', err);
          });
        } catch (error) {
          console.error('Failed to create new cart:', error);
        }

        router.replace(
          localePath({
            name: 'order-state',
            params: {
              state: 'accepted',
            },
            query: {
              orderid: idOrder,
              cartid: cart.value.IdCart,
            },
          })
        );
      } else {
        console.error('Payment failed with statuses:', {
          orderStatus,
          transactionStatus,
          detailedStatus,
        });

        // Extract error information if available
        const errorCode = transaction?.errorCode;
        const errorMessage =
          transaction?.errorMessage ||
          transaction?.detailedErrorMessage ||
          paymentResponse?.errorMessage;

        if (errorCode || errorMessage) {
          console.error('Error details:', errorCode, errorMessage);
          error.value =
            t('Payment failed') + (errorMessage ? ': ' + errorMessage : '');
        } else {
          error.value = t('Payment failed');
        }

        loading.value = false;
      }
    });

    // Attachement du formulaire au DOM
    const formElement = document.getElementById('payzen-payment-form');
    if (formElement) {
      krInstance.value.attachForm('#payzen-payment-form').then(() => {
        const button = document.querySelector('#payzen-payment-form .kr-payment-button');
        if (button) {
          button.addEventListener('click', async (event) => {
            event.preventDefault();
            event.stopPropagation();

            const isFormDeliveryFastValid = shouldValidateFastForms.value
              ? await formDeliveryFastStore.validateFields()
              : true;
            const isFormInvoiceFastValid =
              !shouldValidateFastForms.value || hasSameAddressForShipping.value
                ? true
                : await formInvoiceFastStore.validateFields();
            const allValid = await checkoutStore.validateCheckoutBeforePayment();
            if (!allValid || !isFormDeliveryFastValid || !isFormInvoiceFastValid) {
              await nextTick();
              scrollToValidationError({
                deliveryValid: isFormDeliveryFastValid,
                invoiceValid: isFormInvoiceFastValid,
              });
              error.value =
                checkoutStore.checkoutErrors?.[0]?.message ||
                t('tunnel.payment.error.check_form') ||
                'Please check your information.';
              return;
            }

            await registerAndPrepareGuestAddress();

            // If validation passes, manually trigger the form submission if the library allows
            // This part is tricky as we are hijacking the button's default behavior.
            // We might need to call a method from the KR instance to proceed.
            // For now, let's assume we can find the form and submit it, or call a KR function.
            const realSubmitButton = document.querySelector('#payzen-payment-form .kr-payment-button') as HTMLButtonElement;
            if(realSubmitButton) {
              realSubmitButton.click();
            }
          });
        }
      });

      paymentFormInitialized.value = true;
    } else {
      error.value = t('Payment form container not found');
    }
  } catch (err) {
    console.error('Error initializing Payzen form:', err);
    error.value = t('Payment form initialization failed');
  }
};

const addFixPositionStyle = () => {
  // Créer une feuille de style pour neutraliser le style problématique
  const style = document.createElement('style');
  style.textContent = `
        .kr-embedded.kr-out-of-view-form, 
        .kr-embedded.kr-out-of-view-form[krvue], 
        .kr-embedded.kr-out-of-view-form[krvue][kr-popin], 
        .kr-smart-form.kr-out-of-view-form, 
        .kr-smart-form.kr-out-of-view-form[krvue], 
        .kr-smart-form.kr-out-of-view-form[krvue][kr-popin] {
          position: static !important;
          top: auto !important;
          left: auto !important;
          right: auto !important;
          bottom: auto !important;
        }
      `;
  document.head.appendChild(style);
};

// Chargement du script KR
const loadKRScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.KR) {
      initializePayzen();
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src =
      'https://static.payzen.eu/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js';
    script.async = true;

    script.onload = () => {
      const style = document.createElement('link');
      style.rel = 'stylesheet';
      style.href =
        'https://static.payzen.eu/static/js/krypton-client/V4.0/ext/neon-reset.min.css';
      document.head.appendChild(style);

      // Délai pour s'assurer que le script est complètement chargé
      setTimeout(() => {
        initializePayzen();
        resolve(true);
      }, 300);
    };

    script.onerror = () => {
      error.value = t('Failed to load payment form');
      reject(new Error('Failed to load KR script'));
    };

    document.head.appendChild(script);
  });
};

// Initialisation du paiement
const initialize = async () => {
  loading.value = true;
  error.value = '';

  try {
    if (!cart.value) {
      error.value = t('Cart information is missing');
      return;
    }

    // Obtention du jeton de formulaire depuis le backend
    const data = await payzenPayment.value?.getFormToken(cart.value);

    if (data) {
      formToken.value = data;

      if (formToken.value) {
        await loadKRScript();
        addFixPositionStyle();
      } else {
        error.value = t('Unable to initialize payment form');
      }
    } else {
      error.value = t('Failed to get payment token');
    }
  } catch (err) {
    console.error('Payzen initialization error:', err);
    error.value = t('Payment initialization failed');
  } finally {
    loading.value = false;
  }
};

// Réinitialiser le formulaire si le jeton change
watch(formToken, (newValue) => {
  if (newValue && paymentFormInitialized.value && krInstance.value) {
    krInstance.value.setFormConfig({ formToken: newValue });
  }
});

// Exposer des méthodes si nécessaire
defineExpose({
  postData,
  initialize,
});

// Au montage du composant
onMounted(async () => {
  if (!cart.value) {
    error.value = t('Cart information is missing');
    return;
  }

  payzenPayment.value = new PayzenHelper({
    cart: cart.value,
    customer: customer.value,
  });

  initialize();
});

// Nettoyage lors du démontage
onBeforeUnmount(() => {
  if (krInstance.value) {
    try {
      // Tentative de détachement du formulaire pour éviter les fuites mémoire
      krInstance.value = null;
    } catch (e) {
      console.error('Error cleaning up Payzen form:', e);
    }
  }
});
</script>

<template>
  <div
    class="payzen-form relative"
    :class="{ 'opacity-50 pointer-events-none': props.disabled }"
    v-loading="loading"
  >
    <div
      v-if="error"
      class="text-red-500 mb-4 p-2 bg-red-50 rounded border border-red-200"
    >
      {{ error }}
    </div>

    <div id="payzen-payment-form" class="mb-5">
      <!-- Le formulaire Payzen sera injecté ici -->
      <div
        v-if="!paymentFormInitialized && !error"
        class="text-gray-500 text-sm"
      >
        {{ t('Loading payment form...') }}
      </div>
    </div>

    <div class="mb-5 flex items-start gap-2">
      <label for="generalConditions" class="text-xs">
        {{ t('tunnel.payment.cgv', { shopname: shopName }) }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.payzen-form {
  @apply w-full max-w-lg;

  :deep() {
    #payzenForm {
      @apply w-full;
    }

    .kr-form-container,
    .kr-card-form {
      @apply w-full;
    }

    // .kr-pan, .kr-expiry, .kr-security-code {
    //   @apply w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-white;
    //   @apply focus:ring-2 focus:ring-black/5 focus:border-black/80;
    //   @apply transition-all duration-200;
    // }

    .kr-payment-button {
      @apply w-full mt-4 bg-black text-white font-medium px-6 py-3 rounded-none;
      @apply hover:bg-black/90 active:bg-black/95;
      @apply transition-all duration-200;
      @apply disabled:opacity-50 disabled:cursor-not-allowed;
    }

    /* Style pour le bloc d'erreur */
    .kr-form-error,
    .kr-form-error-visible {
      @apply mt-2 p-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded;
    }

    // @keyframes fadeIn {
    //   from { opacity: 0; transform: translateY(-10px); }
    //   to { opacity: 1; transform: translateY(0); }
    // }

    // .animate-fadeIn {
    //   animation: fadeIn 0.3s ease-in-out;
    // }
  }
}
</style>
