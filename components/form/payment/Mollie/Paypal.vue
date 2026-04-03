<template>
  <div class="paypal-payment-form">
    <div class="mb-5 mt-5">
      <InputCheckBox
        :id="`mollie-paypal-cgv-${uid}`"
        v-model="generalConditionsSale"
        :required="true"
      >
        <span
          class="text-xs ml-1 inline-block -translate-y-0.5"
          v-html="
            t('tunnel.payment.cgv', {
              shopname: shopName,
              link_cgv: localePath({
                name: 'terms-and-conditions',
              }),
            })
          "
        >
        </span>
      </InputCheckBox>
      <p v-if="generalConditionsError" class="mt-1 text-xs text-red-500">
        {{ generalConditionsError }}
      </p>
    </div>

    <div class="paypal-button-container">
      <BaseButton
        @click="handlePayPalPayment"
        :disabled="isProcessing"
        class="w-full paypal-button"
        type="primary"
      >
        <span
          v-if="!isProcessing || !isCheckoutValid"
          class="flex items-center justify-center gap-2"
        >
          {{ $t('tunnel.payment.paypal.button') }}
          <IconPaypal :size="2" />
        </span>
        <span v-else>{{ $t('tunnel.payment.paypal.processing') }}</span>
      </BaseButton>
    </div>

    <div
      v-if="paymentStatus"
      class="status-message"
      :class="paymentStatus.type"
    >
      {{ paymentStatus.message }}
    </div>

    <div class="payment-security">
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0110 0v4" />
      </svg>
      <span>{{ $t('tunnel.payment.paypal.secure') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import MollieHelper from '~/helpers/payments/MollieHelper';
import InputCheckBox from '~/components/input/CheckBox.vue';
import type { PaymentMethodType } from '~/types/PaymentType';
import { useCheckoutGuest } from '~/composables/useCheckoutGuest';

const props = defineProps<{
  paymentMethod: PaymentMethodType;
}>();

const emit = defineEmits<{
  paymentStarted: [data: any];
  error: [error: string];
}>();

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);

const formDeliveryFastStore = useFormDeliveryFastStore();
const formInvoiceFastStore = useFormInvoiceFastStore();

const localePath = useLocalePath();
const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const { t } = useI18n();

const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const auth = useAuth();
const { customer } = toRefs(auth);

const checkoutStore = useCheckoutStore();
const {
  isCheckoutValid,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
  checkoutCarrier,
} = toRefs(checkoutStore);

const config = useRuntimeConfig();
const router = useRouter();

const isProcessing = ref(false);
const paymentStatus = ref<{ type: string; message: string } | null>(null);
const generalConditionsSale = ref(false);
const generalConditionsError = ref<string | null>(null);
const uid = Math.random().toString(36).substring(7);
const shouldValidateFastForms = computed(() => addresses.value.length === 0);

const formatAmount = (amount?: number) => {
  if (!amount) return '0.00';
  return (amount / 100).toFixed(2);
};

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
const { mollie, loadMollie } = useMollie();

watch(generalConditionsSale, (value) => {
  if (value) {
    generalConditionsError.value = null;
  }
});

onMounted(async () => {
  const profileId = config.public.mollieProfileId as string;
  const testMode = config.public.mollieTestMode === 'enabled';
  await loadMollie(profileId, testMode);
  console.log('mollie', mollie.value);
});

const handlePayPalPayment = async () => {
  if (!generalConditionsSale.value) {
    generalConditionsError.value =
      t('tunnel.payment.error.cgv_required') ||
      'Please accept the terms and conditions to continue.';
    return;
  }

  generalConditionsError.value = null;

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

    const hasErrorInDom = !!document.querySelector(
      '#delivery-fast-form .text-red-500, #invoice-fast-form .text-red-500, .formShipping .text-red-500, .formShipping .base-alert, .inputText.error, .v-select.error'
    );

    if (!hasErrorInDom) {
      paymentStatus.value = {
        type: 'error',
        message:
          checkoutStore.checkoutErrors?.[0]?.message ||
          t('tunnel.payment.error.check_form') ||
          'Please check your information.',
      };
    }
    return;
  }

  if (isProcessing.value) return;

  isProcessing.value = true;

  try {
    paymentStatus.value = {
      type: 'info',
      message: t('tunnel.payment.paypal.redirecting'),
    };

    await registerAndPrepareGuestAddress();

    const deliveryAddress = addressDelivery.value;
    const invoiceAddress = addressInvoice.value || deliveryAddress;

    if (!deliveryAddress || !invoiceAddress) {
      paymentStatus.value = {
        type: 'error',
        message: t('tunnel.payment.error.payment_method'),
      };
      isProcessing.value = false;
      return;
    }

    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });

    // Start PayPal payment without token (PayPal uses redirect flow)

    const { paymentUrl } = await mollieHelper.startPayementMethod({
      paymentName: 'paypal',
      paymentMethod: props.paymentMethod,
      addressDelivery: deliveryAddress,
      addressInvoice: invoiceAddress,
    });

    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      throw new Error('Failed to initiate PayPal payment');
    }
  } catch (error: any) {
    console.error('PayPal payment error:', error);

    paymentStatus.value = {
      type: 'error',
      message:
        error.data?.message || error.message || t('tunnel.payment.card.failed'),
    };

    emit(
      'error',
      error.data?.message ||
        error.message ||
        t('tunnel.payment.error.processing')
    );
    isProcessing.value = false;
  }
};
</script>

<style lang="scss" scoped>
.paypal-payment-form {
  max-width: 500px;
  margin: 0 auto;
}

.payment-info {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.amount-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;

  .label {
    color: #666;
    font-weight: 500;
  }

  .amount {
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }
}

.paypal-button-container {
  margin: 24px 0;
}

.paypal-button {
  background: #0070ba !important;
  border: none;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  transition: background 0.3s ease;

  &:hover:not(:disabled) {
    background: #005ea6 !important;
  }

  &:disabled {
    background: #99c9e8 !important;
    cursor: not-allowed;
  }

  svg {
    color: white;
  }
}

.status-message {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;
  color: #000000;
  background-color: #fcfcfc;
  border: 1px solid #d1d5db;

  &.error {
    background: #ffebee;
    color: #d32f2f;
    border: 1px solid #ef5350;
  }
}

.payment-security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #666;
  font-size: 13px;
  margin-top: 16px;

  svg {
    color: #4caf50;
  }
}
</style>
