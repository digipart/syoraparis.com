<template>
  <div :class="[`alert alert-${type} ${size}`, fill ? 'fill' : '']">
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
    type?: 'primary' | 'default' | 'danger' | 'warning';
    closeButton?: boolean;
    size?: 'small' | 'medium';
    fill?: boolean;
  }>(),
  {
    type: 'primary',
    closeButton: true,
    size: 'medium',
    fill: false,
  }
);

const iconColor = computed(() => {
  switch (type) {
    case 'danger':
      return '#ef4444';
    case 'primary':
      return 'black';
    case 'warning':
      return '#ffc107';
    default:
      return '#888888';
  }
});

// Provide a default value for the `type` prop
</script>

<style lang="scss">
.alert {
  @apply px-5 py-4 flex items-start gap-3 border;
  &.alert-default {
    @apply border-zinc-400 text-zinc-400;

    &.fill {
      @apply bg-zinc-50 text-zinc-800;
    }
  }

  &.alert-primary {
    @apply border-primary text-primary;

    &.fill {
      @apply bg-primary text-white;
    }
  }

  &.alert-danger {
    @apply border-red-500 text-red-500;

    &.fill {
      @apply bg-red-500 text-white;
    }
  }

  &.alert-warning {
    @apply border-[#ffe0a3] text-[#ffc107];

    &.fill {
      @apply bg-[#fff9e6] text-[#c99700];
    }
  }

  &.small {
    @apply px-3 py-2 text-xs;
  }
}
</style>
