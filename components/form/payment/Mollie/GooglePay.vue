<template>
  <div class="google-pay-form">
    <div class="mb-5 mt-5">
      <InputCheckBox
        :id="`mollie-googlepay-cgv-${uid}`"
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

    <div class="google-pay-container">
      <!-- Google Pay Button -->
      <div v-if="isGooglePayAvailable" class="button-container">
        <BaseButton
          @click="handleGooglePay"
          :disabled="isProcessing"
          type="primary"
          class="w-full"
          plain
        >
          <span v-if="!isProcessing" class="button-content">
            <IconGooglepay :size="4" />
          </span>
          <span v-else>{{ $t('tunnel.payment.googlepay.processing') }}</span>
        </BaseButton>
      </div>

      <!-- Not Available Message -->
      <BaseAlert v-else type="warning" fill>
        <template #icon>
          <IconInfo :size="2.4" />
        </template>
        <div class="text-sm">
          <p>{{ $t('tunnel.payment.googlepay.not_available') }}</p>
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

    <div v-if="isGooglePayAvailable" class="payment-security">
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
      <span>{{ $t('tunnel.payment.googlepay.secure') }}</span>
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
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);

const formDeliveryFastStore = useFormDeliveryFastStore();
const formInvoiceFastStore = useFormInvoiceFastStore();

const localePath = useLocalePath();
const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const auth = useAuth();
const { customer } = toRefs(auth);
const { t } = useI18n();

const checkoutStore = useCheckoutStore();
const {
  isCheckoutValid,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
  checkoutCarrier,
} = toRefs(checkoutStore);

const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const config = useRuntimeConfig();

const isProcessing = ref(false);
const isGooglePayAvailable = ref(false);
const paymentStatus = ref<{ type: string; message: string } | null>(null);
const generalConditionsSale = ref(false);
const generalConditionsError = ref<string | null>(null);
const uid = Math.random().toString(36).substring(7);
const shouldValidateFastForms = computed(() => addresses.value.length === 0);

watch(generalConditionsSale, (value) => {
  if (value) {
    generalConditionsError.value = null;
  }
});

onMounted(() => {
  checkGooglePayAvailability();
});

const checkGooglePayAvailability = () => {
  // Check for Google Pay availability using Payment Request API
  if (window.PaymentRequest) {
    try {
      const supportedInstruments = [
        {
          supportedMethods: 'https://google.com/pay',
          data: {
            environment: config.public.googlePayEnvironment || 'TEST',
            apiVersion: 2,
            apiVersionMinor: 0,
            merchantInfo: {
              merchantId:
                config.public.googlePayMerchantId || '12345678901234567890',
              merchantName: config.public.siteName || 'Your Store',
            },
            allowedPaymentMethods: [
              {
                type: 'CARD',
                parameters: {
                  allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                  allowedCardNetworks: ['MASTERCARD', 'VISA'],
                },
              },
            ],
          },
        },
      ];

      const details = {
        total: {
          label: 'Total',
          amount: { currency: props.currency || 'EUR', value: '0.01' },
        },
      };

      const request = new PaymentRequest(supportedInstruments, details);
      request
        .canMakePayment()
        .then((result) => {
          isGooglePayAvailable.value = !!result;
        })
        .catch(() => {
          isGooglePayAvailable.value = false;
        });
    } catch (e) {
      isGooglePayAvailable.value = false;
    }
  }
};

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

const handleGooglePay = async () => {
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

  await registerAndPrepareGuestAddress();
  paymentStatus.value = {
    type: 'info',
    message: t('tunnel.payment.googlepay.redirecting'),
  };

  try {
    if (!props.paymentMethod) {
      emit('error', t('tunnel.payment.error.payment_method'));
      isProcessing.value = false;
      return;
    }
    const paymentMethod = props.paymentMethod;

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

    // Start GooglePay payment without token (GooglePay uses redirect flow)

    const { paymentUrl } = await mollieHelper.startPayementMethod({
      paymentName: 'googlepay',
      paymentMethod: props.paymentMethod,
      addressDelivery: deliveryAddress,
      addressInvoice: invoiceAddress,
    });

    if (paymentUrl) {
      window.location.href = paymentUrl;
    } else {
      throw new Error('Failed to initiate GooglePay payment');
    }
  } catch (error: any) {
    console.error('GooglePay payment error:', error);

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
.google-pay-form {
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

.google-pay-container {
  margin: 24px 0;
}

.button-container {
  width: 100%;
}

.google-pay-button {
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
  background: #fff;
  color: #3c4043;
  border: 1px solid #dadce0;

  &:hover:not(:disabled) {
    background: #f8f9fa;
    border-color: #c4c7c9;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .button-content {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    height: 20px;
    width: auto;
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
  margin-top: 20px;

  svg {
    color: #4caf50;
  }
}
</style>
