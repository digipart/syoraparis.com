<template>
  <div class="collapsible">
    <slot />
  </div>
</template>

<script setup lang="ts">
type CollapsibleIndex = number | string;

const props = withDefaults(
  defineProps<{
    indexActive?: CollapsibleIndex[];
  }>(),
  {
    indexActive: () => [],
  }
);

const openItems = ref<Set<CollapsibleIndex>>(new Set());

const toggleItem = (index: CollapsibleIndex, closeOthers: boolean) => {
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

watch(
  () => props.indexActive,
  (newIndexes) => {
    openItems.value = new Set(newIndexes);
  },
  {
    immediate: true,
    deep: true,
  }
);

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
