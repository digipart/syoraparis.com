<script setup lang="ts">
import PaymentService from '~/services/PaymentService';
import type { AddressType } from '~/types/AddressType';
import type { PaymentMethodType } from '~/types/PaymentType';

const { disabled } = defineProps<{
  disabled?: boolean;
}>();

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);
const { fetchAddresses, updateAddress, updateAddressType } = addressStore;

const paymentStore = usePaymentStore();
const { payments } = toRefs(paymentStore);

const hasSameAddressForShipping = ref(
  addressDelivery.value?.IdAddress === addressInvoice.value?.IdAddress
);

// Define a type for our payment method UI representation
interface PaymentMethodUI {
  id: number;
  key: string;
  name: string;
  sname: string;
  logo: string;
  data: PaymentMethodType;
}

const paymentMethodsData = ref<PaymentMethodType[]>([]);
const { t } = useI18n();

const paymentMethods = computed(() => {
  const pMs: PaymentMethodUI[] = [];

  // {
  //           "IdPayment": 10,
  //           "PaymentName": "Alma 2 fois",
  //           "PaymentCode": "ALMA2X",
  //           "AmountMin": 0,
  //           "AmountMax": 0,
  //           "Position": 4
  //       },
  //       {
  //           "IdPayment": 3,
  //           "PaymentName": "Alma 3 fois d\u00e8s 150\u20ac",
  //           "PaymentCode": "ALMA3X",
  //           "AmountMin": 150,
  //           "AmountMax": 1000,
  //           "Position": 5
  //       },
  //       {
  //           "IdPayment": 4,
  //           "PaymentName": "Alma 4 fois d\u00e8s 150\u20ac",
  //           "PaymentCode": "ALMA4X",
  //           "AmountMin": 0,
  //           "AmountMax": 0,
  //           "Position": 6
  //       },

  paymentMethodsData.value.forEach((payment: PaymentMethodType) => {
    if (payment.PaymentCode === 'STRIPE') {
      pMs.push({
        id: 1,
        key: 'card',
        name: t('tunnel.payment.card.name'),
        sname: t('tunnel.payment.card.sname'),
        logo: '/assets/images/visa-mastercard-logo.png',
        data: payment,
      });
    } else if (payment.PaymentCode === 'PAYZEN') {
      pMs.push({
        id: 2,
        key: 'card-payzen',
        name: t('tunnel.payment.card_payzen.name'),
        sname: t('tunnel.payment.card_payzen.sname'),
        logo: '/assets/images/visa-mastercard-logo.png',
        data: payment,
      });
    } else if (payment.PaymentCode === 'PAYPAL') {
      pMs.push({
        id: 3,
        key: 'paypal',
        name: t('tunnel.payment.paypal.name'),
        sname: t('tunnel.payment.paypal.sname'),
        logo: '/assets/images/paypal-logo.png',
        data: payment,
      });
    } else if (payment.PaymentCode === 'KLARNA') {
      pMs.push({
        id: 4,
        key: 'klarna',
        name: t('tunnel.payment.klarna.name'),
        sname: t('tunnel.payment.klarna.sname'),
        logo: '/assets/images/klarna-logo.png',
        data: payment,
      });
    }
  });

  return pMs;
});

const shippingSelected = ref(-1);

const selectShipping = (id: number) => {
  shippingSelected.value = id;
};

const idAddressDelivery = computed(() => {
  const id = addressDelivery.value?.IdAddress;

  return id;
});

const setAddresseInvoice = (address: AddressType) => {
  // const newAddress = { ...address };
  // newAddress.IsInvoice = true;
  // newAddress.IsDelivery =
  //   addressDelivery.value?.IdAddress === addressInvoice.value?.IdAddress;

  if (address.IdAddress) {
    updateAddressType({
      IdAddress: address.IdAddress,
      IsInvoice: true,
      IsDelivery: addressDelivery.value?.IdAddress === address?.IdAddress,
    });
  }
};

const setAddresse = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const value = input.checked;
  if (value) {
    const newAddress = { ...addressDelivery.value };
    newAddress.IsInvoice = true;
    if (newAddress?.IdAddress) {
      updateAddressType({
        IdAddress: newAddress?.IdAddress,
        IsInvoice: true,
        IsDelivery: true,
      });
    }
  }
};

const paymentService = new PaymentService();
try {
  const data = await paymentService.paymentMethods({
    IdAddress: idAddressDelivery.value,
    LanguageIsoCode: 'fr',
  });

  console.log('payment methods:', data.PaymentMethods);
  paymentMethodsData.value = data.PaymentMethods || [];
} catch (error) {
  console.error(t('tunnel.payment.error.fetch_methods'), error);
}

onMounted(() => {});
</script>

<template>
  <div class="formPayment">
    <div>
      <InputCheckBox
        id="same_address_for_shipping"
        v-model="hasSameAddressForShipping"
        @change="setAddresse($event)"
      >
        {{ t('label.same_as_delivery_address') }}
      </InputCheckBox>
      <div v-if="!hasSameAddressForShipping">
        <div class="border border-black px-5 py-3 mt-3 mb-3 bg-white">
          <PageCheckoutInvoiceAddressSelected />
        </div>
      </div>
    </div>

    <BaseCollapsible v-if="paymentMethods.length > 0" :index-active="[0]">
      <BaseCollapsibleItem
        v-for="(s, index) in paymentMethods"
        :key="s?.key"
        :index="index"
        :closeOthers="true"
        :hideArrow="true"
      >
        <template #header>
          <div class="flex justify-between w-full items-center">
            <div class="flex flex-col text-xs">
              <span class="uppercase font-normal">
                {{ s?.name }}
              </span>
              <span class="font-light">
                {{ s?.sname }}
              </span>
            </div>
            <div>
              <img :src="s?.logo" :alt="s?.name" class="h-5" />
            </div>
          </div>
        </template>
        <template #content>
          <div class="p-5">
            <template v-if="s?.key === 'card'">
              <FormPaymentStripe
                :paymentMethod="s.data"
                :disabled="disabled"
                form-type="card"
              />
            </template>
            <template v-if="s?.key === 'card-payzen'">
              <FormPaymentPayzen :paymentMethod="s.data" />
            </template>
            <template v-if="s?.key === 'paypal'">
              <FormPaymentPaypal :paymentMethod="s.data" />
            </template>
            <template v-if="s?.key === 'klarna'">
              <FormPaymentStripe
                :paymentMethod="s.data"
                :disabled="disabled"
                form-type="klarna"
              />
            </template>
          </div>
        </template>
      </BaseCollapsibleItem>

      <BaseCollapsibleItem :index="1000" :closeOthers="true" :hideArrow="true">
        <template #header>
          <div class="flex justify-between w-full items-center">
            <div class="flex flex-col text-xs">
              <span class="uppercase font-normal">
                {{ t('tunnel.payment.alma.name') }}
              </span>
              <span class="font-light">
                {{ t('tunnel.payment.alma.sname') }}
              </span>
            </div>
            <div>
              <img src="/assets/images/alma-logo.svg" alt="Alma" class="h-5" />
            </div>
          </div>
        </template>
        <template #content>
          <div class="p-5">
            <FormPaymentAlma
              v-if="paymentMethodsData.length > 0"
              :paymentMethods="paymentMethodsData"
            />
          </div>
        </template>
      </BaseCollapsibleItem>
    </BaseCollapsible>
  </div>
</template>

<style lang="scss" scoped>
.formPayment {
  @apply flex flex-col gap-2.5;

  .collapsible {
    @apply bg-white;
    .collap-item {
    }
  }
}
</style>
