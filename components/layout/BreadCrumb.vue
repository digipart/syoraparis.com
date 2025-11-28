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
      <i v-if="index < bc.length - 1" class="breadcrumb-icon">
        <IconChevronRight />
      </i>
    </li>
  </ul>
</template>

<style lang="scss">
.breadcrumb {
  @apply flex items-center
  text-xs;
  &-item {
    @apply pr-5 relative;
  }
  &-icon {
    @apply absolute right-0 top-1/2 -translate-y-1/2;
  }
}
</style>
