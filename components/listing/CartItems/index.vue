<script setup lang="ts">
const { editable = true, checkout = false } = defineProps<{
  editable?: boolean;
  mini?: boolean;
  checkout?: boolean;
}>();

const cartStore = useCartStore();
const { cart, promoCodes } = toRefs(cartStore);
const { fetchCart } = cartStore;

const products = computed(() => {
  return cart.value.Products || [];
});

const emit = defineEmits(['onCodePromoRemoved']);

const refreshCodePromo = async () => {
  console.log('refreshCodePromo');
  await fetchCart();
  emit('onCodePromoRemoved');
};
</script>

<template>
  <div class="cartItems">
    <div
      class="cartItems-item"
      v-for="product in products"
      :key="product.IdProductAttribute"
    >
      <CardCartItem :product="product" :editable="editable" :checkout="checkout" />
      <hr class="my-4" />
    </div>
    <div class="flex flex-col gap-3">
      <CardCartPromoCode
        v-for="promocode in promoCodes"
        :key="promocode.IdPromoCode"
        :promocode="promocode"
        :size="mini ? 'small' : 'medium'"
        @onCodeRemoved="refreshCodePromo()"
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
