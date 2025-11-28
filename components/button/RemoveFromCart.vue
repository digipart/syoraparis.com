<template>
  <span
    class="removeFromCart"
    @click.prevent="removeProduct()"
    v-loading="loading"
  >
    {{ $t('button.remove') }} <IconX :size="1.3" />
  </span>
</template>

<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const cartStore = useCartStore();
const { removeFromCart } = cartStore;

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

const loading = ref(false);

const removeProduct = () => {
  loading.value = true;
  if (product) {
    removeFromCart(product).finally(() => {
      loading.value = false;
    });
  }
};
</script>

<style lang="scss">
$removeFromCart: '.removeFromCart';

#{$removeFromCart} {
  @apply text-xs uppercase inline-block 
  underline cursor-pointer;

  .v-loading-spinner {
    @apply h-4;
  }
}
</style>
