<script lang="ts" setup>
// Import and setup i18n for internationalization
const { t } = useI18n();

// Configure page metadata
useHead(() => ({
  title: () => t('pages.search.title'),
  description: () => t('pages.search.description'),
}));

const formSearchStore = useFormSearchStore();
const { state, v$ } = toRefs(formSearchStore);

// Store and router setup
const searchStore = useSearchStore();
const { searchData, searchProducts } = toRefs(searchStore);
const { fetchSearch } = searchStore;
const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

// Search state management
state.value.search = route.query.term as string;
const page = ref(0);
const numberProductToShow = ref(32);

// UI state management
const isLoadingMore = ref(true);
const hasNextPage = ref(true);
const loadingMoreBtn = ref<HTMLElement | null>(null);

/**
 * Handles form submission with new search term
 * Resets pagination and updates URL query params
 */
const submitForm = async (text: string) => {
  state.value.search = text;
  page.value = 0;
  searchProducts.value = [];
  loadData().then(() => {
    router.replace(
      localePath({
        name: 'search',
        query: {
          term: state.value.search,
        },
      })
    );
  });
};

/**
 * Loads more search results with pagination
 * Updates loading state and checks for more pages
 */
const loadData = () => {
  isLoadingMore.value = true;
  page.value++;
  const offset = (page.value - 1) * numberProductToShow.value;

  return fetchSearch({
    Term: state.value.search,
    Offset: offset,
    Limit: numberProductToShow.value,
  })
    .then((data) => {
      hasNextPage.value = data?.HasNextPage || false;
    })
    .finally(() => {
      isLoadingMore.value = false;
    });
};

/**
 * Infinite scroll handler
 * Triggers more data loading when user reaches bottom of page
 */
const handleScroll = () => {
  if (!isLoadingMore.value && hasNextPage.value) {
    if (loadingMoreBtn.value) {
      if (
        loadingMoreBtn.value.offsetTop <=
        window.scrollY + window.innerHeight
      ) {
        loadData();
      }
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  // Initial search if term exists in URL
  if (route.query.term) {
    state.value.search = route.query.term as string;
    submitForm(state.value.search);
  }

  // Setup infinite scroll
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll);
  }
});

onUnmounted(() => {
  // Cleanup scroll listener
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll);
  }
});

</script>

<template>
  <div>
    <LayoutContainer full>
      <!-- Search Header -->
      <div class="flex flex-col items-center my-12">
        <BaseHeadLine
          name="h1"
          class="uppercase mb-4 mt-5 font-normal"
          size="xl"
        >
          {{ $t('label.looking_for') }}
        </BaseHeadLine>
        <div class="max-w-[992px] w-full">
          <FormSearch @onSubmit="submitForm" />
        </div>
      </div>

      <!-- Product List -->
      <ListingProductsList :products="searchProducts" />

      <!-- Load More Button -->
      <div ref="loadingMoreBtn" class="flex justify-center">
        <span
          class="inline-flex items-center justify-center leading-none h-12 w-12"
          @click="loadData()"
          v-loading="isLoadingMore"
          v-if="hasNextPage"
        >
          <IconPlus />
        </span>
      </div>
    </LayoutContainer>
  </div>
</template>

<style lang="scss">
/* Add your custom styles here */
</style>
