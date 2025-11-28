<script lang="ts" setup>
import type { ProductOrderType } from '~/types/OrderType';
import type { ProductType } from '~/types/ProductType';

const { product, tag, size } = defineProps({
  product: {
    type: {} as PropType<ProductType> | PropType<ProductOrderType>,
  },
  tag: {
    type: String,
    default: 'h2',
  },
  lines: {
    type: Number,
    default: 1,
  },
  size: {
    type: String as () => 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '_2xl' | '_3xl',
    default: 'xs',
  },
});

const title = computed(() => {
  if ((product as ProductOrderType).Title) {
    return (product as ProductOrderType)?.Title;
  } else {
    return (product as ProductType)?.Description?.Title;
  }
});
</script>

<template>
  <BaseHeadLine
    :name="tag"
    :size="size"
    class="font-light uppercase"
    :lines="lines"
  >
    {{ title }}
  </BaseHeadLine>
</template>
<style lang="scss"></style>
