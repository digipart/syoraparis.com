<script setup lang="ts">
import CategoryService from '~/services/CategoryService';
import { scrollToElement } from '~/utils/scroll';
import type { MediaType } from '~/types/MediaType';
import type { ProductType } from '~/types/ProductType';

definePageMeta({
  keepalive: true,
});

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const productsViewedStore = useProductsViewedStore();
const { addProductToViewedStore, initProductViewedStore } = productsViewedStore;
const { productSViewed } = toRefs(productsViewedStore);
initProductViewedStore();

const productStore = useProductStore();
const { fetchProduct } = productStore;
// const { product, error, loading } = toRefs(productStore);

const loading = ref(false);
const error = ref(false);
const product = ref<ProductType | null>(null);

// onMounted(() => {
//   productStore.fetchProduct({ id: 6417, options: {} });
// });
const route = useRoute();

const productsSameStyle = ref<ProductType[]>([]);

const categoryService = new CategoryService();

const idProduct = computed((): number => {
  const permalink = route.params.permalink as string;
  const number = permalink.split('-').pop() || '';
  return Number(number);
});

const idCatgory = computed((): number => {
  const permalink = route.params.categorylink as string;
  const number = permalink.split('-').pop() || '';
  return Number(number);
});

const imagesXSmall = computed(() => {
  const image = product.value?.Media?.Images?.product_xsmall;

  if (image) {
    return image;
  } else {
    return [];
  }
});
const imagesLarge = computed(() => {
  const image = product.value?.Media?.Images?.product_large;

  if (image) {
    return image;
  } else {
    return [];
  }
});
const imagesXLarge = computed(() => {
  const image = product.value?.Media?.Images?.product_xlarge;

  if (image) {
    return image;
  } else {
    return [];
  }
});

const videos = computed(() => {
  return product.value?.Media?.Videos;
});

const mediasXS = computed((): MediaType[] => {
  const media: MediaType[] = [];
  let key = 0;
  
  // Find video with cover=true
  const coverVideo = videos.value?.find(video => video.Cover === true);
  // Find image with cover=true
  const coverImage = imagesXSmall.value?.find(image => image.Cover === true);
  
  // First priority: video with cover=true
  if (coverVideo) {
    media.push({
      src: coverVideo.Src,
      type: 'video',
      key: key++,
    });
  }
  
  // Add all images, skipping the cover image as it's already added
  if (imagesXSmall.value) {
    imagesXSmall.value.forEach(image => {
      // Skip the cover image if we already added it
      if (coverImage && image.Src === coverImage.Src && coverVideo) {
        return;
      }
      
      // If this is a cover image and no cover video exists, put it first
      if (image.Cover === true && !coverVideo && media.length === 0) {
        media.unshift({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      } else {
        media.push({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      }
    });
  }
  
  // Add remaining videos that aren't the cover video
  if (videos.value) {
    videos.value.forEach(video => {
      // Skip the cover video as it's already added
      if (coverVideo && video.Src === coverVideo.Src) {
        return;
      }
      
      media.push({
        src: video.Src,
        type: 'video',
        key: key++,
      });
    });
  }
  
  return media;
});
const medias = computed((): MediaType[] => {
  const media: MediaType[] = [];
  let key = 0;
  
  // Find video with cover=true
  const coverVideo = videos.value?.find(video => video.Cover === true);
  // Find image with cover=true
  const coverImage = imagesLarge.value?.find(image => image.Cover === true);
  
  // First priority: video with cover=true
  if (coverVideo) {
    media.push({
      src: coverVideo.Src,
      type: 'video',
      key: key++,
    });
  }
  
  // Add all images, skipping the cover image as it's already added
  if (imagesLarge.value) {
    imagesLarge.value.forEach(image => {
      // Skip the cover image if we already added it
      if (coverImage && image.Src === coverImage.Src && coverVideo) {
        return;
      }
      
      // If this is a cover image and no cover video exists, put it first
      if (image.Cover === true && !coverVideo && media.length === 0) {
        media.unshift({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      } else {
        media.push({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      }
    });
  }
  
  // Add remaining videos that aren't the cover video
  if (videos.value) {
    videos.value.forEach(video => {
      // Skip the cover video as it's already added
      if (coverVideo && video.Src === coverVideo.Src) {
        return;
      }
      
      media.push({
        src: video.Src,
        type: 'video',
        key: key++,
      });
    });
  }
  
  return media;
});

const mediasXl = computed((): MediaType[] => {
  const media: MediaType[] = [];
  let key = 0;
  
  // Find video with cover=true
  const coverVideo = videos.value?.find(video => video.Cover === true);
  // Find image with cover=true
  const coverImage = imagesXLarge.value?.find(image => image.Cover === true);
  
  // First priority: video with cover=true
  if (coverVideo) {
    media.push({
      src: coverVideo.Src,
      type: 'video',
      key: key++,
    });
  }
  
  // Add all images, skipping the cover image as it's already added
  if (imagesXLarge.value) {
    imagesXLarge.value.forEach(image => {
      // Skip the cover image if we already added it
      if (coverImage && image.Src === coverImage.Src && coverVideo) {
        return;
      }
      
      // If this is a cover image and no cover video exists, put it first
      if (image.Cover === true && !coverVideo && media.length === 0) {
        media.unshift({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      } else {
        media.push({
          src: image.Src,
          type: 'image',
          key: key++,
        });
      }
    });
  }
  
  // Add remaining videos that aren't the cover video
  if (videos.value) {
    videos.value.forEach(video => {
      // Skip the cover video as it's already added
      if (coverVideo && video.Src === coverVideo.Src) {
        return;
      }
      
      media.push({
        src: video.Src,
        type: 'video',
        key: key++,
      });
    });
  }
  
  return media;
});
const title = computed(() => {
  return product.value?.Description?.Title || '';
});

const descriptionShort = computed(() => {
  return product.value?.Description?.DescriptionShort || '';
});

const loadData = (idCatgory: number) => {
  const categorylink = route.params.categorylink;
  if (categorylink) {
    let offset = 0;
    categoryService
      .products({
        LanguageIsoCode: languageIsoCode.value,
        CurrencyIsoCode: currencyIsoCode.value,
        Offset: offset,
        Limit: 5,
        CategoryDescriptionFriendlyURL: categorylink,
      })
      .then((data) => {
        productsSameStyle.value = data.Products;
      })
      .finally(() => {});
  }
};

if (idProduct.value) {
  loading.value = true;
  try {
    product.value = await fetchProduct(idProduct.value);
    addProductToViewedStore(product.value);
    useHead(() => ({
      title: () => product.value?.Description?.Title || '',
      meta: [
        {
          name: 'description',
          content: () => title.value,
        },
        { property: 'og:image', content: () => descriptionShort.value },
      ],
    }));

    // if (p.Category?.Main?.IdCategory) {
    //   loadData(p.Category?.Main?.IdCategory);
    // }
  } catch (err) {
    error.value = true;
  } finally {
    loading.value = false;
  }
}

if (idCatgory.value) {
  loadData(idCatgory.value);
}
const productDescription = ref<HTMLElement | null>(null);
function scrollToRef(element: HTMLElement | null) {
  if (windowWidth.value > 991) {
    scrollToElement(element, 100);
  } else {
  }
}

const productInfo = ref<HTMLElement | null>(null);
const isHeaderVisible = ref(false);
let observer: IntersectionObserver | null = null;

const observerCallback: IntersectionObserverCallback = (entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      isHeaderVisible.value = true;
    } else {
      isHeaderVisible.value = false;
    }
  });
};

const setupObserver = () => {
  if (typeof window !== 'undefined' && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(observerCallback, { threshold: 0.4 });
    if (productInfo.value) {
      observer.observe(productInfo.value);
    }
  }
};

const cleanupObserver = () => {
  if (observer && productInfo.value) {
    observer.unobserve(productInfo.value);
    observer.disconnect();
    observer = null;
  }
};

onMounted(() => setupObserver());
onActivated(() => setupObserver());

onUnmounted(() => cleanupObserver());
onDeactivated(() => cleanupObserver());
</script>

<template>
  <div class="pageProduct">
    <div v-if="loading">loading .....</div>
    <div v-else>
      <template v-if="error">
        <LayoutContainer>
          <div class="border border-black py-5 mt-20 max-w-screen-md mx-auto">
            <BaseHeadLine
              name="h1"
              size="_2xl"
              class="uppercase font-normal text-center"
            >
              {{ $t('titles.product_not_found') }} !
            </BaseHeadLine>
          </div>
        </LayoutContainer>
      </template>
      <template v-else-if="product">
        <div
          v-if="windowWidth > 991"
          class="pageProduct-productTop"
          :class="{ show: isHeaderVisible }"
        >
          <PageProductTopHeader
            :product="product"
            @addToCartClick="scrollToRef(productInfo)"
          />
        </div>
        <div ref="productInfo" class="grid grid-cols-12 mb-5 lg:mb-24">
          <div
            class="col-span-12 lg:col-span-6 pageProduct-media mdMax:aspect-[1500/2250] relative"
          >
            <ClientOnly>
              <PageProductMedia
                class="w-full"
                :medias="medias"
                :mediasXl="mediasXl"
                :mediasXS="mediasXS"
                :startAt="0"
                :alt="title"
              />
            </ClientOnly>

            <ButtonShopTheLook
              v-if="product?.Association"
              :product="product"
              class="pageProduct-shopthelook"
            />
          </div>
          <div class="col-span-12 lg:col-span-6 flex-1">
            <PageProductInformations
              :product="product"
              @productDetailsClick="scrollToRef(productDescription)"
            />
          </div>
        </div>

        <LayoutContainer>
          <div
            ref="productDescription"
            class="grid grid-cols-12 gap-x-0 lg:gap-x-16 gap-y-6"
          >
            <div class="col-span-12 lg:col-span-6">
              <BaseHeadLine size="sm" class="font-medium mb-2">
                {{ $t('titles.description') }}
              </BaseHeadLine>
              <div
                class="text-xs lg:text-sm"
                v-html="product.Description?.Description"
              ></div>
            </div>
            <div class="col-span-12 lg:col-span-6">
              <BaseHeadLine size="sm" class="font-medium mb-2">
                {{ $t('titles.compositionConseils') }}
              </BaseHeadLine>
              <div
                class="text-sm composition"
                v-html="product.Description?.DescriptionShort"
              ></div>
            </div>
          </div>
        </LayoutContainer>
      </template>
      <ListingCarouselProducts
        v-if="productsSameStyle.length"
        :products="productsSameStyle"
        class="mt-6 lg:mt-24"
        name="sameStyle"
      >
        <template #top>
          <BaseHeadLine size="md" class="font-medium ml-5 lg:ml-10 uppercase">
            {{ $t('titles.sameStyle') }}
          </BaseHeadLine>
        </template>
      </ListingCarouselProducts>

      <ListingCarouselProducts
        v-if="productSViewed"
        :products="productSViewed"
        class="mt-6 lg:mt-24 mb-10 lg:mb-20"
        name="you_also_viewed"
      >
        <template #top>
          <BaseHeadLine size="md" class="font-medium ml-5 lg:ml-10 uppercase">
            {{ $t('titles.you_also_viewed') }}
          </BaseHeadLine>
        </template>
      </ListingCarouselProducts>
    </div>
  </div>
</template>
<style lang="scss">
$pageProduct: '.pageProduct';

#{$pageProduct} {
  &-media {
    flex: 0 1;
  }
  &-productTop {
    @apply fixed w-full top-14 z-[99] 
    -translate-y-full pointer-events-none
    duration-100;

    &.show {
      @apply translate-y-0 pointer-events-auto;
    }
  }
  &-shopthelook {
    @apply absolute top-5 right-5 z-10;
  }
}

.composition {
  ul {
    > li {
      @apply flex;
      > img {
        @apply w-5 mr-2;
      }
    }
  }
}
</style>
