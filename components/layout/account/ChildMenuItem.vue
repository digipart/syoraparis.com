<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const hovered = ref(false);

const active = computed(() => {
  return route.name === `${item.name}___${locale.value}`;
});

type MenuItemType = {
  label: string;
  name: string;
};

const { item } = defineProps<{ item: MenuItemType }>();
</script>

<template>
  <NuxtLink
    :to="localePath(item.name)"
    class="chileMenu-item"
    :class="{ active: active, hovered: hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    {{ item.label }}
  </NuxtLink>
</template>
<style lang="scss">
$chileMenu: '.chileMenu';

#{$chileMenu} {
  &-item {
    @apply text-xs uppercase text-gray-777;
    @screen lg {
      @apply text-sm;
    }

    &.active {
      @apply text-black font-normal;
    }
  }
}
</style>
