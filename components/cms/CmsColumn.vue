<template>
  <div :class="['lg_' + desktop, 'md_' + tablet, mobile]">
    <slot />
  </div>
</template>

<script setup lang="ts">
import type { CmsColumnType } from '~/types/cms/CmsColumnType';

const { column } = defineProps<{
  column?: CmsColumnType;
}>();

// Set default values for `column`
const defaultColumn = {
  mobile: 'col_12',
  tablet: 'col_12',
  desktop: 'col_12',
};

const { mobile, tablet, desktop } = column ?? defaultColumn;
</script>

<style lang="scss">
$cols: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);

@each $col in $cols {
  .lg_col_#{$col} {
    @apply col-span-#{$col};
  }
  .md_col_#{$col} {
    @screen mdMax {
      @apply col-span-#{$col};
    }
  }
  .col_#{$col} {
    @screen smMax {
      @apply col-span-#{$col};
    }
  }
}
</style>
