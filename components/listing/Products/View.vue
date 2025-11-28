<template>
  <div class="flex text-xs">
    <BaseButton
      icon
      @click="changeView('full')"
      :class="{ active: categoryListingView === 'full' }"
      :title="$t('button.full')"
      class="btn-view-full"
      size="small"
    >
      <IconRectangle />
    </BaseButton>
    <BaseButton
      icon
      @click="changeView('cols')"
      :class="{ active: categoryListingView === 'cols' }"
      :title="$t('button.cols')"
      size="small"
    >
      <IconCols />
    </BaseButton>
    <BaseButton
      icon
      @click="changeView('grid')"
      :class="{ active: categoryListingView === 'grid' }"
      :title="$t('button.grid')"
      size="small"
    >
      <IconGrid />
    </BaseButton>
  </div>
</template>
<script setup lang="ts">
const appStore = useAppStore();
const { categoryListingView } = toRefs(appStore);

const emit = defineEmits(['onChangeView']);


const changeView = (view: string) => {

  emit('onChangeView', {
    view,
  });
};
</script>
<style lang="scss" scoped>
.active {
  @apply relative;

  &::after {
    content: '';
    @apply absolute bottom-0 left-1/2
    w-full h-[1px]
    bg-black;

    width: calc(100% - 9.5px);
    transform: translateX(-50%);
  }
}

.btn-view-full {
  @screen lg {
    @apply hidden;
  }
}
</style>
