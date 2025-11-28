<script lang="ts" setup>
import { CategoryHelper } from '~/helpers/CategoryHelper';
import CategoryService from '~/services/CategoryService';
import type { CategoryType } from '~/types/CategoryType';

definePageMeta({
  keepalive: true,
});

const route = useRoute();

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);
const categoryStore = useCategoryStore();
const { fetchFilterAttrs } = categoryStore;

const categoryService = new CategoryService();

// const categoryID = route.params.idCategory as string;
const categorylink = `${route.params.categorylink}`;

const catrgoryInfo = ref<CategoryType | null>(null);
const subCategories = ref<CategoryType[]>([]);
const categoryError = ref(false);

const title = computed(() => {
  return catrgoryInfo.value?.Description?.Title || '';
});

const descriptionShort = computed(() => {
  return catrgoryInfo.value?.Description?.DescriptionShort || '';
});

const categoryUrl = (cat: CategoryType) => {
  if (cat) {
    const categoryHelper = new CategoryHelper(cat);

    return categoryHelper.getUrl();
  }
  return '#';
};

if (categorylink) {
  try {
    await fetchFilterAttrs({ categoryFriendlyURL: categorylink });
  } catch (error) {}

  try {
    catrgoryInfo.value = await categoryService.fetch({
      CategoryDescriptionFriendlyURL: categorylink,
      LanguageIsoCode: languageIsoCode.value,
      CurrencyIsoCode: currencyIsoCode.value,
    });
    useHead(() => ({
      title: () => title.value,
      meta: [
        {
          name: 'description',
          content: () =>
            descriptionShort.value === ''
              ? title.value
              : descriptionShort.value,
        },
      ],
    }));

    if (catrgoryInfo.value.IdCategory) {
      try {
        const data = await categoryService.fetchSubCategories({
          IdCategory: catrgoryInfo.value.IdCategory,
          LanguageIsoCode: languageIsoCode.value,
        });

        subCategories.value = data.SubCategories;
      } catch (error) {}
    }
  } catch (error) {
    categoryError.value = true;
  }
}
</script>

<template>
  <div class="pageCategory">
    <div v-if="categoryError">
      <LayoutContainer>
        <div class="border border-black py-5 mt-20 max-w-screen-md mx-auto">
          <BaseHeadLine
            name="h1"
            size="_2xl"
            class="uppercase font-normal text-center"
          >
            {{ $t('titles.category_not_found') }} !
          </BaseHeadLine>
        </div>
      </LayoutContainer>
    </div>
    <div v-else>
      <div class="px-5">
        <BaseHeadLine
          name="h1"
          class="uppercase mb-4 mt-5 font-normal"
          size="xl"
        >
          {{ catrgoryInfo?.Description?.Title }}
        </BaseHeadLine>
        <ul v-if="subCategories.length" class="flex flex-wrap mb-5 gap-1">
          <li v-for="(cat, index) in subCategories" :key="index">
            <NuxtLink :to="`${categoryUrl(cat)}`" class="subCategoryBtn">
              {{ cat.Description?.Title }}
            </NuxtLink>
          </li>
        </ul>
      </div>
      <ListingProducts />
    </div>
  </div>
</template>
<style lang="scss">
$pageCategory: '.pageCategory';

.subCategoryBtn {
  @apply flex border border-black px-2 py-0.5 text-xxs whitespace-nowrap uppercase duration-150;
  &:hover {
    @apply bg-black text-white;
  }
}
</style>
