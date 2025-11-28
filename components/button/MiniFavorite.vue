<script setup lang="ts">
const appStore = useAppStore();
const favoriteStore = useFavoritesStore();

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const { miniFavoriteVisible } = toRefs(appStore);
const { favorite } = toRefs(favoriteStore);

const { iconColor, onlyIcon } = defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
  onlyIcon: {
    type: Boolean,
    default: false,
  },
  showTextOnTop: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <BaseButton
    :icon="onlyIcon"
    :textOnTop="showTextOnTop ? favorite.TotalProduct : ''"
    :textOnTopColor="iconColor"
    @click="miniFavoriteVisible = !miniFavoriteVisible"
    :title="$t('button.favorite')"
  >
    <span class="flex items-center">
      <IconFavorite :style="{ color: iconColor }" />
      <span v-if="!onlyIcon" class="text-xs mt-1 ml-1">
        {{ $t('button.favorite') }}
        <span v-if="windowWidth < 992 && favorite.TotalProduct">({{ favorite.TotalProduct }})</span>
      </span>
    </span>
  </BaseButton>
</template>

<style lang="scss"></style>
