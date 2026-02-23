<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const { shopthelook, products } = defineProps({
  shopthelook: {
    type: Boolean,
    default: true,
  },
  products: {
    type: Array as PropType<ProductType[]>,
    default: () => [],
  },
});
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="py-2 px-4 h-14 flex items-center border-b border-black">
      <BaseHeadLine class="text-xs">{{
        $t('label.recommended_products')
      }}</BaseHeadLine>
    </div>
    <div class="grid grid-cols-1 gap-3 px-4 py-4 flex-1 overflow-auto">
      <div v-for="(product, index) in products" :key="index">
        <CardProduct
          :product="product"
          :slider="false"
          size="small"
          :shopthelook="shopthelook"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
