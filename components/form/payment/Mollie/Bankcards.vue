<template>
  <div class="mollie-payment-form">
    <!-- <pre class="text-xs">
      {{ state }} <br>
     {{ isCheckoutValid }} {{ checkoutCustomer }}, {{ checkoutCarrier }}
    </pre> -->
    <form @submit.prevent="handleSubmit">
      <div class="grid grid-cols-2 gap-3">
        <div class="col-span-2 relative">
          <label for="cardholder">Cardholder Name</label>
          <div id="card-holder" ref="cardholderEl"></div>
          <span v-if="errors.cardholder" class="error">{{
            errors.cardholder
          }}</span>
        </div>

        <div class="col-span-2 relative">
          <label for="cardNumber">Card Number</label>
          <div id="card-number" ref="cardNumberEl"></div>
          <span v-if="errors.cardNumber" class="error">{{
            errors.cardNumber
          }}</span>
        </div>

        <div class="col-span-1 relative">
          <label for="expiryDate">Expiry Date</label>
          <div id="expiry-date" ref="expiryDateEl"></div>
          <span v-if="errors.expiryDate" class="error">{{
            errors.expiryDate
          }}</span>
        </div>

        <div class="col-span-1 relative">
          <label for="verificationCode">CVC</label>
          <div id="verification-code" ref="verificationCodeEl"></div>
          <span v-if="errors.verificationCode" class="error">{{
            errors.verificationCode
          }}</span>
        </div>
        <div class="col-span-2 mt-3">
          <BaseButton
            submit
            :disabled="isProcessing || !isFormValid"
            class="w-full"
            type="primary"
          >
            {{ isProcessing ? 'Processing...' : 'Pay Now' }}
          </BaseButton>
        </div>
      </div>
    </form>
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
import type { AddressType } from '~/types/AddressType';
import type { PaymentMethodType } from '~/types/PaymentType';

const emit = defineEmits<{
  tokenCreated: [token: string];
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

const formDeliveryStore = useFormDeliveryStore();
const { v$: v$FormDelivery } = toRefs(formDeliveryStore);

const formInvoiceStore = useFormInvoiceStore();
const { state, v$: v$AddressInvoice } = toRefs(formInvoiceStore);

const { t } = useI18n();

const checkoutStore = useCheckoutStore();
const {
  isCheckoutValid,
  checkoutCustomer,
  checkoutCarrier,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
} = toRefs(checkoutStore);

const { mollie, loadMollie } = useMollie();
const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const cardholderEl = ref<HTMLElement>();
const cardNumberEl = ref<HTMLElement>();
const expiryDateEl = ref<HTMLElement>();
const verificationCodeEl = ref<HTMLElement>();

const isProcessing = ref(false);
const isFormValid = ref(false);
const errors = reactive({
  cardholder: '',
  cardNumber: '',
  expiryDate: '',
  verificationCode: '',
});

let cardholder: any;
let cardNumber: any;
let expiryDate: any;
let verificationCode: any;

onMounted(async () => {
  try {
    const profileId = config.public.mollieProfileId as string;
    const testMode = config.public.mollieTestMode === 'enabled';

    if (!profileId) {
      throw new Error('Mollie profile ID is not configured');
    }

    await loadMollie(profileId, testMode);

    if (!mollie.value) return;

    const componentOptions = {
      styles: {
        base: {
          backgroundColor: 'white',
          fontSize: '14px',
          padding: '12px',
          border: '1px solid #ddd',
          outline: 'none',
          height: '44px',
          '::placeholder': {
            color: '#999',
          },
        },
        valid: {
          border: '1px solid #ddd',
        },
        invalid: {
          border: '1px solid #e74c3c',
        },
      },
    };

    // Create cardholder component
    cardholder = mollie.value.createComponent('cardHolder', componentOptions);
    cardholder.mount(cardholderEl.value);

    // Create card number component
    cardNumber = mollie.value.createComponent('cardNumber', componentOptions);
    cardNumber.mount(cardNumberEl.value);

    // Create expiry date component
    expiryDate = mollie.value.createComponent('expiryDate', componentOptions);
    expiryDate.mount(expiryDateEl.value);

    // Create verification code component
    verificationCode = mollie.value.createComponent(
      'verificationCode',
      componentOptions
    );
    verificationCode.mount(verificationCodeEl.value);

    // Add event listeners
    cardholder.addEventListener('change', (event: any) => {
      errors.cardholder = event.error ? event.error : '';
      checkFormValidity();
    });

    cardNumber.addEventListener('change', (event: any) => {
      errors.cardNumber = event.error ? event.error : '';
      checkFormValidity();
    });

    expiryDate.addEventListener('change', (event: any) => {
      errors.expiryDate = event.error ? event.error : '';
      checkFormValidity();
    });

    verificationCode.addEventListener('change', (event: any) => {
      errors.verificationCode = event.error ? event.error : '';
      checkFormValidity();
    });
  } catch (error) {
    console.error('Failed to initialize Mollie:', error);
    emit('error', 'Failed to load payment form');
  }
});

const checkFormValidity = () => {
  isFormValid.value =
    !errors.cardholder &&
    !errors.cardNumber &&
    !errors.expiryDate &&
    !errors.verificationCode;
};
const config = useRuntimeConfig();
const router = useRouter();
const paymentStatus = ref<{ type: string; message: string } | null>(null);
const handleTokenCreated = async (token: string) => {
  try {
    paymentStatus.value = {
      type: 'info',
      message: 'Processing payment...',
    };

    await registerAndPrepareGuestAddress();

    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });
    const response = await mollieHelper.startPayement({
      token,
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
    });

    if (response.success) {
      if (response) {
        window.location.href = response?.payment?.redirectUrl;
      }
    }
  } catch (error: any) {
    paymentStatus.value = {
      type: 'error',
      message: error.data?.message || 'Payment failed. Please try again.',
    };
  }
};

const handleError = (error: string) => {
  paymentStatus.value = {
    type: 'error',
    message: error,
  };
};

const handleSubmit = async () => {
  const allValid = await checkoutStore.validateCheckoutBeforePayment();

  if (!allValid) {
    const firstError = document.querySelector(
      '.formShipping .text-red-500, .inputText.error, .v-select.error'
    );
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  if (!mollie.value || isProcessing.value || !isFormValid.value) return;

  isProcessing.value = true;

  try {
    const { token, error } = await mollie.value.createToken();

    if (error) {
      emit('error', error.message);
      isProcessing.value = false;
      return;
    }
    handleTokenCreated(token);
    emit('tokenCreated', token);
  } catch (error: any) {
    emit('error', error.message || 'Payment processing failed');
  } finally {
    isProcessing.value = false;
  }
};

// onUnmounted(() => {
//   if (cardholder) cardholder.unmount();
//   if (cardNumber) cardNumber.unmount();
//   if (expiryDate) expiryDate.unmount();
//   if (verificationCode) verificationCode.unmount();
// });
</script>

<style lang="scss">
.mollie-payment-form {
  .form-group {
    margin-bottom: 20px;
  }

  label {
    margin-bottom: 8px;
    color: #333;
    font-size: 12px;
    @apply font-normal;
  }
  .mollie-component {
    @apply border  border-gray-888 pr-3 bg-white;
    &.has-focus {
      @apply border-black;
    }
  }

  .error {
    color: #e74c3c;
    font-size: 10px;
    margin-top: 0px;
    display: block;
    @apply absolute bottom-0 translate-y-full  font-normal;
  }

  .status-message {
    color: #e74c3c;
    font-size: 12px;
    margin-top: 6px;
  }
}
</style>
