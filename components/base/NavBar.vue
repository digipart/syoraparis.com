<template>
  <div>
    <ul v-if="menuTabs" class="flex flex-row">
      <li
        v-for="(item, index) in menuTabs"
        :key="item?.IdMenuTabBar"
        class="nav-link-wrapper"
        :class="{ 'nav-link-wrapper--active': hoveredIndex === index }"
        @mouseenter="handleMouseEnter(index)"
        @mouseleave="handleMouseLeave"
        @click="clearHovered"
      >
        <NuxtLink
          :to="getSafeLink(item?.MenuTabBarURL)"
          class="relative nav-link"
        >
          {{ item?.MenuTabBarName }}
          <IconChevronDown
            v-if="item?.MenuColumns?.length"
            class="nav-icon-down"
            :size="1"
          />
        </NuxtLink>
        <BaseNavBarSubMenu
          v-if="item?.MenuColumns?.length"
          :id-menu-column="item?.IdMenuTabBar"
          :items="item?.MenuColumns"
          @link-click="clearHovered"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const menuStore = useMenuStore();
const { menu } = toRefs(menuStore);
const localePath = useLocalePath();

const hoveredIndex = ref(-1);

const emit = defineEmits(['hoverEnter', 'hoverOut']);

// Props or store data would go here

const menuTabs = computed(() => {
  return menu.value?.TabBarDatas || [];
});

const handleMouseEnter = (index: number) => {
  hoveredIndex.value = index;
  emit('hoverEnter', index);
};

const handleMouseLeave = () => {
  hoveredIndex.value = -1;
  emit('hoverOut');
};

const clearHovered = () => {
  hoveredIndex.value = -1;
};

const getSafeLink = (link?: string) => {
  if (link?.includes('http')) {
    const parsedUrl = new URL(link);
    return parsedUrl.pathname;
  } else {
    return localePath({
      name: 'categorylink',
      params: {
        categorylink: link,
      },
    });
  }
};
</script>

<style lang="scss">
.nav-link-wrapper {
  @apply px-4;

  &--icon {
    @apply px-2 mx-0.5 h-10 w-10 rounded-full flex items-center justify-center bg-white transition-all duration-150 cursor-pointer;

    @screen lg {
      &.lg\:hidden {
        @apply hidden;
      }
    }

    &:hover {
      @apply shadow-md;
    }

    span,
    a {
      @apply leading-none;
    }
  }

  &--search {
    @screen lgMax {
      @apply left-10 top-1/2 -translate-y-1/2;
    }
  }

  &--language {
    @screen lgMax {
      @apply left-[70px] top-1/2 -translate-y-1/2;
    }

    .langue-select-icon {
      @apply align-middle;
    }
  }

  a,
  span {
    @apply tracking-wide font-secondary text-base leading-none cursor-pointer z-[2];
    font-family: var(--font-secondary);
  }

  .supcat {
    @apply opacity-0 pointer-events-none transition-all duration-300;
  }

  &--active {
    .supcat {
      @apply opacity-100 pointer-events-auto;
    }
  }
}

.nav-icon-down {
  @apply inline-block ml-1 transition-transform duration-150;
}

.nav-link {
  @apply flex items-center;

  &:hover .nav-icon-down {
    @apply transform rotate-180;
  }
}
</style>
