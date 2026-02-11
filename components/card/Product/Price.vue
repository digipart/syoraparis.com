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
  displayPaymentX: {
    type: Boolean,
    default: false,
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
  <div>
    <div class="cardProduct-price" :class="[size]">
      <template v-if="hasPromtion">
        <b class="font-normal">
          {{ promotionalPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}
        </b>

        <span class="line-through font-light text-[90%]">
          {{ regularPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}
        </span>

        <span
          class="inline-block font-light bg-black text-white h-auto pt-1 px-1 text-[80%] translate-y-[-1px] leading-none"
        >
          {{ promotionalPrice?.PriceRuleName }}
        </span>
      </template>
      <template v-else>
        <b class="font-normal"
          >{{ regularPrice?.PriceTaxIncl?.toFixed(2) }}{{ currencySign }}</b
        >
      </template>
    </div>
    <div
      class="block text-xs mt-1 font-normal"
      v-if="
        displayPaymentX &&
        (promotionalPrice?.PriceTaxIncl || regularPrice?.PriceTaxIncl || 0) >=
          40
      "
      v-html="
        $t('label.payment_in_x_free', [
          Number(
            (promotionalPrice?.PriceTaxIncl ||
              regularPrice?.PriceTaxIncl ||
              0) / 3
          ).toFixed(2) + currencySign,
        ])
      "
    ></div>
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
    @apply text-xxs;
    @screen lg {
      @apply text-sm;
    }
  }
  &.large {
    @apply text-xs;
    @screen lg {
      @apply text-lg;
    }
  }
}
</style>
