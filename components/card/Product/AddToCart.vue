<script lang="ts" setup>
import ProductService from '~/services/ProductService';
import type { ProductType } from '~/types/ProductType';
import { trackAddToCart } from '~/utils/gtm';

const { t } = useI18n();

const appStore = useAppStore();
const { miniCartVisible,miniFavoriteVisible } = toRefs(appStore);

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const isVisible = ref(false);
const variantVisible = ref(false);

const loadVariants = (event: any) => {
  event.preventDefault();
  const productService = new ProductService();

  if (product?.IdProduct) {
    if (!product.Variant) {
      productService
        .fetchVariant(product.IdProduct)
        .then((data: any) => {
          product.Variant = data;
          isVisible.value = !isVisible.value;
        })
        .finally(() => {
          variantVisible.value = true;
        });
    } else {
      isVisible.value = true;
    }

    if (!product.Media?.Images?.product_small) {
      productService.fetchMedias(product.IdProduct).then((data: any) => {

        product.Media = data;
      });
    }
  }
};

const sizeSelected = (size: any) => {
  isVisible.value = false;
  miniCartVisible.value = true;
  
  // Track add to cart event
  if (product) {
    trackAddToCart(product, 1);
  }
};
</script>

<template>
  <div>
    <BaseButton
      icon
      class="cardProduct-showbody bg-white"
      @click="loadVariants"
      size="small"
      :title="t('button.add_to_cart')"
    >
      <IconPlus :size="1.3" />
    </BaseButton>

    <BaseDrawer
      v-model="isVisible"
      size="auto"
      position="bottom"
      :closeButton="false"
    >
      <div class="cardProduct-addtoCart -mx-5 -my-5">
        <div class="relative mb-3 pr-8">
          <CardProductTitle :product="product" />
          <CardProductPrice :product="product" />
          <div class="absolute -top-2 right-0">
            <CardProductAddToFavorite :product="product" />
          </div>
        </div>
        <CardProductColors class="mb-4" />
        <CardProductImagesSlide :product="product" class="-mx-4" />
        <CardProductSizes
          class="-mx-4"
          :product="product"
          @onSizeSelected="sizeSelected"
        />
      </div>
    </BaseDrawer>
  </div>
</template>
<style lang="scss">
.cardProduct-addtoCart {
  @apply relative px-4  py-3 border-black border-t;
}
</style>
