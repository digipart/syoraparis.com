<template>
  <div class="appheaderCheckout">
    <header class="appheaderCheckout-menu">
      <LayoutContainer small>
        <div class="flex gap-5 justify-between items-center">
          <BaseLogo :whiteLogo="false" />
          <div>
            <NuxtLink
              :to="
                localePath({
                  name: 'cart',
                })
              "
            >
              <IconCart />
            </NuxtLink>
          </div>
        </div>
      </LayoutContainer>
    </header>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

<style scoped lang="scss">
.appheaderCheckout {
  @apply fixed z-[100] w-full top-0;
  &-menu {
    @apply px-3 h-14 py-1.5  bg-white
  flex justify-between items-center
    duration-500 text-black;
  }
}
</style>
