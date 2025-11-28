<script setup lang="ts">
const headerStore = useHeaderStore();
const { menuBackground, menuLogo, headerHeight } = toRefs(headerStore);

const route = useRoute();
const { locale } = useI18n();

const transparentHeaderRoutes = ['index'];

const shouldHeaderBeTransparent = computed(() => {
  return transparentHeaderRoutes.some(
    (item) => `${item}___${locale.value}` === route.name
  );
});

// Function to update menuBackground
const updateMenuBackground = (isTransparent: boolean) => {
  menuBackground.value = isTransparent ? 'transparent' : 'emptyt';
  menuLogo.value = isTransparent ? 'svg' : 'text';
};

// Watch for changes
watch(shouldHeaderBeTransparent, updateMenuBackground);

// Run immediately
updateMenuBackground(shouldHeaderBeTransparent.value);
</script>

<template>
  <div class="emptyLayout" :style="{ paddingTop: headerHeight + 'px' }">
    <BaseLoading />
    <LayoutAppHeader
      class="emptytLayout-header"
      :show-account="false"
      :show-menu="false"
      :show-cart="false"
      :searchBox="false"
      back
      :topBanner="false"
    />
    <main>
      <slot></slot>
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style lang="scss">
$emptytLayout: '.emptyLayout';

#{$emptytLayout} {
  @apply pt-14;
  // &-header {
  //   @apply fixed z-[100] top-0 left-0 w-full;

  // &--transparent {
  //   @apply bg-transparent;
  // }
  // }
  //   &--transparent {
  //     @apply pt-0;
  //     // #{$emptytLayout} {
  //     //   &-header {
  //     //     @apply bg-transparent shadow-none;
  //     //   }
  //     // }
  //   }
}
</style>
