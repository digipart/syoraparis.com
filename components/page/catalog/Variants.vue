<script lang="ts" setup>
import type { ProductType, Variant } from '~/types/ProductType';

const cartStore = useCartStore();
const { addToCart } = cartStore;

const appStore = useAppStore();
const { miniCartVisible, miniFavoriteVisible } = toRefs(appStore);

const { product, openCartAfterAddProduct, showColor } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
  activeIdProduct: {
    type: Number,
  },
  openCartAfterAddProduct: {
    type: Boolean,
    default: true,
  },
  showColor: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['onVariantSelected', 'colorClick']);

const containers = ref<HTMLElement[] | null>(null);
const lines = ref<HTMLElement[] | null>(null);

const variants = computed(() => {
  return product?.Variant;
});

const addToCartHandler = (event: any, variant: Variant) => {
  event.preventDefault();
  if (variant.Quantity) {
    const idProductAttributeSelected = variant?.Combination?.IdProductAttribute;
    if (product?.IdProduct && idProductAttributeSelected) {
      addToCart({
        idProduct: product?.IdProduct,
        idProductAttribute: idProductAttributeSelected,
        product: product,
      }).then((data) => {
        if (openCartAfterAddProduct) {
          miniCartVisible.value = true;
        }
        miniFavoriteVisible.value = false;
      });
    }
  }
};

onMounted(() => {});
</script>

<template>
  <div
    class="pageCatalog-variants"
    @click="($event) => $event.stopPropagation()"
  >
    <ul class="pageCatalog-variants-body">
      <li
        v-for="(variant, index) in variants"
        :key="index"
        class="pageCatalog-variants-cel"
        @click="addToCartHandler($event, variant)"
        :class="{
          disabled: !variant.Quantity,
        }"
        ref="containers"
      >
        <span v-if="!variant.Quantity" ref="lines" class="line"></span>
        <template v-for="attr in variant?.Combination?.Attributes">
          <div type="primary" plain v-if="attr.GroupName === 'Size'">
            {{ attr.AttributeName }}
          </div>
        </template>
      </li>
    </ul>
    <CardProductColors
      v-if="product && showColor"
      :product="product"
      @colorClick="$emit('colorClick', $event)"
      :activeIdProduct="activeIdProduct"
    />
  </div>
</template>

<style lang="scss">
$pageCatalog-sizes: '.pageCatalog-variants';
#{$pageCatalog-sizes} {
  @apply flex justify-between items-center;
  &-body {
    @apply flex gap-x-2;
  }
  &-cel {
    @apply text-center font-light cursor-pointer
    duration-150 text-xs;

    &.disabled {
      @apply cursor-not-allowed text-stone-400;
    }

    &:hover {
      @apply underline;
    }
  }
}
</style>
