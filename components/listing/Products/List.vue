<script setup lang="ts">
import type { CategoryType } from '~/types/CategoryType';
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();
const { categoryListingView } = toRefs(appStore);

const { products, category } = defineProps({
  products: {
    type: {} as PropType<ProductType[]>,
  },
  category: {
    type: {} as PropType<CategoryType>,
  },
  border: {
    type: Boolean,
    default: false,
  },
});

// const view = computed(() => {
//   const typeView = useCookie('CATEGORY_VIEW', {
//     default: () => 'cols',
//   });

//   return typeView.value;
// });

const showProductActions = computed(() => {
  return categoryListingView.value !== 'grid';
});
</script>

<template>
  <div
    class="grid"
    :class="[
      {
        'grid-cols-2 md:grid-cols-3 lg:grid-cols-3 2xl:grid-cols-4':
          categoryListingView === 'cols',
        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3':
          categoryListingView === 'full',
        'grid-cols-4 md:grid-cols-6 lg:grid-cols-10':
          categoryListingView === 'grid',
      },
    ]"
  >
    <div
      v-for="(product, index) in products"
      :key="product?.IdProduct || '' + '-' + index"
      class="col-span-1"
    >
      <CardProduct
        :product="product"
        :category="category"
        :favorite="showProductActions"
        :body="showProductActions"
        :addToCart="showProductActions"
        :shopthelook="true"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
