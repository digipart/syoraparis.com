<script setup lang="ts">
const menuStore = useMenuStore();
const { menu } = toRefs(menuStore);

const appStore = useAppStore();
const { sideMenuVisible } = toRefs(appStore);

const headerStore = useHeaderStore();
const { headerHeight } = toRefs(headerStore);

const { iconColor } = defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
});

const localePath = useLocalePath();

const tabsOpened = ref(['none']);

// const tabActive = computed(() => {
//   return tabsOpened.value[tabsOpened.value.length - 1];
// });

const setActive = (index: string) => {
  tabsOpened.value.push(index);
};

const back = () => {
  tabsOpened.value.pop();
};

watch(
  () => sideMenuVisible.value,
  (newValue) => {
    if (!newValue) {
      tabsOpened.value = ['none'];
    }
  }
);
</script>

<template>
  <div class="sideMenu">
    <BaseButton
      @click="sideMenuVisible = !sideMenuVisible"
      icon
      :title="$t('button.menu')"
      :style="{ color: iconColor }"
    >
      <IconBurger v-if="!sideMenuVisible" />
      <IconX v-else />
    </BaseButton>

    <BaseDrawer
      v-model="sideMenuVisible"
      size="100%"
      maxSize="600px"
      position="left"
      :closeButton="false"
      class="sideMenu-drawer"
      :style="{
        top: headerHeight + 'px',
        height: `calc(100dvh - ${headerHeight + 'px'})`,
      }"
      bodyPadding="0px"
    >
      <div id="sideMenuBody" class="sideMenu-body">
        <ul v-if="menu" class="sideMenu-nav sideMenu-top">
          <li v-for="tab in menu?.TabBarDatas" :key="tab.IdMenuTabBar">
            <NuxtLink
              :to="localePath('/' + tab.MenuTabBarURL)"
              class="sideMenu-link"
              @click="sideMenuVisible = false"
            >
              {{ tab.MenuTabBarName }}
            </NuxtLink>
            <template v-if="tab.MenuColumns?.length">
              <span
                class="sideMenu-iconsubmenu"
                @click="setActive(String(tab.IdMenuTabBar))"
              >
                <IconChevronRight :size="1.4" />
              </span>
              <div
                v-if="tabsOpened.includes(String(tab.IdMenuTabBar))"
                class="sideMenu-submenu"
              >
                <div class="sideMenu-submenu-title">
                  <span class="sideMenu-submenu-back" @click="back()">
                    <IconChevronLeft :size="1.2" />
                  </span>
                  {{ tab.MenuTabBarName }}
                </div>
                <div>
                  <ul>
                    <li
                      v-for="stab in tab.MenuColumns"
                      :key="stab.IdMenuColumn"
                    >
                      <ul>
                        <li
                          v-for="tabElement in stab.MenuGroupElements"
                          :key="tabElement.IdMenuGroupElement"
                        >
                          <!-- <BaseHr
                            class="sideMenu-coltitle"
                            :label="tabElement.MenuGroupElementName"
                            position="start"
                          /> -->
                          <ul class="sideMenu-nav">
                            <li
                              v-for="mElem in tabElement.MenuElements"
                              :key="mElem.IdMenuElement"
                            >
                              <NuxtLink
                                :to="localePath('/' + mElem.MenuElementURL)"
                                class="sideMenu-link"
                                @click="sideMenuVisible = false"
                              >
                                <span>
                                  {{ mElem.MenuElementName }}
                                </span>
                                <NuxtImg
                                  v-if="mElem.Media?.Images?.menu_medium?.Src"
                                  :src="mElem.Media?.Images?.menu_medium?.Src"
                                  :alt="mElem.MenuElementName"
                                  :width="
                                    mElem.Media?.Images?.menu_medium?.Width
                                  "
                                  :heighrt="
                                    mElem.Media?.Images?.menu_medium?.Height
                                  "
                                  class="w-36 mt-1"
                                />
                              </NuxtLink>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </template>
          </li>
        </ul>
        <div class="sideMenu-bottom">
          <div class="border-t border-black px-5 py-5">
            <span class="text-sm font-normal block mb-3">
              {{ $t('label.newsletter') }}
            </span>
            <FormNewsLetter />
            <p class="text-xs font-light mt-2">
              {{ $t('account.newsletter.discription') }}
            </p>
          </div>
          <div class="border-t border-black px-1 py-1">
            <ButtonAccount
              @click="sideMenuVisible = !sideMenuVisible"
              :showTextOnTop="false"
            />
            <ButtonMiniFavorite
              @click="sideMenuVisible = !sideMenuVisible"
              :iconColor="iconColor"
              :showTextOnTop="false"
            />
          </div>
          <div class="border-t border-black">
            <ButtonLanguage />
          </div>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<style lang="scss">
$sideMenu: '.sideMenu';
#{$sideMenu} {
  &-body {
    @apply h-full relative
    flex flex-col justify-between;
  }
  &-bottom {
  }
  &-drawer {
    &.drawer {
      .languageModal-btn {
        @apply text-sm px-5 py-3;
      }
    }
  }
  &-nav {
    @apply flex flex-col py-[1px] mt-[-1px];
    > li {
      @apply flex border-b border-t border-primary mt-[-1px];
    }
  }
  &-link {
    @apply min-h-10 flex-1 flex flex-col justify-center py-2 px-5 text-sm font-normal uppercase;
  }
  &-iconsubmenu {
    @apply w-10 flex justify-center items-center;
  }
  &-submenu {
    @apply absolute top-0 left-0 w-full h-full z-10 bg-white;

    &-title {
      @apply text-xl font-medium flex items-center;
    }
    &-back {
      @apply h-14 w-14 flex justify-center items-center;
    }
  }
  &-coltitle {
    @apply text-sm font-normal text-black;
    --tw-text-opacity: 0.3;
  }
}
</style>
