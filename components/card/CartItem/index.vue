<template>
  <div class="cartItem">
    <div class="cartItem-media">
      <NuxtLink :to="getLink">
        <CardProductMedia :product="product" image-size="xsmall" />
      </NuxtLink>
    </div>
    <div class="cartItem-info">
      <div>
        <div class="flex gap-x3 w-full justify-between">
          <div class="pt-0.5">
            <NuxtLink :to="getLink">
              <CardProductTitle :product="product" tag="h3" :lines="2" />
            </NuxtLink>
          </div>
          <CardProductPrice :product="product" />
        </div>
        <div class="mt-4 flex justify-between gap-x-1 items-center">
          <CardCartItemQuantity :product="product" :editable="editable" />
          <ButtonRemoveFromCart :product="product" v-if="editable" />
        </div>
      </div>
      <div><CardCartItemSize :product="product" :editable="editable" /></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { ProductType } from '~/types/ProductType';

const { product, editable = true } = defineProps<{
  editable?: boolean;
  product?: ProductType;
}>();
const localePath = useLocalePath();

const getLink = computed(() => {
  if (product) {
    const productHelper = new ProductHelper(product);
    const category = product?.Category?.Main;
    return localePath(productHelper.getUrl(category));
  }
  return localePath('/#');
});
</script>

<style lang="scss">
$cartItem: '.cartItem';
#{$cartItem} {
  @apply flex gap-x-4 relative;
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
