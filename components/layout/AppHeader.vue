<template>
  <div ref="appheader" class="appheader">
    <CmsTopBanner
      v-if="topBanner"
      v-show="showTopBanner"
      @onClose="topBannerClose"
    />
    <header
      class="appheader-menu"
      :class="{
        transparent:
          menuBackground === 'transparent' && appBarColor === 'transparent',
      }"
    >
      <div v-if="showMenu" class="appheader-left flex gap-x-1">
        <!-- <BaseLogo
          :whiteLogo="
            menuBackground === 'transparent' && appBarColor === 'transparent'
          "
          class="appheader-logosvg"
        /> -->

        <div class="block lg:hidden">
          <ButtonBurgerMenu v-if="showMenu" :iconColor="iconColor" />
        </div>
        <div class="hidden lg:block">
          <BaseNavBar
            @hover-enter="appBarColor = 'white'"
            @hover-out="appBarColor = 'transparent'"
          />
        </div>
        <span v-if="back" class="block lg:hidden">
          <BaseButton icon :title="$t('button.menu')" @click="backClick">
            <IconChevronLeft :color="iconColor" />
          </BaseButton>
        </span>
      </div>
      <div
        class="appheader-center flex"
        :class="[showMenu ? 'justify-center' : 'justify-start']"
      >
        <BaseLogo
          :whiteLogo="
            menuBackground === 'transparent' && appBarColor === 'transparent'
          "
        />
      </div>
      <div class="appheader-right flex gap-x-1">
        <ButtonSerachBox v-if="searchBox" :iconColor="iconColor" />
        <ButtonLanguage v-if="showLangue" :style="{ color: iconColor }" />

        <ButtonAccount
          v-if="showAccount"
          :iconColor="iconColor"
          :onlyIcon="true"
        />

        <ButtonMiniFavorite
          v-if="showCart"
          :iconColor="iconColor"
          :onlyIcon="true"
        />

        <ButtonMiniCart
          v-if="showCart"
          :iconColor="iconColor"
          :title="$t('button.cart')"
        />
      </div>
    </header>
  </div>
</template>

<script setup lang="ts">
const { showAccount, showCart, showMenu } = defineProps({
  showAccount: {
    type: Boolean,
    default: true,
  },
  showLangue: {
    type: Boolean,
    default: true,
  },
  showCart: {
    type: Boolean,
    default: true,
  },
  showMenu: {
    type: Boolean,
    default: true,
  },
  back: {
    type: Boolean,
    default: false,
  },
  topBanner: {
    type: Boolean,
    default: true,
  },
  searchBox: {
    type: Boolean,
    default: true,
  },
});

const localePath = useLocalePath();

const headerStore = useHeaderStore();
const { menuBackground, menuLogo, menuColor, backClick, headerHeight } =
  toRefs(headerStore);
const cmsShopSetting = useCmsShopSetting();

const appBarColor = ref<'white' | 'transparent'>('transparent');
const showTopBanner = ref(true);

const appheader = ref<HTMLElement>();

const iconColor = computed(() => {
  return menuColor.value === 'primary' || appBarColor.value === 'white'
    ? 'var(--color-primary)'
    : 'white';
});

const onScroll = () => {
  const scrollTop = window.scrollY;
  appBarColor.value = scrollTop > 100 ? 'white' : 'transparent';
  if (scrollTop > 100) {
    appBarColor.value = 'white';
    showTopBanner.value = false;
  } else {
    appBarColor.value = 'transparent';
    showTopBanner.value = true;
  }
};

const handleResize = () => {
  if (appheader.value) {
    headerHeight.value = appheader.value?.offsetHeight || 56;
  }
};
let resizeObserver: ResizeObserver;
onMounted(() => {
  window.addEventListener('scroll', onScroll);
  if (appheader.value) {
    resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(appheader.value);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  if (resizeObserver && appheader.value) {
    resizeObserver.unobserve(appheader.value);
  }
});

const topBannerClose = () => {
  headerHeight.value = appheader.value?.offsetHeight || 56;
};
</script>

<style lang="scss">
.appheader {
  @apply fixed z-[100] w-full top-0;
  &-menu {
    @apply px-2 h-14 py-1.5  bg-white
  flex justify-between items-center
  border-b-black border-b duration-500 text-black;
    &.transparent {
      @apply bg-transparent border-transparent text-white;
    }
  }

  &-left {
    flex: 0 0 40%;
  }
  &-center {
    flex: 0 0 20%;
  }
  &-right {
    flex: 0 0 40%;
    @apply flex justify-end;
  }

  &-logosvg {
    @apply absolute top-5 left-14 w-20;
    @screen lg {
      @apply w-28 top-6 left-16;
    }
    img {
    }
  }

  .baseButton.baseButton--icon {
    @screen smMax {
      @apply h-8 w-8;
    }
  }
  .baseButton .textOnTop {
    @screen smMax {
      @apply top-0.5 right-0.5;
    }
  }
}
</style>
