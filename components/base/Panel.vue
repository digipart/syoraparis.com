<template>
  <div class="panel">
    <div class="panel-header">
      <slot v-if="$slots.header" name="header" />
      <template v-else>
        <BaseHeadLine v-if="title" size="md" class="font-normal uppercase">
          {{ title }}
        </BaseHeadLine>
      </template>
    </div>
    <div class="panel-body" :style="{ padding: bodyPadding }"><slot /></div>
    <div v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { title } = defineProps({
  title: {
    type: String,
  },
  bodyPadding: {
    type: String,
    default: '1.24rem',
  },
});
</script>

<style lang="scss">
$panel: '.panel';

#{$panel} {
  @apply border border-black;

  &-header {
    @apply px-5 py-3 border-b  border-inherit;
  }
  &-body {
  }
}
</style>
