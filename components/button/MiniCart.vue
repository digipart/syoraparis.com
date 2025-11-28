<script setup lang="ts">
const appStore = useAppStore();
const cartStore = useCartStore();

const { miniCartVisible } = toRefs(appStore);
const { totalProductQuantity } = toRefs(cartStore);

const { iconColor } = defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
});
</script>

<template>
  <BaseButton
    icon
    :textOnTop="totalProductQuantity"
    :textOnTopColor="iconColor"
    @click="miniCartVisible = !miniCartVisible"
  >
    <IconCart :style="{ color: iconColor }" />
  </BaseButton>
</template>

<style lang="scss"></style>
