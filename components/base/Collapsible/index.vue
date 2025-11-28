<template>
  <div class="collapsible">
    <slot />
  </div>
</template>

<script setup lang="ts">
const { indexActive = [] } = defineProps<{
  indexActive?: number[];
}>();

const openItems = ref<Set<number>>(new Set());

const toggleItem = (index: number, closeOthers: boolean) => {
  if (closeOthers) {
    openItems.value = new Set([index]);
  } else {
    const newSet = new Set(openItems.value);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    openItems.value = newSet;
  }
};

// indexActive?.map((item) => {
//   openItems.value.add(item);
// });

openItems.value = new Set(indexActive);

provide('openItems', openItems);
provide('toggleItem', toggleItem);
</script>

<style lang="scss">
.collapsible {
  @apply flex flex-col;

  .content {
    // overflow: hidden;
    transition: height 0.3s ease;
  }
}
</style>
