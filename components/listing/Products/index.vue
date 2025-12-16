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

  const FilterAttribute = [...filterValues.value.attrs].join(',');

  if (FilterAttribute != '') {
    options.FilterAttribute = FilterAttribute;
  }

  if (
    filterValues.value.sort === 'newest_asc' ||
    filterValues.value.sort === 'newest_desc'
  ) {
    options.SortByNewest =
      filterValues.value.sort === 'newest_asc' ? 'ASC' : 'DESC';
  } else if (
    filterValues.value.sort === 'price_asc' ||
    filterValues.value.sort === 'price_desc'
  ) {
    options.SortByPrice =
      filterValues.value.sort === 'price_asc' ? 'ASC' : 'DESC';
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
          if (entry.isIntersecting && !isLodingMore.value && hasNextPage.value) {
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
        class="col-span-12 lg:col-span-2 flex items-center justify-between gap-x-5 px-5 py-2 lg:py-0"
      >
        <div class="block lg:hidden">
          <ListingProductsFilter @onFilterClick="startFilter()" />
        </div>
        <span class="text-xxs lg:text-sm uppercase">
          {{ catrgoryProducts?.TotalProduct }} {{ $t('label.pieces') }}
        </span>
        <ListingProductsView @onChangeView="setTypeView($event)" />
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
