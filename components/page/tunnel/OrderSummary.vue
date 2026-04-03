<script setup lang="ts">
const cartStore = useCartStore();
const {
  totalProductQuantity,
  totalToPay,
  productTotalToPay,
  carrier,
  totalDiscount,
} = toRefs(cartStore);
const appStore = useAppStore();
const { currencySign } = toRefs(appStore);

const { t } = useI18n();
</script>

<template>
  <div class="orderSummary">
    <div class="orderSummary-item mb-2">
      <span class="orderSummary-label">
        {{ totalProductQuantity }} {{ t('label.article') }} :
      </span>
      <span class="orderSummary-value">
        {{ productTotalToPay.toFixed(2) }} {{ currencySign }}
      </span>
    </div>

    <div
      v-if="carrier?.Price?.TaxIncl !== undefined"
      class="orderSummary-item mb-2"
    >
      <span class="orderSummary-label">
        {{ t('label.shipping') }} <br />
        <small
          >({{ carrier?.Name }}
          <span v-if="carrier?.IdRelayPoint"
            >- {{ carrier?.RelayPoint?.Name }}</span
          >)</small
        >
        :
      </span>
      <span class="orderSummary-value">
        {{ carrier?.Price?.TaxIncl.toFixed(2) }} {{ currencySign }}
      </span>
    </div>

    <div v-if="totalDiscount" class="orderSummary-item mb-2">
      <span class="orderSummary-label">
        {{ t('label.discount') }} <small></small> :
      </span>
      <span class="orderSummary-value">
        - {{ totalDiscount?.toFixed(2) }} {{ currencySign }}
      </span>
    </div>

    <hr class="my-3" />

    <div class="orderSummary-item">
      <span class="orderSummary-label"> {{ t('cart.total') }} : </span>
      <span class="orderSummary-value">
        {{ totalToPay.toFixed(2) }} {{ currencySign }}
      </span>
    </div>
  </div>
</template>

<style lang="scss">
$orderSummary: '.orderSummary';

#{$orderSummary} {
  @apply text-sm;

  &-item {
    @apply flex justify-between items-start gap-5;
  }

  &-label {
    @apply flex-1;
  }
  &-value {
    @apply font-normal;
  }
}
</style>
