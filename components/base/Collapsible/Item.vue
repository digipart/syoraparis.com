<template>
  <div class="collap-item" :class="{ isOpen }">
    <div class="header" @click="toggle">
      <slot name="header" />
      <span class="collap-item-icon" v-if="!hideArrow">
        <IconChevronRight :size="1.2" />
      </span>
    </div>
    <div
      ref="content"
      class="content"
      :style="{ height: contentHeight }"
      :class="{
        'overflow-hidden': overflowHidden,
      }"
    >
      <slot name="content" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { index, closeOthers, hideArrow } = withDefaults(
  defineProps<{
    index: number | string;
    closeOthers: boolean;
    hideArrow?: boolean;
  }>(),
  {
    hideArrow: false,
    closeOthers: true,
  }
);

const emit = defineEmits<{
  (e: 'onOpen', index: number | string): void;
}>();

const openItems = inject<Ref<Set<number | string>>>('openItems')!;

const content = ref<HTMLDivElement | null>(null);
const isOpen = computed(() => openItems.value.has(index));
const contentHeight = ref('0px');
const overflowHidden = ref(!isOpen.value);

const toggle = () => {
  if (isOpen.value) {
    // Close the current item
    openItems.value.delete(index);
  } else {
    // Open the current item and possibly close others
    if (closeOthers) {
      openItems.value = new Set([index]);
    } else {
      openItems.value.add(index);
    }
  }
};

const updateHeight = () => {
  if (content.value) {
    // contentHeight.value = isOpen.value
    //   ? `${content.value.scrollHeight}px`
    //   : '0px';

    if (isOpen.value) {
      contentHeight.value = `${content.value.scrollHeight}px`;
      setTimeout(() => {
        overflowHidden.value = false;
        contentHeight.value = `auto`;
      }, 300);
    } else {
      contentHeight.value = `${content.value.scrollHeight}px`;
      setTimeout(() => {
        contentHeight.value = '0px';
        overflowHidden.value = true;
      }, 50);
    }
  }
};

onMounted(() => {
  if (isOpen.value) {
    contentHeight.value = `auto`;
  }
});
watch(isOpen, () => {
  if (isOpen.value) {
    emit('onOpen', index);
  }
  nextTick(updateHeight);
});
</script>

<style lang="scss">
.collap-item {
  @apply border border-black mb-[-1px];
  &-icon {
    @apply absolute top-3 right-3  w-6 h-6  duration-300 flex items-center justify-center;
  }

  &.isOpen {
    .collap-item {
      &-icon {
        @apply rotate-90;
      }
    }
  }
  .header {
    @apply relative cursor-pointer
    border-b border-black mb-[-1px] px-5 py-1.5 min-h-12 items-center flex;
  }
}
</style>
