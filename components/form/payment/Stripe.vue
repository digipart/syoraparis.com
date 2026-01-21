<script setup lang="ts">
import StripeHelper from '~/helpers/payments/StripeHelper';
import type { PaymentMethodType } from '~/types/PaymentType';

const { t } = useI18n();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const cartStore = useCartStore();
const { fetchCart } = cartStore;
const { cart } = toRefs(cartStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const { customerSaveAddress } = auth;
const { registerAndPrepareGuestAddress } = useCheckoutGuest();

const checkoutStore = useCheckoutStore();

const localePath = useLocalePath();
const router = useRouter();

const config = useRuntimeConfig();

const { disabled, paymentMethod, formType } = defineProps<{
  disabled?: boolean;
  paymentMethod?: PaymentMethodType;
  formType: 'card' | 'klarna';
}>();

const { locale } = useI18n();

const clientSecret = ref('');
const elements = ref<any>();
const stripe = ref<any>();
const loading = ref(false);
const generalConditionsSale = ref(false);

const stripePayment = ref<StripeHelper>();

const postData = async () => {
  try {
    const cs = await customerSaveAddress();
    const ga = await registerAndPrepareGuestAddress();
    console.log('cs', cs);
    console.log('ga', ga);
    // if (addressDelivery?.value && paymentMethod) {
    const response = await stripePayment.value?.postData({
      clientSecret: clientSecret.value,
      paymentMethod: paymentMethod,
      addressDelivery: addressDelivery?.value,
      addressInvoice: addressInvoice?.value,
    });

    return true;
    // }
    return false;
  } catch (error) {
    console.log(error);

    return false;
  }
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

  loading.value = true;
  if (clientSecret.value) {
    if (await postData()) {
      const idorder = cart.value.IdCart;
      const { error, paymentIntent } = await stripe.value.confirmPayment({
        elements: elements.value,
        confirmParams: {
          // Remove the return_url to prevent automatic redirection
          // receipt_email: "jmptest@yopmail.com",
          return_url: `${config.public.url}/order/accepted?orderid=${idorder}&cartid=${cart.value.IdCart}`,
        },
        redirect: 'if_required', // This prevents automatic redirection
      });
      if (error) {
        if (error.type === 'card_error' || error.type === 'validation_error') {
          //   this.showMessage(error.message);
        } else {
          //   this.showMessage('An unexpected error occurred.');
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment successful, perform custom redirection
        // await this.cartService.finishOrder(idorder, this.$gtag, 'accepted');

        // Create a new cart after successful payment
        try {
          await cartStore.newIdCart();
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
              orderid: idorder,
              cartid: cart.value.IdCart,
            },
          })
        );
      }
    }
  }

  loading.value = false;
};

const initialize = async () => {
  try {
    const data = await stripePayment.value?.intent({
      paymentMethodTypes: formType,
    });

    clientSecret.value = data.ClientSecret;

    if (clientSecret.value) {
      elements.value = stripe.value.elements({
        clientSecret: clientSecret.value,
        locale: locale.value ?? 'fr',
      });

      const paymentElementOptions = {
        layout: 'tabs',
      };

      const paymentElement = elements.value.create(
        'payment',
        paymentElementOptions
      );

      paymentElement.mount('#payment-element-' + formType);
    }
  } catch (error) {
    console.error('stripe : ', error);
  }

  loading.value = false;
};

const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject();
    document.head.appendChild(script);
  });
};

onMounted(async () => {
  // Style Object documentation here: https://stripe.com/docs/js/appendix/style
  //   let Stripe: any;
  await loadScript('https://js.stripe.com/v3/');

  stripe.value = Stripe(config.public.stripePublicKey);

  // fetchCart().then(() => {
  stripePayment.value = new StripeHelper({
    cart: cart.value,
    customer: customer.value || {},
  });
  initialize();
  // });
});
</script>

<template>
  <div class="" v-loading="loading">
    <div v-if="stripe" class="mb-5">
      <form :id="'payment-form-' + formType" @submit.prevent="handleSubmit">
        <div :id="'payment-element-' + formType">
          <!--Stripe.js injects the Payment Element-->
        </div>
        <div :id="'payment-message-' + formType" class="hidden"></div>
      </form>
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
      @click="handleSubmit()"
      :disabled="disabled"
      :title="$t('button.checkout')"
    >
      {{ $t('button.checkout') }}
    </BaseButton>
  </div>
</template>

<style scoped></style>
