<template>
  <div class="flex gap-3">
    <NuxtImg v-if="image" :src="image" class="w-full max-w-32" />
    <div class="flex-1">
      <BaseHeadLine size="xs" class="font-normal uppercase">
        {{ product.Description?.Title }}
      </BaseHeadLine>
      <div class="mt-1">
        <CardProductPrice :product="product" />
      </div>
      <div v-if="variantSelected" class="text-xs mt-3">
        {{ $t('label.size') }} :
        {{ ProductHelper.getSize(variantSelected) }}
      </div>

      <div v-if="ProductHelper.getColor(variantSelected)" class="text-xs mt-2">
        {{ $t('label.color') }} :
        {{ ProductHelper.getColor(variantSelected) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { ProductType, Variant } from '~/types/ProductType';

const { product, variantSelected } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  variantSelected: {
    type: {} as PropType<Variant>,
    required: true,
  },
});
const image = computed(() => {
  return ProductHelper.getFirstImage(product);
});
</script>

<style lang="scss">
$cardShopAddress: '.cardShopAddress';

#{$cardShopAddress} {
  @apply relative border p-3 duration-150;
  &.checked {
    @apply border-black;
  }
  &-radio {
    @apply absolute top-4 left-3 text-xs h-3 w-3 border-black border rounded-2xl flex justify-center items-center;
  }
  &-name {
    @apply font-normal uppercase mb-2;
  }
}
</style>
