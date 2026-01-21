<template>
  <div class="productHeader">
    <div class="px-5">
      <div class="grid grid-cols-12 gap-x-4">
        <div class="col-span-12 lg:col-span-6 hidden lg:block pl-10">
          <div class="productHeader-wrapper">
            <div class="productHeader-image">
              <CardProductMedia :product="product" image-size="xsmall" />
            </div>
            <div class="productHeader-info">
              <!-- <BaseColor size="small" color="red" active /> -->
              <div class="mb-3">
                <CardProductColors
                  :product="product"
                  :activeIdProduct="Number(product?.IdProduct || 0)"
                  size="medium"
                />
              </div>
              <CardProductTitle
                :product="product"
                tag="h3"
                :lines="2"
                class="mb-2 font-normal"
              />

              <CardProductPrice :product="product" />
            </div>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-6 flex items-center justify-end">
          <div class="flex w-full gap-4 justify-center lg:pl-[92px] lg:pr-5">
            <div class="w-full max-w-[600px]">
              <BaseButton
                type="primary"
                class="w-full"
                @click="$emit('addToCartClick', $event)"
              >
                {{ $t('button.add_to_cart') }}
              </BaseButton>
            </div>

            <CardProductAddToFavorite
              :product="product"
              type="primary"
              class="!min-w-11 !lg:min-w-11"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});
</script>

<style lang="scss">
$productHeader: '.productHeader';

#{$productHeader} {
  @apply border-b border-black py-3 bg-white;
  &-wrapper {
    @apply flex gap-x-5 items-center;
  }
  &-image {
    @apply w-[75px];
  }
  &-info {
    @apply relative pr-5;

    .color {
      @apply absolute top-1 right-0;
    }
  }
}
</style>
