<script setup lang="ts">
const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const appStore = useAppStore();
const { sideMenuVisible } = toRefs(appStore);

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
const updateMenuBackground = () => {
  menuBackground.value =
    shouldHeaderBeTransparent.value && !sideMenuVisible.value
      ? 'transparent'
      : 'default';
  // menuLogo.value = shouldHeaderBeTransparent.value ? 'svg' : 'text';
  menuLogo.value = 'text';
};

// Watch for changes
watch(shouldHeaderBeTransparent, updateMenuBackground);
watch(sideMenuVisible, updateMenuBackground);

// Run immediately
updateMenuBackground();
</script>

<template>
  <div
    :class="[
      'defaultLayout',
      { 'defaultLayout--transparent': shouldHeaderBeTransparent },
    ]"
    :style="{ paddingTop: headerHeight + 'px' }"
  >
    <BaseLoading />
    <LayoutAppHeader
      :show-account="windowWidth > 991"
      :show-langue="windowWidth > 991"
      class="defaultLayout-header"
    />
    <LayoutMiniCart />
    <LayoutMiniFavorite />
    <main>
      <slot></slot>
    </main>
    <LayoutAppFooter />
    <LayoutTopNewsLetter />
    <LayoutAbandonmentOfVisit />
  </div>
</template>

<style lang="scss">
$defaultLayout: '.defaultLayout';
</style>
