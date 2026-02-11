<script lang="ts" setup>
import type { ProductType, Variant } from '~/types/ProductType';

const cartStore = useCartStore();
const { addToCart } = cartStore;

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
  label: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['onSizeSelected']);

const variants = computed(() => {
  return product?.Variant;
});

const addToCartHandler = (variant: Variant) => {
  const idProductAttributeSelected = variant?.Combination?.IdProductAttribute;
  if (product?.IdProduct && idProductAttributeSelected) {
    addToCart({
      idProduct: product?.IdProduct,
      idProductAttribute: idProductAttributeSelected,
      product: product,
    }).then((data) => {
      emit('onSizeSelected');
    });
  }
};
</script>

<template>
  <div class="cardProduct-sizes">
    <div v-if="label" class="uppercase font-normal py-3 px-2 text-xs">
      {{ $t('titles.select_a_size') }} :
    </div>

    <ul class="cardProduct-sizes-body">
      <li
        v-for="(variant, index) in variants"
        :key="index"
        class="cardProduct-sizes-cel"
        @click="addToCartHandler(variant)"
      >
        <template v-for="attr in variant?.Combination?.Attributes">
          <div v-if="attr.GroupName === 'Size'">
            {{ attr.AttributeName }}
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
$cardProduct-sizes: '.cardProduct-sizes';
#{$cardProduct-sizes} {
  &-body {
    @apply border-black border-t 
    flex flex-wrap;
  }
  &-cel {
    @apply w-1/3 px-2 py-3 border-b border-black duration-150
    text-center text-xs border-r font-light cursor-pointer;
    &:nth-child(3n) {
      @apply border-r-0;
    }

    &:active,
    &:hover {
      @apply bg-black text-white;
    }
  }
}
</style>
