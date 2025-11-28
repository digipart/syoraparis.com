<script setup lang="ts">
import ProductService from '~/services/ProductService';
import type { LookBookProductType } from '~/types/cms/LookBookType';
import type { ProductType } from '~/types/ProductType';

const { lookbookProduct } = defineProps({
  lookbookProduct: {
    type: {} as PropType<LookBookProductType>,
  },
});

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const isVisible = ref(false);
const product = ref<ProductType | null>(null);

const loadProduct = (lookbook: LookBookProductType) => {
  const productService = new ProductService();

  const param = lookbook.url;
  if (param) {
    const productId = param.split('-').pop();
    if (!product.value && productId) {
      productService
        .fetch(Number(productId))
        .then((data) => {
          product.value = data;
        })
        .catch((error) => {
          console.log('error', error);
        })
        .finally(() => {});
    }
  }
};

const openDrawer = (lookbook: LookBookProductType) => {
  nextTick(() => {
    if (windowWidth.value < 992) {
      isVisible.value = true;
      loadProduct(lookbook);
    }
  });
};

const hoverProduct = (lookbook: LookBookProductType) => {
  nextTick(() => {
    if (windowWidth.value >= 992) {
      loadProduct(lookbook);
    }
  });
};
</script>

<template>
  <div
    v-if="lookbookProduct"
    class="lookbookCard-product"
    :style="{
      top: `${lookbookProduct.top}%`,
      left: `${lookbookProduct.left}%`,
    }"
    @mouseenter="hoverProduct(lookbookProduct)"
    @click="openDrawer(lookbookProduct)"
  >
    <div class="lookbookCard-product-wrapper">
      <div class="hidden lg:block" v-if="product">
        <CardProduct :product="product" :hovered="true" />
      </div>
      <div
        v-else
        class="lookbookCard-product-loading hidden lg:block"
        v-loading="true"
      ></div>

      <BaseModal v-model="isVisible" position="top" size="100vdh">
        <div class="flex items-center h-full">
          <div v-if="product" class="w-full">
            <CardProduct :product="product" />
          </div>
          <div
            v-else
            class="lookbookCard-product-loading"
            v-loading="true"
          ></div>
        </div>
      </BaseModal>
    </div>
  </div>
</template>

<style lang="scss">
$lookbookCard: '.lookbookCard';

#{$lookbookCard} {
  &-product {
    @apply absolute h-5 w-5 rounded-full bg-white 
    -translate-x-1/2 -translate-y-1/2 scale-100 duration-300;

    &-wrapper {
      @apply bg-white w-[300px] min-h-[300px] 
      absolute top-1/2 left-1/2 duration-150 scale-90
      -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none;
    }
    &-loading {
      @apply w-full absolute top-0 left-0 min-h-[300px];
    }

    &:hover {
      #{$lookbookCard} {
        &-product {
          &-wrapper {
            @screen md {
              @apply opacity-100 scale-100 pointer-events-auto;
            }
          }
        }
      }
    }
  }
  &:hover {
    #{$lookbookCard} {
      &-product {
        @screen md {
          @apply scale-100 delay-100;
        }
      }
    }
  }
}
</style>
