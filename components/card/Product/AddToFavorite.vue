<script lang="ts" setup>
import type { ProductType } from '~/types/ProductType';
const favoriteStore = useFavoritesStore();
const { isProductFavorite, addToFavorite, removeFromFavorite } = favoriteStore;

const appStore = useAppStore();
const { miniFavoriteVisible } = toRefs(appStore);

const { product, type, size } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },

  type: {
    type: String as () => 'primary' | 'white',
  },
  colorIcon: {
    type: String,
    default: 'white',
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium',
  },
});

const loading = ref(false);

const inFavorite = computed(() => {
  if (product?.IdProduct) {
    return isProductFavorite(product?.IdProduct);
  }
  return false;
});

const favoritToggle = async (event: any) => {
  event.preventDefault();
  loading.value = true;
  if (product?.IdProduct) {
    if (inFavorite.value) {
      await removeFromFavorite(product?.IdProduct);
    } else {
      try {
        await addToFavorite(product?.IdProduct);
        miniFavoriteVisible.value = true;
      } catch (error) {}
    }
  }
  loading.value = false;
};
</script>

<template>
  <BaseButton
    icon
    @click="favoritToggle"
    :title="$t('button.favorite')"
    :type="type"
    :size="size"
    v-loading="loading"
    v-bind="$attrs"
  >
    <IconFavoriteFill v-if="inFavorite" :size="1.3" :color="colorIcon" />
    <IconFavorite v-else :size="1.3" :color="colorIcon" />
  </BaseButton>
</template>
<style lang="scss"></style>
