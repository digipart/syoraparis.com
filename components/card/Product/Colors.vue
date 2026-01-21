<template>
  <div class="cardProduct-colors">
    <ul>
      <li>
        <NuxtLink
          v-if="link"
          :to="getProductUrl(product)"
          class="cardProduct-color"
          :class="[size, { active: product.IdProduct === activeIdProduct }]"
          :style="{
            backgroundColor: getRandomHexColor(product?.Variant?.[0]),
          }"
        >
        </NuxtLink>
        <span
          v-else
          class="cardProduct-color"
          :class="[size, { active: product.IdProduct === activeIdProduct }]"
          :style="{
            backgroundColor: getRandomHexColor(product?.Variant?.[0]),
          }"
          @click="colorSelected($event, product)"
        >
        </span>
      </li>
      <!-- <li
        v-if="
          maxToShow &&
          relationshipProducts?.length &&
          relationshipProducts?.length > maxToShow
        "
      >
        <span class="text-xxs lg:text-xs block hover:underline">
          +{{ relationshipProducts?.length - maxToShow }}
        </span>
      </li> -->
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { ProductType, Variant } from '~/types/ProductType';

const { product, size, max } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  activeIdProduct: {
    type: Number,
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'small',
  },
  max: {
    type: Number,
  },
  link: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['colorClick']);

const localePath = useLocalePath();

const getRandomHexColor = (variant: Variant | undefined): string => {
  if (variant) {
    return ProductHelper.getColor(variant) || '#ffffff';
  }
  return '#ffffff';
};

const colorSelected = ($event: MouseEvent, product: ProductType) => {
  $event.preventDefault();
  emit('colorClick', product);
};

const maxToShow = computed(() => {
  if (max) {
    return max;
  }
  return 100;
});

const getProductUrl = (p: ProductType) => {
  if (product?.Category?.Main) {
    const productHelper = new ProductHelper(p);
    return localePath(productHelper.getUrl(product?.Category?.Main));
  }
  return localePath('/#');
};
</script>
<style lang="scss">
.cardProduct {
  &-colors {
    ul {
      @apply flex gap-1 items-center;
      @media lg {
        @apply gap-2;
      }
    }
  }
  &-color {
    @apply h-5 w-5 block border;
  }
}
</style>
