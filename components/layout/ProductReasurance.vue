<script setup lang="ts">
import Refund from '~/components/icon/refund.vue';
import Shipping from '~/components/icon/shipping.vue';
import Payment from '~/components/icon/payment.vue';
const fr = [
  {
    title: 'Livraison offerte dès 99€',
    subtitle: '2-3 jours',
    icon: Shipping,
  },
  {
    title: 'Retour gratuit',
    subtitle: '14 jours',
    icon: Refund,
  },
  {
    title: 'Paiement sécurisé',
    subtitle: 'PayPal, CB, 3x sans frais',
    icon: Payment,
  },
];

const en = [
  {
    title: 'Free shipping from 99€',
    subtitle: '2-3 days',
    icon: Shipping,
  },
  {
    title: 'Free returns',
    subtitle: '14 days',
    icon: Refund,
  },
  {
    title: 'Secure payment',
    subtitle: 'PayPal, Credit Card, 3x no fees',
    icon: Payment,
  },
];

const { languageIsoCode } = toRefs(useAppStore());

const reassuranceItems = computed(() => {
  return languageIsoCode.value === 'fr' ? fr : en;
});
</script>

<template>
  <div class="productReasurance">
    <div
      v-for="(item, index) in reassuranceItems"
      :key="index"
      class="productReasurance-item"
    >
      <component :is="item.icon" class="mb-1" :size="2.3" />
      <span class="text-xs font-normal">{{ item.title }}</span>
      <span class="text-xxs">{{ item.subtitle }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.productReasurance {
  @apply grid grid-cols-1 md:grid-cols-3 gap-0 w-full;
  @apply border border-black;
}
.productReasurance-item {
  @apply flex flex-col items-center justify-center py-3 px-2;
  @apply text-sm text-center;
  @apply border-b md:border-b-0 md:border-r border-black;
  @apply last:border-b-0 md:last:border-r-0;

  svg {
    @apply w-5 h-5 mb-2;
  }
}
</style>
