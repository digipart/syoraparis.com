<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const hovered = ref(false);

type MenuItemType = {
  label: string;
  name: string;
  icon?: Component;
  routesNameActives?: string[];
};
const { item } = defineProps<{
  item: MenuItemType;
}>();

// const routesNameActives = ['account-orders', 'account-returns'];

const active = computed(() => {
  //   return route.name === `${item.name}___${locale.value}`;

  return item.routesNameActives?.some((i) => {
    return route.name === `${i}___${locale.value}`;
  });
});
</script>

<template>
  <NuxtLink
    :to="localePath(item.name)"
    class="accountMenu-item parent"
    :class="{ active: active, hovered: hovered }"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <component
      :is="item.icon"
      class="mr-1"
    />
    {{ item.label }}
  </NuxtLink>
</template>
<style lang="scss">
$accountMenu: '.accountMenu';

#{$accountMenu} {
  &-item {
    @apply flex items-center
    border border-gray-888 py-1.5 pr-4 pl-2
    text-gray-888 duration-150 text-xs;

    @screen lg {
      @apply py-1.5 pr-3 pl-2 text-sm;
    }

    &.active {
      @apply border-black text-black;
    }

    &.hovered {
      @apply bg-black text-white border-black;
    }
  }
}
</style>
