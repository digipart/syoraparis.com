<template>
  <NuxtLink :to="localePath('/')" :title="shopName" class="block">
    <NuxtImg v-if="whiteLogo" class="w-[100px] lg:w-[140px]" :src="logoLight" />
    <NuxtImg v-else class="w-[100px] lg:w-[140px]" :src="logoDark" />
  </NuxtLink>
</template>
<script setup lang="ts">
const headerStore = useHeaderStore();
const { menuBackground, menuColor } = toRefs(headerStore);

const appStore = useAppStore();
const { shopName, logoDark, logoLight } = toRefs(appStore);

const localePath = useLocalePath();

const { whiteLogo } = defineProps({
  whiteLogo: {
    type: Boolean,
    default: false,
  },
});
</script>
<style lang=""></style>
