<script setup lang="ts">
import type { ProductOrderType } from '~/types/OrderType';
const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const { product, showDetail } = defineProps({
  product: {
    type: {} as PropType<ProductOrderType>,
  },
  showDetail: {
    type: Boolean,
    default: false,
  },
});

const currencySign = currencyIsoCode.value;

const price = computed(() => {
  return product?.Price;
});

const reduction = computed(() => {
  return price.value?.Reduction;
});

const regularPrice = computed(() => {
  return price.value?.Base;
});
const promotionalPrice = computed(() => {
  return price.value?.Paid;
});

const size = computed(() => {
  return product?.Variant?.Combination?.Attributes?.find(
    (attr) => attr.GroupName === 'Size'
  )?.AttributeName;
});

const color = computed(() => {
  return product?.Variant?.Combination?.Attributes?.find(
    (attr) => attr.GroupName === 'Color'
  )?.AttributeName;
});
</script>

<template>
  <div class="cardOrderProduct">
    <div class="cardOrderProduct-top">
      <CardProductLink :product="product">
        <CardProductMedia :product="product" imageSize="small" />
      </CardProductLink>
    </div>
    <div v-if="showDetail" class="cardOrderProduct-body">
      <CardProductTitle :product="product" />
      <div class="cardOrderProduct-price">
        <template v-if="reduction">
          <b class="font-normal">
            {{ promotionalPrice?.TaxIncl?.toFixed(2) }}{{ currencySign }}
          </b>

          <span class="line-through font-light">
            {{ regularPrice?.TaxIncl?.toFixed(2) }}{{ currencySign }}
          </span>

          <span class="inline-block font-light">
            {{ reduction?.Label }}
          </span>
        </template>
        <template v-else>
          <b class="font-normal"
            >{{ regularPrice?.TaxIncl?.toFixed(2) }}{{ currencySign }}</b
          >
        </template>
      </div>
      <div class="text-xs mt-2 flex gap-2">
        <span>({{ product?.Quantity }})</span>
        <span>{{ size }}</span>
        <template v-if="color">
          <span>|</span>
          <span>{{ color }}</span>
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$cardOrderProduct: '.cardOrderProduct';

#{$cardOrderProduct} {
  @apply border border-black;

  &-top {
    @apply relative;
  }
  &-body {
    @apply p-3 border-t border-black;
  }
  //   &-btnreturn {
  //     @apply absolute bottom-3 right-3 text-xs underline;
  //   }
}

.cardOrderProduct-price {
  @apply flex items-center gap-x-1 flex-wrap;

  @apply text-xs pt-1;
}
</style>
