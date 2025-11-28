<template>
  <div class="cartItem">
    <div class="cartItem-media">
      <CardProductMedia :product="product" image-size="xsmall" />
    </div>
    <div class="cartItem-info">
      <div>
        <div class="flex gap-x3 w-full justify-between">
          <div class="pt-0.5">
            <CardProductTitle :product="product" tag="h3" :lines="2" />
          </div>
          <CardProductPrice :product="product" />
        </div>
        <div class="mt-4 flex justify-between gap-x-1 items-center">
         
        </div>
      </div>
      <div><CardCartItemSize :product="product" :editable="editable" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const { product, editable = true } = defineProps<{
  editable?: boolean;
  product?: ProductType;
}>();
</script>

<style lang="scss">
$cartItem: '.cartItem';
#{$cartItem} {
  @apply flex gap-x-4;
  &-media {
    flex: 0 0 100px;
    min-width: 100px;
  }
  &-info {
    @apply flex-1 flex flex-col justify-between;
  }
  .cardProduct-price {
    @apply flex flex-col items-end;
  }
}
</style>
