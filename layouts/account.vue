<script setup lang="ts">
const headerStore = useHeaderStore();
const { menuBackground, menuLogo, headerHeight } = toRefs(headerStore);
const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

menuLogo.value = 'text';
</script>

<template>
  <div :class="['accountLayout']" :style="{ paddingTop: headerHeight + 'px' }">
    <BaseLoading />
    <LayoutAppHeader
      class="accountLayout-header"
      :show-account="windowWidth > 991"
      :show-langue="windowWidth > 991"
    />
    <LayoutMiniCart />
    <LayoutMiniFavorite />
    <main>
      <LayoutContainer full class="mt-8 mb-8">
        <LayoutAccountMenu class="mb-5" />
        <slot></slot>
      </LayoutContainer>
    </main>
    <LayoutAppFooter />
  </div>
</template>

<style lang="scss">
$accountLayout: '.accountLayout';

#{$accountLayout} {
}
</style>
