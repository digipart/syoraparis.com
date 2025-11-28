<script setup lang="ts">
const { editable = true } = defineProps<{
  editable?: boolean;
  mini?: boolean;
}>();

const cartStore = useCartStore();
const { cart, promoCodes } = toRefs(cartStore);

const products = computed(() => {
  return cart.value.Products || [];
});
</script>

<template>
  <div class="cartItems">
    <div
      class="cartItems-item"
      v-for="product in products"
      :key="product.IdProductAttribute"
    >
      <CardCartItem :product="product" :editable="editable" />
      <hr class="my-4" />
    </div>
    <div class="flex flex-col gap-3">
      <CardCartPromoCode
        v-for="promocode in promoCodes"
        :key="promocode.IdPromoCode"
        :promocode="promocode"
        :size="mini ? 'small' : 'medium'"
        :editable="editable"
      />
    </div>
  </div>
</template>

<style lang="scss">
$cartItems: '.cartItems';
#{$cartItems} {
  @apply flex flex-col;

  &-item {
    &:last-child {
      hr {
        @apply hidden;
      }
    }
  }
}
</style>
