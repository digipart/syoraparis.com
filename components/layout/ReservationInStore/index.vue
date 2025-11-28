<script setup lang="ts">
import type { ProductType, Variant } from '~/types/ProductType';
import type { StockInStoreType } from '~/types/StoreReservationProductType';

const isVisible = ref(false);

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const steps = [
  { title: 'Personal Info' },
  { title: 'Contact' },
  { title: 'Confirm' },
];

const onStepChange = (step: number) => {
};

const onFinish = () => {
};

const step = ref(1);

const reservation = ref<{
  variant?: Variant;
  store?: StockInStoreType;
  customer?: {
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
  };
}>({});

const setVariant = (variant?: Variant) => {
  reservation.value.variant = variant;
  step.value++;
};
const setStore = (store?: StockInStoreType) => {
  reservation.value.store = store;
  step.value++;
};
const finish = (customer: any) => {

  reservation.value.customer = customer;
  step.value++;
};
const close = () => {
  step.value = 1;
  reservation.value = {};
  isVisible.value = false;
};
</script>

<template>
  <div class="reservationInStoreInfo">
    <div class="flex" @click="isVisible = true">
      <div class="mr-1">
        <IconPlus :size="1.4" />
      </div>
      <div class="flex flex-col text-xs font-normal pt-0.5">
        <span>
          {{ $t('button.availability_in_store') }}
        </span>
      </div>
    </div>
    <BaseModal v-model="isVisible" size="992px" @on-close="close">
      <template #header>
        <span class="text-base uppercase font-medium">
          {{ $t('button.reserve_product_store') }}
        </span>
      </template>

      <BaseSteps
        v-if="product && step !== 4"
        :steps="steps"
        @step-change="onStepChange"
        v-model="step"
        @finish="onFinish"
      >
        <template #default="{ currentStep }">
          <div v-if="currentStep === 1">
            <LayoutReservationInStoreStep1
              v-if="step === 1"
              :product="product"
              @onContinue="setVariant($event)"
            />
          </div>
          <div v-if="currentStep === 2">
            <LayoutReservationInStoreStep2
              v-if="reservation.variant"
              :product="product"
              :variantSelected="reservation.variant"
              @onContinue="setStore($event)"
              @stepIndexChange="step = $event"
            />
          </div>
          <div v-if="currentStep === 3">
            <LayoutReservationInStoreStep3
              v-if="reservation.variant && reservation.store"
              :product="product"
              :variantSelected="reservation.variant"
              :storeSelected="reservation.store"
              @onFinish="finish($event)"
              @stepIndexChange="step = $event"
            />
          </div>
        </template>
      </BaseSteps>

      <div v-if="step === 4">
        <LayoutReservationInStoreStep4
          v-if="
            product &&
            reservation.variant &&
            reservation.store &&
            reservation.customer
          "
          :product="product"
          :variantSelected="reservation.variant"
          :storeSelected="reservation.store"
          :customer="reservation.customer"
          @onClose="close()"
        />
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss">
.reservationInStoreInfo {
  @apply cursor-pointer;

  &-body {
    @apply w-full h-full;
  }
}
</style>

<style lang="scss">
// .modal {
//   @apply flex flex-col border border-black;

//   &-header {
//     @apply p-5 min-h-16;
//   }
//   &-body {
//     height: calc(100% - 4rem);
//     @apply bg-white p-5 pt-0;
//   }
// }
</style>
