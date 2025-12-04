<script lang="ts" setup>
import type { ProductType } from '~/types/ProductType';
const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'small',
  },
});

const currencySign = currencyIsoCode.value;

const price = computed(() => {
  return product?.Price;
});

const hasPromtion = computed(() => {
  if (price.value?.PromotionalPrice) return true;

  return false;
});

const regularPrice = computed(() => {
  return price.value?.RegularPrice;
});
const promotionalPrice = computed(() => {
  return price.value?.PromotionalPrice;
});
</script>

<template>
  <div class="cardProduct-price" :class="[size]">
    <!-- <div>
      <template v-if="hasPromtion">
        <b class="font-normal">
          {{ promotionalPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}
        </b>

        <span class="line-through font-light">
          {{ regularPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}
        </span>

        <span class="inline-block font-light">
          {{ promotionalPrice?.PriceRuleName }}
        </span>
      </template>
      <template v-else>
        <b class="font-normal"
          >{{ regularPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}</b
        >
      </template>
    </div> -->
    <a
      target="_blank"
      href="https://drive.google.com/file/d/1-pYesSgax87hBk9vqLs5UbHqD0xlEEzx/view"
      class="block w-full"
    >
      <base-button type="primary" class="w-full">
        <span class="text-xs font-medium"> VENTE PRIVÉE DÉSTOCKAGE </span>
      </base-button>
    </a>
  </div>
</template>
<style lang="scss">
.cardProduct-price {
  &.small {
    // @apply text-xxs;
    // @screen lg {
    @apply text-xxs pt-1;
    // }
  }

  // &.small {
  //   @apply text-[12px];
  //   @media lg {
  //     @apply text-sm;
  //   }
  // }
  &.medium {
    @apply text-xs;
    @screen lg {
      @apply text-base;
    }
  }
}
</style>
