<script setup lang="ts">
const { editable = true } = defineProps<{
  editable?: boolean;
}>();

const favoriteStore = useFavoritesStore();
const { favorite } = toRefs(favoriteStore);

const products = computed(() => {
  return favorite.value.Products || [];
});
</script>

<template>
  <div class="favoriteItems">
    <div
      class="favoriteItems-item"
      v-for="product in products"
      :key="product.IdProductAttribute"
    >
      <CardProduct :product="product" image-size="small" direction="horizontal" :hasBorder="false" />
      <hr class="my-4" />
    </div>
  </div>
</template>

<style lang="scss">
$favoriteItems: '.favoriteItems';
#{$favoriteItems} {
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
