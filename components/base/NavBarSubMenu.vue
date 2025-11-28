<template>
  <div v-if="items.length" class="submenu supcat text-black">
    <div class="submenu-wrapper">
      <div class="container mx-auto px-0 lg:px-3">
        <div class="grid grid-cols-12 submenu-container">
          <template v-if="items.length > 1">
            <!-- Left Column -->
            <div
              class="col-span-12 lg:col-span-3 submenu-item submenu-item-categories"
            >
              <div class="wrapper">
                <span class="menu-title">
                  {{ leftItems?.MenuColumnName }}
                </span>

                <div v-for="groupElem in leftItems?.MenuGroupElements">
                  <span class="group-title">
                    {{ groupElem.MenuGroupElementName }}
                  </span>

                  <NuxtLink
                    v-for="item in groupElem.MenuElements"
                    :key="item.IdMenuElement"
                    :to="getSafeLink(item.MenuElementURL)"
                    class="menu-link"
                  >
                    <span @click="emit('linkClick', $event)">
                      {{ item.MenuElementName }}
                    </span>
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Center Column -->
            <div
              class="col-span-12 lg:col-span-3 submenu-item submenu-item-categories"
            >
              <div class="wrapper">
                <span class="menu-title">
                  {{ centerItems?.MenuColumnName }}
                </span>
                <div class="grid grid-cols-12 gap-x-2">
                  <div
                    v-for="groupElem in centerItems?.MenuGroupElements"
                    class="col-span-12 lg:col-span-6"
                  >
                    <span class="group-title">
                      {{ groupElem.MenuGroupElementName }}
                    </span>
                    <template v-if="groupElem?.MenuElements?.length">
                      <div class="grid grid-cols-12">
                        <div class="col-span-6 lg:col-span-12">
                          <NuxtLink
                            v-for="(item, index) in getFirstHalf(
                              groupElem.MenuElements
                            )"
                            :key="`left-${index}`"
                            :to="getSafeLink(item.MenuElementURL)"
                            class="menu-link"
                          >
                            <span @click="emit('linkClick', $event)">
                              {{ item.MenuElementName }}
                            </span>
                          </NuxtLink>
                        </div>
                        <div class="col-span-6 lg:col-span-12">
                          <NuxtLink
                            v-for="(item, index) in getSecondHalf(
                              groupElem.MenuElements
                            )"
                            :key="`right-${index}`"
                            :to="getSafeLink(item.MenuElementURL)"
                            class="menu-link"
                          >
                            <span @click="emit('linkClick', $event)">
                              {{ item.MenuElementName }}
                            </span>
                          </NuxtLink>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div
              v-if="rightItems"
              class="col-span-12 lg:col-span-6 submenu-item"
            >
              <span class="menu-title">
                {{ rightItems.MenuColumnName }}
              </span>
              <div v-for="groupElem in rightItems.MenuGroupElements">
                <span class="group-title">
                  {{ groupElem.MenuGroupElementName }}
                </span>
                <div class="grid grid-cols-12 gap-x-2">
                  <div
                    v-for="(item, index) in groupElem.MenuElements"
                    :key="`left-${index}`"
                    class="col-span-6"
                  >
                    <NuxtLink
                      :to="getSafeLink(item.MenuElementURL)"
                      class="menu-link-with-image"
                    >
                      {{ item.MenuElementName }}
                      <img
                        class="mt-2 w-full"
                        :src="getImage(item.Media)?.Src"
                        :alt="item.MenuElementName"
                        :title="item.MenuElementName"
                        width="278"
                        height="185"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </template>

          <!-- Single Column Layout -->
          <template v-else>
            <div
              v-if="rightItems"
              class="col-span-12 lg:col-span-12 submenu-item"
            >
              <span class="menu-title">
                {{ rightItems.MenuColumnName }}
              </span>
              <div v-for="groupElem in rightItems.MenuGroupElements">
                <span class="group-title">
                  {{ groupElem.MenuGroupElementName }}
                </span>
                <div class="grid grid-cols-10 gap-x-2">
                  <div
                    v-for="(item, index) in groupElem.MenuElements"
                    :key="`left-${index}`"
                    class="col-span-5 lg:col-span-2"
                  >
                    <NuxtLink
                      :to="getSafeLink(item.MenuElementURL)"
                      class="menu-link-with-image"
                    >
                      {{ item.MenuElementName }}
                      <img
                        v-if="getImage(item.Media)"
                        class="mt-2 w-full"
                        :src="getImage(item.Media)?.Src"
                        :alt="item.MenuElementName"
                        :title="item.MenuElementName"
                        width="278"
                        height="185"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { MenuItem, MenuMedia, MenuElement } from '~/types/MenuType';

const props = defineProps<{
  idMenuColumn?: number;
  items: MenuItem[];
}>();

const emit = defineEmits<{
  (e: 'linkClick', event: Event): void;
}>();

const localePath = useLocalePath();

const leftItems = computed(() => props.items[0] || null);
const centerItems = computed(() => props.items[1] || null);
const rightItems = computed(() => {
  if (props.items.length > 2) {
    return props.items[2];
  } else if (props.items.length === 1) {
    return props.items[0];
  }
  return null;
});

const getImage = (media?: MenuMedia) => {
  try {
    return media?.Images.menu_medium;
  } catch (error) {
    return null;
  }
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

const getFirstHalf = (elements: MenuElement[]) => {
  return elements.slice(0, Math.ceil(elements.length / 2));
};

const getSecondHalf = (elements: MenuElement[]) => {
  return elements.slice(Math.ceil(elements.length / 2));
};
</script>

<style lang="scss">
.submenu {
  @apply absolute left-0 w-full text-black border-b border-black;
  top: calc(100% - 20px);
  padding-top: 20px;

  @screen lgMax {
    @apply static pt-0;
  }

  &-wrapper {
    @apply bg-white border border-r-0;

    @screen lgMax {
      @apply border-none;
    }
  }

  &-container {
    @apply max-w-[1680px];
  }

  &-item {
    @apply border-r border-black min-h-[405px] px-24 pt-14 pb-6;

    @screen lgMax {
      @apply border-r-0 min-h-0 p-0;
    }

    &:last-child {
      @apply border-none;
    }

    &-categories {
      @apply px-[18px];

      @screen lgMax {
        @apply px-0;
      }

      .wrapper {
        @apply max-w-[260px] mx-auto;

        @screen lgMax {
          @apply max-w-full m-0;
        }
      }
    }
  }
}

.menu-title {
  @apply block uppercase  font-bold mb-2 cursor-default;
}

.group-title {
  @apply block uppercase text-base  mb-2 font-bold cursor-default;
}

.menu-link {
  @apply block uppercase text-base  mb-3 transition-all duration-150;

  &:hover {
    @apply text-gray-600;
  }
}

.menu-link-with-image {
  @apply block text-base pb-2 transition-all duration-150;

  &:hover {
    @apply text-gray-600;

    img {
      @apply opacity-60;
    }
  }

  img {
    @apply transition-opacity duration-150;
  }
}
</style>
