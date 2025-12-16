<template>
  <div class="apple-pay-form">
    <div class="apple-pay-container">
      <!-- Apple Pay Button -->
      <div v-if="isApplePayAvailable" class="button-container">
        <BaseButton
          @click="handleApplePay"
          :disabled="isProcessing"
          type="primary"
          class="w-full"
          plain
        >
          <span v-if="!isProcessing" class="button-content">
            <IconApplepay :size="4" />
            <span class="button-text">Pay with Apple Pay</span>
          </span>
          <span v-else>Processing...</span>
        </BaseButton>
      </div>

      <!-- Not Available Message -->
      <BaseAlert v-else type="warning" fill>
        <template #icon>
          <IconInfo :size="2.4" />
        </template>
        <div class="text-sm">
          <p>Apple Pay is not available on this device or browser.</p>
        </div>
      </BaseAlert>
    </div>

    <div
      v-if="paymentStatus"
      class="status-message"
      :class="paymentStatus.type"
    >
      {{ paymentStatus.message }}
    </div>

    <div v-if="isApplePayAvailable" class="payment-security">
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
      <span>Secure payment with Touch ID or Face ID</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import MollieHelper from '~/helpers/payments/MollieHelper';
import type { PaymentMethodType } from '~/types/PaymentType';
import { useCheckoutGuest } from '~/composables/useCheckoutGuest';

const props = defineProps<{
  amount?: number;
  currency?: string;
  paymentMethod?: PaymentMethodType;
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

const checkoutStore = useCheckoutStore();
const {
  isCheckoutValid,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
  checkoutCarrier,
} = toRefs(checkoutStore);

const isProcessing = ref(false);
const isApplePayAvailable = ref(false);
const paymentStatus = ref<{ type: string; message: string } | null>(null);

onMounted(() => {
  checkApplePayAvailability();
});

const checkApplePayAvailability = () => {
  // Check for Apple Pay availability
  if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
    isApplePayAvailable.value = true;
  }
};

const formatAmount = (amount?: number) => {
  if (!amount) return '0.00';
  return (amount / 100).toFixed(2);
};

const handleApplePay = async () => {
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
    message: 'Redirecting to ApplePay...',
  };

  try {
    if (!props.paymentMethod) {
      emit('error', 'Payment method is not defined.');
      isProcessing.value = false;
      return;
    }
    const paymentMethod = props.paymentMethod;

    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: {},
    });

    const { paymentUrl } = await mollieHelper.startPayementMethod({
      paymentName: 'applepay',
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
    });

    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      emit('error', 'Failed to get payment URL.');
    }
  } catch (error: any) {
    paymentStatus.value = {
      type: 'error',
      message: error.data?.message || 'Payment failed. Please try again.',
    };
  } finally {
    isProcessing.value = false;
  }
};
</script>

<style lang="scss" scoped>
.apple-pay-form {
  max-width: 500px;
  margin: 0 auto;
}

.payment-info {
  background: #f7f7f7;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
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

.apple-pay-container {
  margin: 24px 0;
}

.button-container {
  width: 100%;
}

.apple-pay-button {
  width: 100%;
  padding: 14px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  color: #fff;

  &:hover:not(:disabled) {
    background: #222;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
  }

  .button-text {
    font-size: 15px;
  }
}

.not-available-message {
  text-align: center;
  padding: 32px 24px;
  background: #fff9e6;
  border: 1px solid #ffe0a3;
  border-radius: 8px;
  color: #856404;

  svg {
    margin: 0 auto 16px;
    color: #ffc107;
  }

  p {
    margin: 0 0 8px 0;
    font-size: 14px;

    &.suggestion {
      font-size: 13px;
      color: #997404;
    }
  }
}

.status-message {
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  margin-top: 16px;
  text-align: center;

  &.info {
    background: #e3f2fd;
    color: #1976d2;
    border: 1px solid #90caf9;
  }

  &.success {
    background: #e8f5e9;
    color: #388e3c;
    border: 1px solid #81c784;
  }

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
  margin-top: 20px;

  svg {
    color: #4caf50;
  }
}
</style>
