<template>
  <div class="paypal-form relative">
    <div class="mb-3">
      <span class="text-xs ml-1 inline-block -translate-y-0.5">
        {{ t('tunnel.payment.cgv', { shopname: shopName }) }}
      </span>
    </div>

    <div id="paypal-button-container" ref="paypalButtonContainer"></div>

    <input type="hidden" name="custom" value="[1111],[2222]" />
  </div>
</template>

<script setup>
import { loadScript } from '@paypal/paypal-js';
import PaypalHelper from '~/helpers/payments/PaypalHelper';

const config = useRuntimeConfig();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const auth = useAuth();
const { customer } = toRefs(auth);

// Composables
const { t, locale } = useI18n();
const router = useRouter();
const localePath = useLocalePath();

// Props
const props = defineProps({
  paymentMethod: {
    type: Object,
    required: true,
  },
});

// Emit events
const emit = defineEmits(['payment-started', 'payment-completed', 'payment-error']);

// Reactive state
const generalConditionsSale = ref(false);
const paypalButtonContainer = ref(null);
const isProcessing = ref(false);

// Computed properties
const acceptConditionsText = computed(() =>
  t('I accept the general sales conditions', ['/content/cgv'])
);

const paypalPayment = computed(() =>
  new PaypalHelper({
    cart: cart.value,
    customer: customer.value || {},
  })
);

const getCurrency = computed(() => cart.value?.Currency?.IsoCode);

// Methods
const getPaypalLocale = (lang) => {
  // PayPal locale formats:
  // - fr_FR
  // - de_DE
  // - en_US
  if (lang === 'fr' || lang === 'de') {
    return `${lang}_${lang.toUpperCase()}`;
  } else if (lang === 'en') {
    return `${lang}_US`;
  }
  return 'en_US'; // Default fallback
};

const createPaypalOrder = async (data, actions) => {
  const discount = cart.value?.Total?.Discount?.TaxIncl || 0;

  return actions.order.create({
    purchase_units: [
      {
        amount: {
          currency_code: getCurrency.value,
          value: cart.value?.Total?.ToPay?.TaxIncl,
          breakdown: {
            item_total: {
              currency_code: getCurrency.value,
              value: cart.value?.Total?.Product?.TaxIncl,
            },
            discount: {
              currency_code: getCurrency.value,
              value: discount,
            },
            shipping: {
              currency_code: getCurrency.value,
              value: paypalPayment.value.shipping?.TaxIncl,
            },
          },
        },
        custom_id: cart.value.IdCart,
        items: paypalPayment.value.basket,
      },
    ],
  });
};

const handlePaypalApproval = (data, actions) => {
  return actions.order.capture().then(async (details) => {
    emit('payment-completed', {
      orderId: data.orderID,
      cartId: cart.value.IdCart,
      details,
    });
    
    // Create a new cart after successful payment
    try {
      await cartStore.newIdCart();
    } catch (error) {
      console.error('Failed to create new cart:', error);
    }

    router.replace({
      path: localePath(`/order/accepted`),
      query: {
        orderid: data.orderID,
        cartid: cart.value.IdCart,
      },
    });
  });
};

const startPayment = async () => {
  if (isProcessing.value) return;

  isProcessing.value = true;
  emit('payment-started');

  try {
    const paypalLocale = getPaypalLocale(locale.value);

    const paypal = await loadScript({
      'client-id': config.public.paypalClientID,
      currency: getCurrency.value,
      locale: paypalLocale,
    });

    paypal
      .Buttons({
        style: {
          disableMaxWidth: true,
          layout: 'horizontal',
          color: 'black',
          shape: 'rect',
          label: 'paypal',
        },
        createOrder: createPaypalOrder,
        onApprove: handlePaypalApproval,
        onError: (err) => {
          console.error('PayPal error:', err);
          emit('payment-error', err);
        },
      })
      .render('#paypal-button-container');
  } catch (err) {
    console.error('Failed to load the PayPal JS SDK script', err);
    emit('payment-error', err);
  } finally {
    isProcessing.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  if (paypalButtonContainer.value && paypalButtonContainer.value.innerHTML.trim() === '') {
    startPayment();
  }
});

// Watch for changes that might require re-rendering PayPal buttons
watch(
  () => [cart.value?.IdCart, getCurrency.value],
  () => {
    if (paypalButtonContainer.value && paypalButtonContainer.value.children.length === 0) {
      startPayment();
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
#paypal-button-container {
  &.disabled {
    pointer-events: none;
    opacity: 0.8;
  }
}
</style>
