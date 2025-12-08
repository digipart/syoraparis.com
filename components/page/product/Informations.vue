<script setup lang="ts">
import type { BreadCrumbType } from '~/components/layout/BreadCrumb.vue';
import { CategoryHelper } from '~/helpers/CategoryHelper';
import type { ProductType } from '~/types/ProductType';

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
});

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);
const pageProductInformations = ref<HTMLElement | null>(null);
const localePath = useLocalePath();

const addToCartBox = ref<HTMLElement | null>(null);
const addToCartBoxRect = ref<DOMRect | null>(null);

const addToCartSticky = ref(false);

const breadcrumbItems = computed(() => {
  const list: BreadCrumbType[] = [];
  const category = product.Category?.Main;
  if (category) {
    const categoryHelper = new CategoryHelper(category);

    list.push({
      text: categoryHelper.getSeo()?.MetaTitle || '',
      link: categoryHelper.getUrl(),
    });
    list.push({
      text: product?.Description?.Title || '',
    });
  }
  return list;
});

const handleScroll = () => {
  getDivPosition();
};

const initRect = () => {
  if (addToCartBox.value) {
    const rect = addToCartBox.value.getBoundingClientRect();

    addToCartBoxRect.value = rect;
  }
};
const getDivPosition = () => {
  if (addToCartBox.value && addToCartBoxRect.value) {
    const rect = addToCartBox.value.getBoundingClientRect();

    if (rect.top < window.innerHeight - addToCartBoxRect.value.height) {
      addToCartSticky.value = false;
    } else {
      addToCartSticky.value = true;
    }
  }
};
onMounted(() => {
  if (windowWidth.value < 992) {
    initRect();
    getDivPosition();
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  if (windowWidth.value < 992) {
    window.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <div
    v-if="product"
    class="pageProductInformations"
    ref="pageProductInformations"
  >
    <div class="pageProductInformations-wrapper">
      <div class="mb-3">
        <LayoutBreadCrumb :items="breadcrumbItems" />
      </div>
      <div class="relative mb-3 pr-8">
        <CardProductTitle :product="product" size="lg" tag="h1" class="mb-0" />
        <div class="block text-xs mb-1 font-normal">
          <span class="text-gray-888 font-light">
            {{ $t('label.ref') }} :
          </span>
          <span>
            {{ product.Reference }}
          </span>
        </div>
        <div class="text-xs mb-1 lg:mb-4 font-normal">
          <span class="text-gray-888 font-light">
            {{ $t('label.brand') }} :
          </span>
          <NuxtLink
            class="underline"
            :to="
              localePath({
                name: 'brands-slug',
                params: {
                  slug: product.Brand?.Seo?.FriendlyURL,
                },
              })
            "
          >
            {{ product.Brand?.Name }}
          </NuxtLink>
        </div>
        <CardProductPrice :product="product" size="medium" />
        <div class="absolute -top-2 right-0">
          <CardProductAddToFavorite :product="product" />
        </div>
      </div>
      <div v-if="product?.Relationship?.Child?.length" class="mb-3 lg:mb-6">
        <label class="font-normal text-sm mb-2 inline-block"
          >{{ $t('label.color') }} :
        </label>
        <CardProductColors
          :product="product"
          :activeIdProduct="Number(product.IdProduct)"
          size="medium"
          link
        />
      </div>
      <div class="mb-5">
        <div class="justify-between gap-x-4 mb-2 hidden lg:flex">
          <label class="font-normal text-sm inline-block">
            {{ $t('label.size') }} :
          </label>
          <LayoutGuideSize />
        </div>
        <div class="w-full" ref="addToCartBox">
          <div
            class="pageProductInformations-addToCart py-3"
            :class="{ sticked: addToCartSticky }"
          >
            <PageProductSizes :product="product" class="" />
          </div>
        </div>
      </div>
      <div class="mb-3 lg:mb-5">
        <div
          class="flex cursor-pointer"
          @click="$emit('productDetailsClick', $event)"
        >
          <div class="mr-1">
            <IconPlus :size="1.4" />
          </div>
          <div class="flex flex-col text-xs font-normal pt-0.5">
            <span>{{ $t('label.productDetails') }}</span>
          </div>
        </div>
      </div>
      <div class="mb-3 lg:mb-5">
        <LayoutDeliveryInfo
          @click="scrollToElement(pageProductInformations, 100)"
        />
      </div>
      <div class="mb-3 lg:mb-5">
        <LayoutFaqInfo @click="scrollToElement(pageProductInformations, 100)" />
      </div>
      <div>
        <LayoutReservationInStore
          :product="product"
          @click="scrollToElement(pageProductInformations, 100)"
        />
      </div>
    </div>
    <div
      class="pageProductInformations-teleport"
      id="pageProductInformations-teleport"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
$pageProductInformations: '.pageProductInformations';

#{$pageProductInformations} {
  @apply px-5 py-5 flex items-center justify-center relative;
  @screen lg {
    height: calc(100vh - 3.5rem);
  }

  &-wrapper {
    @apply max-w-[37.5rem] w-full;
  }
  &-teleport {
  }
  .modal {
    @apply absolute left-1/2 top-[10%] w-full max-w-[37.5rem] -translate-x-1/2;
    height: calc(100% - 20%);
  }
}
</style>

<style lang="scss">
$pageProductInformations: '.pageProductInformations';

#{$pageProductInformations} {
  .modal {
    @apply absolute left-1/2 top-[10%] w-full max-w-[37.5rem] -translate-x-1/2;
    height: calc(100% - 20%);
  }

  &-addToCart {
    @apply w-full mx-0  border-t border-transparent relative;
    &.sticked {
      @apply fixed bottom-0 left-0 z-30 bg-white border-black px-5;
    }
  }
}
</style>
