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
  <div class="checkoutLayout">
    <BaseLoading />
    <LayoutAppHeaderCheckout />
    <main>
      <slot></slot>
    </main>
  </div>
</template>

<style lang="scss">
$checkoutLayout: '.checkoutLayout';

#{$checkoutLayout} {
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

  main {
    background-color: #f4f4f4;
  }
}

.checkout-left {
  @apply pr-5 lg:pr-10 pl-5 pb-16 pt-5 lg:pt-10;
  .box {
    @apply max-w-[650px] mr-auto lg:mr-0 ml-auto;
  }
}

.checkout-right {
  @apply lg:sticky top-[2.5rem] pt-9 pl-5 lg:pl-10 pr-5 min-h-screen bg-white pb-16;
  .box {
    @apply max-w-[650px] lg:max-w-[470px] ml-auto lg:ml-0 mr-auto;
  }
}
</style>
