<script setup lang="ts">
const cartStore = useCartStore();
const { carrier, totalProductQuantity, hasUnavailableProducts, isDigitalOnly } = toRefs(cartStore);

const props = defineProps<{
  refreshing?: boolean;
}>();

const paymentRefreshing = toRef(props, 'refreshing');

const valide = computed(() =>
  totalProductQuantity.value &&
  (isDigitalOnly.value || carrier.value) &&
  !hasUnavailableProducts.value
);
</script>

<template>
  <div>
    <div v-if="valide && !paymentRefreshing">
      <FormPayment />
    </div>

    <BaseAlert
      v-else
      fill
      :type="hasUnavailableProducts ? 'danger' : 'default'"
      :closeButton="false"
    >
      <span class="text-sm">
        <template v-if="hasUnavailableProducts">
          {{ $t('cart.has_unavailable_products') }}
        </template>
        <template v-else>
          {{ $t('label.payment.noPayment') }}
        </template>
      </span>
      <template #icon>
        <IconPayment v-if="!hasUnavailableProducts" />
        <IconInfo v-else />
      </template>
    </BaseAlert>
  </div>
</template>
