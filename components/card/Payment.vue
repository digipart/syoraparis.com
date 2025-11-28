<template>
  <div
    class="cardPayment"
    @click="$emit('onSelect', $event)"
    :class="{ active }"
  >
    <div class="flex mb-3">
      <div class="flex flex-col flex-1 text-xs uppercase">
        <span class="font-normal mb-1">{{ paymentMethode?.name }}</span>
        <span class="font-light">{{ paymentMethode?.sname }}</span>
      </div>
      <div class="cardPayment-logo">
        <NuxtImg
          :src="getCarrierImage()"
          :alt="paymentMethode?.logo"
          height="28"
          class="h-7"
        />
      </div>
    </div>

    <slot />
  </div>
</template>

<script setup lang="ts">
const { paymentMethode } = defineProps({
  paymentMethode: {
    type: {} as PropType<any>,
  },
  active: {
    type: Boolean,
    default: false,
  },
});

const getCarrierImage = () => {
  if (paymentMethode?.key === 'card') {
    return '/assets/images/visa-mastercard-logo.png';
  } else if (paymentMethode?.key === 'paypal') {
    return '/assets/images/paypal-logo.png';
  } else if (paymentMethode?.key === 'klarna') {
    return '/assets/images/klarna-logo.png';
  }
};
</script>

<style scoped lang="scss">
$cardPayment: '.cardPayment';

#{$cardPayment} {
  @apply border border-gray-bbb p-5  gap-3 duration-150;

  &-logo {
  }

  &.active {
    @apply border-black;
  }
}
</style>
