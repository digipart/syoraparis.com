<template>
  <div class="cartItem" :class="{ 'cartItem--checkout': checkout }">
    <div class="cartItem-media">
      <NuxtLink :to="getLink">
        <CardProductMedia :product="product" image-size="xsmall" />
      </NuxtLink>
    </div>
    <div class="cartItem-info">
      <div>
        <div class="flex gap-x-2 w-full justify-between">
          <div class="pt-0.5">
            <NuxtLink :to="getLink">
              <CardProductTitle :product="product" tag="h3" :lines="2" />
            </NuxtLink>
          </div>
          <CardProductPrice :product="product" />
        </div>
        <div
          v-if="editable"
          class="mt-4 flex justify-between gap-x-1 items-center"
        >
          <CardCartItemQuantity :product="product" />
          <ButtonRemoveFromCart :product="product" />
        </div>
        <div v-else>
          <div class="text-xxs mt-2">
            <span>{{ $t('label.size') }} : </span>
            <span v-if="product">
              {{ ProductHelper.getSelectedOption(product)?.label }}
            </span>
          </div>
          <div class="text-xxs mt-1">
            <span>{{ $t('label.quantity') }} : </span>
            <span v-if="product">
              {{ product?.Quantity }}
            </span>
          </div>
        </div>
      </div>
      <div>
        <CardCartItemSize :product="product" v-if="editable" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { ProductType } from '~/types/ProductType';

const {
  product,
  editable = true,
  checkout = false,
} = defineProps<{
  editable?: boolean;
  product?: ProductType;
  checkout?: boolean;
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
    @apply relative;
  }
  &-info {
    @apply flex-1 flex flex-col justify-between;
  }
  .cardProduct-price {
    @apply flex flex-col items-end;
  }

  &--checkout {
    @apply gap-x-2;
    #{$cartItem} {
      &-media {
        flex: 0 0 50px;
        min-width: 50px;
      }
    }
  }
}
</style>
