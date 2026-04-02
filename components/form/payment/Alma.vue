<template>
  <div class="almapayment">
    <div v-if="error" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
      {{ error }}
    </div>

    <div class="flex flex-col">
      <template v-for="paymentMethod in props.paymentMethods">
        <InputRadio
          v-if="paymentMethod?.PaymentCode?.includes('ALMA')"
          :id="`alma${paymentMethod.PaymentCode}`"
          :value="paymentMethod.PaymentCode"
          v-model="almaRadio"
          class=""
        >
          {{ paymentMethod.PaymentName }}
        </InputRadio>
      </template>
    </div>

    <div class="mb-5">
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
    </div>

    <BaseButton
      type="primary"
      class="block w-full"
      @click="checkoutAlma()"
      :disabled="!almaRadio || loading"
      :loading="loading"
    >
      {{ t('Checkout') }}
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import AlmaHelper from '~/helpers/payments/AlmaHelper';
import type { PaymentMethodType } from '~/types/PaymentType';

const { t } = useI18n();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const checkoutStore = useCheckoutStore();
const { hasSameAddressForShipping } = storeToRefs(checkoutStore);
const { registerAndPrepareGuestAddress } = useCheckoutGuest();
const localePath = useLocalePath();
const formDeliveryFastStore = useFormDeliveryFastStore();
const formInvoiceFastStore = useFormInvoiceFastStore();

const props = defineProps<{
  paymentMethods: PaymentMethodType[];
}>();

const generalConditionsSale = ref(false);
const almaRadio = ref('');
const loading = ref(false);
const error = ref('');

// Create AlmaHelper instance
const almaPayment = computed(() => {
  console.log('customer.value', customer.value);

  return new AlmaHelper({
    cart: cart.value,
    customer: customer.value,
    locale: 'fr',
  });
});

// Get selected payment method
const paymentMethod = computed(() => {
  return props.paymentMethods?.find(
    (item) => item.PaymentCode === almaRadio.value
  );
});

// Toggle loading state
const toggleLoader = (val: boolean) => {
  loading.value = val;
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

// Process Alma checkout
const checkoutAlma = async () => {
  const isFormDeliveryFastValid = await formDeliveryFastStore.validateFields();
  const isFormInvoiceFastValid = hasSameAddressForShipping.value
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

  let installmentsCount = 1;

  // Determine installment count based on selected option
  switch (almaRadio.value) {
    case 'ALMA2X':
      installmentsCount = 2;
      break;
    case 'ALMA3X':
      installmentsCount = 3;
      break;
    case 'ALMA4X':
      installmentsCount = 4;
      break;
    default:
      installmentsCount = 1;
  }

  toggleLoader(true);
  error.value = '';

  try {
    if (
      !addressDelivery.value ||
      !addressInvoice.value ||
      !paymentMethod.value
    ) {
      error.value = t('Missing required information for payment');
      return;
    }

    // Track payment method selection with Google Analytics

    const response: any = await almaPayment.value.checkout({
      installmentsCount,
      paymentMethod: paymentMethod.value,
      addressDelivery: addressDelivery.value,
      addressInvoice: addressInvoice.value || addressDelivery.value,
    });

    console.log('response', response.url);
    if (response?.url) {
      window.open(response.url, '_self');
    } else {
      error.value = t('Payment redirect URL is missing');
    }
  } catch (err: any) {
    console.error('Alma payment error:', err);

    // Handle error response
    if (err.response?.data?.errors?.length > 0) {
      error.value = err.response.data.errors[0].message;
    } else {
      error.value = t('Payment processing failed');
    }
  } finally {
    toggleLoader(false);
  }
};

// Initialize component
onMounted(() => {});
</script>

<style lang="scss">
.almapayment {
  .inputRadio {
    @apply max-w-52;
    &-label {
      @apply border mb-[-1px] py-2 px-2 block;
    }
    &.checked {
      @apply bg-black text-white;
    }
  }
}
</style>
