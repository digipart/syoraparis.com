<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const { disabled } = defineProps<{
  disabled?: boolean;
}>();

const checkoutStore = useCheckoutStore();
const {
  checkoutCustomer,
  checkoutPaymentMethods,
  checkoutDeliveryOption,
  hasSameAddressForShipping,
} = toRefs(checkoutStore);

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice, addresses } = toRefs(addressStore);
const { updateAddressType } = addressStore;

const addressFormAdd = ref<HTMLElement | null>(null);

hasSameAddressForShipping.value =
  checkoutCustomer.value.deliveryAddress.city ===
    checkoutCustomer.value.invoiceAddress.city &&
  checkoutCustomer.value.deliveryAddress.country ===
    checkoutCustomer.value.invoiceAddress.country &&
  checkoutCustomer.value.deliveryAddress.postalCode ===
    checkoutCustomer.value.invoiceAddress.postalCode &&
  checkoutCustomer.value.deliveryAddress.address ===
    checkoutCustomer.value.invoiceAddress.address;

const showForm = ref(false);
const listAddressVisible = ref(false);
const { t } = useI18n();

const getPaymentImage = (paymenName?: string) => {
  switch (paymenName?.toLowerCase()) {
    case 'creditcard':
      return '/assets/images/visa-mastercard-logo.png';
    case 'paypal':
      return '/assets/images/paypal-logo.png';
    case 'applepay':
      return '/assets/images/apple-pay.svg';
    case 'googlepay':
      return '/assets/images/google-pay.svg';
    case 'alma':
      return '/assets/images/alma-logo.svg';
    case 'klarna':
      return '/assets/images/klarna-logo.svg';
  }

  return undefined;
};

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
  listAddressVisible.value = false;
  if (address.IdAddress) {
    updateAddressType({
      IdAddress: address.IdAddress,
      IsInvoice: true,
      IsDelivery: addressDelivery.value?.IdAddress === address?.IdAddress,
    });
  }
};

const displayForm = () => {
  showForm.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
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

const config = useRuntimeConfig();
</script>

<template>
  <div class="formPayment">
    <div>
      <InputCheckBox
        v-if="checkoutDeliveryOption === 'home'"
        id="same_address_for_shipping"
        v-model="hasSameAddressForShipping"
        @change="setAddresse($event)"
      >
        {{ t('label.same_as_delivery_address') }}
      </InputCheckBox>
      <div
        v-if="!hasSameAddressForShipping || checkoutDeliveryOption !== 'home'"
        class="mb-5"
      >
        <transition name="slide">
          <div v-show="!showForm && !listAddressVisible">
            <div>
              <span class="text-xs">
                {{ t('titles.invoice_address') }}
              </span>
              <PageCheckoutInvoiceAddressSelected />
            </div>
            <span
              class="underline text-xs cursor-pointer"
              @click="listAddressVisible = !listAddressVisible"
              v-if="addresses.length > 0"
            >
              {{ t('button.select_another_address') }}
            </span>
          </div>
        </transition>
        <transition name="slide">
          <div v-if="!showForm && listAddressVisible">
            <div class="flex justify-end mt-3 mb-3">
              <span
                class="underline text-xs cursor-pointer"
                @click="displayForm()"
              >
                {{ $t('button.add_new_address') }}
              </span>
            </div>
            <PerfectScrollbar class="max-h-96 mb-5">
              <ListingAccountAddresses
                activeType="Delivery"
                @onAddressSelected="setAddresseInvoice($event)"
              />
            </PerfectScrollbar>
          </div>
        </transition>
        <transition name="slide">
          <div v-show="showForm" ref="addressFormAdd">
            <FormAddress
              @cancel="showForm = !showForm"
              @onAddressCreated="setAddresseInvoice($event)"
              inputBorder
            />
          </div>
        </transition>
      </div>
    </div>

    <BaseCollapsible
      v-if="checkoutPaymentMethods.length > 0"
      :index-active="[1]"
    >
      <template v-for="(pm, index) in checkoutPaymentMethods">
        <BaseCollapsibleItem
          v-if="
            (pm.PaymentProvider?.toLowerCase() === 'mollie' &&
              ['creditcard', 'paypal', 'applepay', 'googlepay'].includes(
                pm.PaymentCode?.toLowerCase() || ''
              )) ||
            (pm.PaymentProvider?.toLowerCase() === 'payzen' &&
              pm.PaymentCode?.toLowerCase() === 'creditcard') ||
            (pm.PaymentProvider?.toLowerCase() === 'stripe' &&
              ['creditcard', 'klarna'].includes(
                pm.PaymentCode?.toLowerCase() || ''
              )) ||
            (pm.PaymentProvider?.toLowerCase() === 'paypal' &&
              pm.PaymentCode?.toLowerCase() === 'paypal')
          "
          :index="index + 1"
          :closeOthers="true"
          :hideArrow="true"
        >
          <template #header>
            <div class="flex justify-between w-full items-center">
              <div class="flex flex-col text-xs">
                <span class="uppercase font-normal">
                  {{ pm?.PaymentName }}
                </span>
                <span class="font-light"> {{ pm.PaymentDescription }} </span>
              </div>
              <div>
                <img
                  v-if="getPaymentImage(pm.PaymentCode)"
                  :src="getPaymentImage(pm.PaymentCode)"
                  :alt="pm.PaymentName"
                  class="h-5"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="p-5">
              <!-- Mollie -->
              <FormPaymentMollieBankcards
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMolliePaypal
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'paypal'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMollieApplePay
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'applepay'
                "
                :paymentMethod="pm"
              />
              <FormPaymentMollieGooglePay
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'mollie' &&
                  pm.PaymentCode?.toLowerCase() === 'googlepay'
                "
                :paymentMethod="pm"
              />

              <!-- PAYZEN -->
              <FormPaymentPayzenBankcards
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'payzen' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
              />

              <!-- Strip -->
              <FormPaymentStripe
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'stripe' &&
                  pm.PaymentCode?.toLowerCase() === 'creditcard'
                "
                :paymentMethod="pm"
                form-type="card"
              />
              <FormPaymentStripe
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'stripe' &&
                  pm.PaymentCode?.toLowerCase() === 'klarna'
                "
                :paymentMethod="pm"
                form-type="klarna"
              />
              <!-- Paypal -->
              <FormPaymentPaypal
                v-if="
                  pm.PaymentProvider?.toLowerCase() === 'paypal' &&
                  pm.PaymentCode?.toLowerCase() === 'paypal'
                "
                :paymentMethod="pm"
                form-type="paypal"
              />
            </div>
          </template>
        </BaseCollapsibleItem>
      </template>
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
