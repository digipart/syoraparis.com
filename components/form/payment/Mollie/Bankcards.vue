<template>
  <div class="mollie-payment-form">
    <div class="text-center">
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
const config = useRuntimeConfig();
const paymentStatus = ref<{ type: string; message: string } | null>(null);

const handleSubmit = async () => {
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

  try {
    paymentStatus.value = {
      type: 'info',
      message: t('tunnel.payment.card.preparing'),
    };

    await registerAndPrepareGuestAddress();

    const mollieHelper = new MollieHelper({
      cart: cart.value,
      customer: customer.value || {},
    });

    const response = await mollieHelper.startPayementMethod({
      paymentName: 'creditcard',
      paymentMethod: props.paymentMethod,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value,
    });

    // Redirect to Mollie checkout
    if (response.paymentUrl) {
      paymentStatus.value = {
        type: 'info',
        message: t('tunnel.payment.card.redirect_secure'),
      };
      window.location.href = response.paymentUrl;
    } else {
      throw new Error(t('tunnel.payment.error.payment_url'));
    }
  } catch (error: any) {
    isProcessing.value = false;
    paymentStatus.value = {
      type: 'error',
      message: error.data?.message || t('tunnel.payment.card.failed'),
    };
    emit('error', error.message || t('tunnel.payment.error.processing'));
  }
};
</script>

<style lang="scss">
.mollie-payment-form {
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
