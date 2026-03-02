<script lang="ts" setup>
import CategoryService from '~/services/CategoryService';
import type { CategoryType } from '~/types/CategoryType';
import type { ProductType } from '~/types/ProductType';

const windowStore = useWindowStore();
const { windowWidth } = toRefs(windowStore);

const appStore = useAppStore();
const { setCategoryListingView } = appStore;

const { locale } = useI18n();
const route = useRoute();
const router = useRouter();

const countryStore = useCountryStore();
const { currencySelected } = toRefs(countryStore);

const categoryStore = useCategoryStore();
const { filterValues } = toRefs(categoryStore);
const { initFilterAttrs } = categoryStore;
initFilterAttrs();

// Initialize size attributes from URL if present
const initSizeFromUrl = () => {
  const sizeQuery = route.query.sizes;
  if (sizeQuery) {
    const sizeValues = Array.isArray(sizeQuery)
      ? sizeQuery.map((val) => String(val))
      : [String(sizeQuery)];

    // Add size values to filterValues.attrs if they're not already there
    sizeValues.forEach((size) => {
      if (!filterValues.value.attrs.includes(size)) {
        filterValues.value.attrs.push(size);
      }
    });
  }
};

// Call initialization function
initSizeFromUrl();

const categoryService = new CategoryService();
const products = ref<ProductType[]>([]);
const page = ref(0);
const initPage = () => {
  const queryPage = Number(route.query.page);
  if (!isNaN(queryPage) && queryPage > 0) {
    page.value = queryPage - 1;
  }
};
initPage();
const numberProductToShow = ref(32);
// const numberProductToShow = ref(8);
const catrgoryProducts = ref<CategoryType | null>(null);

const typeView = useCookie('CATEGORY_VIEW', {
  default: () => 'cols',
});

const isLodingMore = ref(true);
const alreadyScrolled = ref(false);
const hasNextPage = ref(true);
const loadingMoreBtn = ref<HTMLElement | null>(null);

let intersectionObserver: IntersectionObserver | null = null;
let scrollListenerAttached = false;

const setTypeView = (event: any) => {
  setCategoryListingView(event.view);
};

const getFilter = () => {
  let options: any = {};

  if (filterValues.value.price.length) {
    const FilterPrice = filterValues.value.price.join(',');

    if (FilterPrice != '') {
      options.FilterPrice = FilterPrice;
    }
  }

  if (filterValues.value.promotion) {
    options.InPromotion = true;
  }

  const FilterBrands = [...filterValues.value.brands].join(',');

  if (FilterBrands != '') {
    options.FilterBrand = FilterBrands;
  }

  // Handle size attributes separately if they exist in the URL
  const sizeQuery = route.query.sizes;
  let sizeValues: string[] = [];

  if (sizeQuery) {
    // Convert to array if it's a string or use as is if it's already an array
    sizeValues = Array.isArray(sizeQuery)
      ? sizeQuery.map((val) => String(val))
      : [String(sizeQuery)];
  }

  // Combine size values with other attribute values
  const allAttributes = [...filterValues.value.attrs, ...sizeValues];
  const FilterAttribute = [...new Set(allAttributes)].join(',');

  if (FilterAttribute != '') {
    options.FilterAttribute = FilterAttribute;
  }

  // Always include sort parameter in API payload
  // Get sort value directly from filterValues to ensure we use the latest value
  const sortValue = filterValues.value.sort;

  // Log for debugging
  console.log('Sort value in API payload:', sortValue);

  if (sortValue === 'newest_asc' || sortValue === 'newest_desc') {
    options.SortByNewest = sortValue === 'newest_asc' ? 'ASC' : 'DESC';
  } else if (sortValue === 'price_asc' || sortValue === 'price_desc') {
    options.SortByPrice = sortValue === 'price_asc' ? 'ASC' : 'DESC';
  }

  return options;
};

const loadData = () => {
  const categorylink = route.params.categorylink;
  const brandSlug = route.params.slug;

  if (categorylink || brandSlug) {
    isLodingMore.value = true;
    page.value++;
    let offset = (page.value - 1) * numberProductToShow.value;

    categoryService
      .products({
        LanguageIsoCode: locale.value,
        CurrencyIsoCode: currencySelected.value?.CurrencyIsoCode,
        Offset: offset,
        Limit: numberProductToShow.value,
        ...(categorylink
          ? { CategoryDescriptionFriendlyURL: categorylink }
          : {}),
        ...(brandSlug ? { BrandDescriptionFriendlyURL: brandSlug } : {}),
        ...getFilter(),
      })
      .then((data) => {
        catrgoryProducts.value = data;
        hasNextPage.value = data.HasNextPage;
        if (data.Products) {
          products.value = [...products.value, ...data.Products];
        }

        if (page.value > 1) {
          router.push({
            query: {
              ...router.currentRoute.value.query,
              page: page.value.toString(),
            },
          });
        } else {
          router.push({
            query: {
              ...router.currentRoute.value.query,
            },
          });
        }
      })
      .finally(() => {
        isLodingMore.value = false;

        if (!alreadyScrolled.value && route.query.id_product) {
          nextTick(() => {
            setTimeout(() => {
              const element = document.getElementById(
                `product-${route.query.id_product}`
              );
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                alreadyScrolled.value = true;
              }
            }, 500);
          });
        }
      });
  }
};

const handleScrollFallback = () => {
  if (
    typeof window === 'undefined' ||
    isLodingMore.value ||
    !hasNextPage.value ||
    !loadingMoreBtn.value
  ) {
    return;
  }

  const rect = loadingMoreBtn.value.getBoundingClientRect();
  if (rect.top <= window.innerHeight + 100) {
    loadData();
  }
};

const attachScrollFallback = () => {
  if (typeof window === 'undefined' || scrollListenerAttached) {
    return;
  }

  window.addEventListener('scroll', handleScrollFallback, { passive: true });
  scrollListenerAttached = true;
};

const detachScrollFallback = () => {
  if (typeof window === 'undefined' || !scrollListenerAttached) {
    return;
  }

  window.removeEventListener('scroll', handleScrollFallback);
  scrollListenerAttached = false;
};

const setupIntersectionObserver = () => {
  if (typeof window === 'undefined' || !loadingMoreBtn.value) {
    return;
  }

  if (!('IntersectionObserver' in window)) {
    attachScrollFallback();
    return;
  }

  detachScrollFallback();

  if (!intersectionObserver) {
    intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !isLodingMore.value &&
            hasNextPage.value
          ) {
            loadData();
          }
        });
      },
      {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0,
      }
    );
  }

  intersectionObserver.observe(loadingMoreBtn.value);
};

const cleanupIntersectionObserver = () => {
  if (intersectionObserver) {
    if (loadingMoreBtn.value) {
      intersectionObserver.unobserve(loadingMoreBtn.value);
    }
    intersectionObserver.disconnect();
    intersectionObserver = null;
  }

  detachScrollFallback();
};

const startFilter = () => {
  page.value = 0;
  products.value = [];
  loadData();
  nextTick(() => {
    setupIntersectionObserver();
  });
};

onMounted(() => {
  loadData();
  nextTick(() => {
    setupIntersectionObserver();
  });
});

watch(
  () => route.query.id_product,
  (newVal) => {
    if (newVal) {
      const element = document.getElementById(`product-${newVal}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        alreadyScrolled.value = true;
      } else {
        alreadyScrolled.value = false;
      }
    }
  }
);

watch(
  () => hasNextPage.value,
  (value) => {
    if (!value) {
      cleanupIntersectionObserver();
    } else {
      nextTick(() => {
        setupIntersectionObserver();
      });
    }
  }
);

watch(
  () => loadingMoreBtn.value,
  (element) => {
    if (element && hasNextPage.value) {
      nextTick(() => {
        setupIntersectionObserver();
      });
    }
  }
);

onUnmounted(() => {
  cleanupIntersectionObserver();
});
</script>

<template>
  <div>
    <div class="filter-top grid grid-cols-10 items-center">
      <div
        class="hidden lg:block col-span-12 lg:col-span-8 border-x border-black px-5 py-3"
      >
        <!-- <ListingProductsFilter @onFilterClick="startFilter()" /> -->
        <ListingProductsFilterHorizontal @onFilterClick="startFilter()" />
      </div>
      <div
        class="col-span-12 lg:col-span-2 grid grid-cols-3 items-center justify-between gap-x-5 px-2 py-2 lg:py-0"
      >
        <div class="col-span-1 block lg:hidden">
          <ListingProductsFilter @onFilterClick="startFilter()" />
        </div>
        <span
          class="col-span-1 text-xxs lg:text-sm uppercase flex justify-center"
        >
          {{ catrgoryProducts?.TotalProduct }} {{ $t('label.pieces') }}
        </span>
        <div class="col-span-1 flex justify-end">
          <ListingProductsView @onChangeView="setTypeView($event)" />
        </div>
      </div>
    </div>

    <ListingProductsList :products="products" />

    <div ref="loadingMoreBtn" class="flex justify-center">
      <span
        class="inline-flex items-center justify-center leading-none h-12 w-12"
        @click="loadData()"
        v-loading="isLodingMore"
        v-if="hasNextPage"
      >
        <IconPlus />
      </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.grid {
  .cardProduct {
    &-showbody {
      display: none;
    }
  }
}
.filter-top {
  @apply mb-[-1px] border-b border-t  bg-white border-black;
}
</style>
