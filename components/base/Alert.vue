<template>
  <div :class="[`alert alert-${type} ${size}`]">
    <div v-if="$slots.icon">
      <slot name="icon" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <div
      v-if="closeButton"
      class="cursor-pointer flex items-center justify-center"
      @click="$emit('onCloseClick')"
    >
      <IconX :color="iconColor" :size="1.3" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { type } = withDefaults(
  defineProps<{
    type?: 'primary' | 'default' | 'danger';
    closeButton?: boolean;
    size?: 'small' | 'medium';
  }>(),
  {
    type: 'primary',
    closeButton: true,
    size: 'medium',
  }
);

const iconColor = computed(() => {
  switch (type) {
    case 'danger':
      return '#ef4444';
    case 'primary':
      return 'black';
    default:
      return '#888888';
  }
});

// Provide a default value for the `type` prop
</script>

<style lang="scss">
.alert {
  @apply px-5 py-4 flex gap-3 border;
  &.alert-default {
    @apply border-gray-888 text-gray-888;
  }

  &.alert-primary {
    @apply border-primary text-primary;
  }

  &.alert-danger {
    @apply border-red-500 text-red-500;
  }

  &.small {
    @apply px-3 py-2 text-xs ;
  }
}
</style>
