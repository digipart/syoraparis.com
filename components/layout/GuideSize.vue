<script setup lang="ts">
const isVisible = ref(false);
</script>

<template>
  <div class="guidesize">
    <label class="font-normal text-xxs lg:text-sm" @click="isVisible = true">
      {{ $t('component.guidesize.label') }}
    </label>
    <BaseDrawer v-model="isVisible" size="600px">
      <div>guidesize</div>
    </BaseDrawer>
  </div>
</template>

<style lang="scss">
.guidesize {
  @apply cursor-pointer;
}
</style>
