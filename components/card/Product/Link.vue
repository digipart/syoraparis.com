CardProduct<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { CategoryType } from '~/types/CategoryType';
import type { ProductOrderType } from '~/types/OrderType';
import type { ProductType } from '~/types/ProductType';

const { product, category } = defineProps({
  product: {
    type: {} as PropType<ProductType | ProductOrderType>,
  },

  category: {
    type: {} as PropType<CategoryType>,
  },
});

const localePath = useLocalePath();

const getLink = computed(() => {
  if (product) {
    const productHelper = new ProductHelper(product);
    return localePath(productHelper.getUrl(category));
  }
  return localePath('/#');
});
</script>

<template>
  <NuxtLink :to="getLink">
    <slot />
  </NuxtLink>
</template>

<style scoped></style>
