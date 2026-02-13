<script setup lang="ts">
export type BreadCrumbType = {
  link?: string;
  text: string;
};

const { items } = defineProps({
  items: {
    type: Array as PropType<BreadCrumbType[]>,
    required: true,
  },
});

const { t } = useI18n();
const localePath = useLocalePath();

type BreadCrump = {
  text: string;
  link?: string;
};

const bc = computed((): BreadCrump[] => {
  const list: BreadCrumbType[] = [
    {
      text: t('button.pagehome'),
      link: localePath({
        name: 'index',
      }),
    },
    ...items,
  ];

  return list;
});
</script>

<template>
  <ul class="breadcrumb">
    <li v-for="(item, index) in bc" key="index" class="breadcrumb-item">
      <NuxtLink v-if="item.link" :to="item.link">
        {{ item.text }}
      </NuxtLink>
      <span v-else class="text-gray-888">
        {{ item.text }}
      </span>
      <i v-if="index > 0" class="breadcrumb-icon">
        <IconChevronRight :size="1" />
      </i>
    </li>
  </ul>
</template>

<style lang="scss">
.breadcrumb {
  @apply flex items-center flex-wrap gap-y-1
  text-xs;
  &-item {
    @apply pl-5 relative;
    &:first-child {
      @apply pl-0;
    }

    a,
    span:not(.breadcrumb-icon) {
      @apply inline-block align-bottom;
      max-width: 10ch;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @screen lg {
        max-width: unset;
      }
    }
  }
  &-icon {
    @apply absolute left-1 top-1.5 -translate-y-1/2 h-5;
  }
}
</style>
