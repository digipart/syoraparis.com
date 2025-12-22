<template>
  <div class="paypal-payment-form">
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
import MollieHelper from '~/helpers/payments/MollieHelper';
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
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const formDeliveryStore = useFormDeliveryStore();
const { v$: v$FormDelivery } = toRefs(formDeliveryStore);

const formInvoiceStore = useFormInvoiceStore();
const { v$: v$AddressInvoice } = toRefs(formInvoiceStore);

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

const formatAmount = (amount?: number) => {
  if (!amount) return '0.00';
  return (amount / 100).toFixed(2);
};
const { mollie, loadMollie } = useMollie();

onMounted(async () => {
  const profileId = config.public.mollieProfileId as string;
  const testMode = config.public.mollieTestMode === 'enabled';
  await loadMollie(profileId, testMode);
  console.log('mollie', mollie.value);
});

const handlePayPalPayment = async () => {
  const allValid = await checkoutStore.validateCheckoutBeforePayment();

  if (!allValid) {
    const firstError = document.querySelector(
      '.formShipping .text-red-500, .inputText.error, .v-select.error'
    );
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  if (isProcessing.value) return;

  isProcessing.value = true;

  await registerAndPrepareGuestAddress();
  paymentStatus.value = {
    type: 'info',
    message: t('tunnel.payment.paypal.redirecting'),
  };

  try {
    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });

    // Start PayPal payment without token (PayPal uses redirect flow)

    const { paymentUrl } = await mollieHelper.startPayementMethod({
      paymentName: 'paypal',
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
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
