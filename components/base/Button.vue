<template>
  <button
    class="baseButton"
    :class="[...classes, size, type, { plain, relative: textOnTop }]"
    v-bind="$attrs"
    :title="title"
    :type="submit ? 'submit' : 'button'"
  >
    <span v-if="$slots.iconLeft" class="baseButton-icon">
      <slot name="iconLeft" />
    </span>

    <slot />

    <span v-if="$slots.iconRight" class="baseButton-icon">
      <slot name="iconRight" />
    </span>
    <span
      class="textOnTop"
      v-if="textOnTop"
      :style="{
        color: textOnTopColor === 'white' ? 'black' : 'white',
        backgroundColor: textOnTopColor === 'white' ? 'white' : 'black',
      }"
    >
      {{ textOnTop }}
    </span>
  </button>
</template>
<script setup lang="ts">
const { icon, textOnTop, size, type, plain } = defineProps({
  submit: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String as () => 'primary' | 'white' | 'danger',
  },
  title: {
    type: String,
    default: 'cta',
  },
  plain: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: Boolean,
    default: false,
  },
  textOnTop: {
    type: [String, Number],
  },
  textOnTopColor: {
    type: String,
    default: 'black',
  },
  size: {
    type: String as () => 'small' | 'medium' | 'large',
    default: 'medium',
  },
});

const classes = computed((): String[] => {
  const classList: String[] = [];
  if (icon) {
    classList.push('baseButton--icon');
  }
  return classList;
});
</script>

<style lang="scss">
$baseButton: '.baseButton';
#{$baseButton} {
  @apply px-3 h-11  cursor-pointer
  flex gap-x-2 items-center justify-center 
  uppercase text-center font-light tracking-wider duration-150 pb-1 pt-1;

  &:disabled {
    @apply bg-gray-200 text-gray-300 cursor-not-allowed;
  }
  &.primary {
    @apply border border-black bg-black text-white;

    &:disabled {
      @apply bg-gray-888 border-gray-888;
    }
    &.plain {
      @apply border border-black bg-transparent text-black;
      &:hover {
        @apply bg-primary text-white;
      }
      &:disabled {
        @apply bg-slate-100;
        --tw-bg-opacity: 0.7;
        --tw-border-opacity: 0.4;
        --tw-text-opacity: 0.6;
      }
    }
  }

  &.white {
    @apply border border-white bg-white text-primary;

    &:disabled {
      --tw-bg-opacity: 0.7;
      --tw-border-opacity: 0;
      --tw-text-opacity: 0.6;
    }
    &.plain {
      @apply border border-white bg-transparent text-white;
      &:disabled {
        @apply bg-slate-100;
        --tw-bg-opacity: 0.7;
        --tw-border-opacity: 0.4;
        --tw-text-opacity: 0.6;
      }
    }
  }
  &.danger {
    @apply border border-red-500 bg-red-500 text-primary;

    &:disabled {
      --tw-bg-opacity: 0.7;
      --tw-border-opacity: 0;
      --tw-text-opacity: 0.6;
    }
    &.plain {
      @apply border border-red-500 bg-transparent text-red-500;
      &:disabled {
        @apply bg-slate-100;
        --tw-bg-opacity: 0.7;
        --tw-border-opacity: 0.4;
        --tw-text-opacity: 0.6;
      }
    }
  }
  &.small {
    @apply px-3 h-8 text-xs;
  }
  &.medium {
    @apply text-sm;
  }
  &.large {
    @apply px-3 h-14 text-base;
  }

  &.baseButton--icon {
    @apply w-11 h-11 flex justify-center items-center px-0;

    &.small {
      @apply w-8 h-8 text-sm;
      &:disabled {
        --tw-bg-opacity: 0.7;
        --tw-border-opacity: 0;
        --tw-text-opacity: 0.6;
      }
    }

    &.medium {
      @apply text-base;
    }

    &.large {
      @apply w-11 h-11 text-lg;
    }

    .iconify {
      font-size: 1.5rem;
    }
  }
  &-icon {
    @apply leading-none;
    font-size: inherit;
    &.small {
      @apply px-0 h-8 w-8 text-sm;
    }
  }
  .textOnTop {
    @apply absolute top-[8px] right-[8px]
    rounded-full h-3 w-3 pt-[1px]
     text-[8px] leading-[1.4];
  }
}
</style>
