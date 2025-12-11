<template>
  <div class="cardProduct-colors">
    <ul>
      <li
        v-for="productR in relationshipProducts?.slice(0, max)"
        :key="productR.IdProduct"
      >
        <NuxtLink
          v-if="link"
          :to="getProductUrl(productR)"
          class="cardProduct-color"
          :class="[size, { active: productR.IdProduct === activeIdProduct }]"
          :style="{
            backgroundColor: getRandomHexColor(),
          }"
        >
        </NuxtLink>
        <span
          v-else
          class="cardProduct-color"
          :class="[size, { active: productR.IdProduct === activeIdProduct }]"
          :style="{
            backgroundColor: getRandomHexColor(),
          }"
          @click="colorSelected($event, productR)"
        >
        </span>
      </li>
      <li
        v-if="
          maxToShow &&
          relationshipProducts?.length &&
          relationshipProducts?.length > maxToShow
        "
      >
        <span class="text-xxs lg:text-xs block hover:underline">
          +{{ relationshipProducts?.length - maxToShow }}
        </span>
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import type { ProductType } from '~/types/ProductType';

const { product, size, max } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
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

const getRandomHexColor = (): string => {
  return `#ffffff`;
};

const relationshipProducts = computed(() => {
  return product?.Relationship?.Child;
});

const colorSelected = ($event: MouseEvent, product: ProductType) => {
  $event.preventDefault();
  emit('colorClick', product);
};

const maxToShow = computed(() => {
  if (max) {
    return max;
  }
  return relationshipProducts.value?.length || 0;
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
