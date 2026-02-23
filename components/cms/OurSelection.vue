<template>
  <div class="ourSelection">
    <ListingCarouselProducts
      v-if="catrgoryInfo?.Products"
      :products="catrgoryInfo?.Products"
    >
    </ListingCarouselProducts>
    <div
      v-if="data?.category_link"
      class="flex justify-center border-b border-black"
    >
      <NuxtLink
        class="block w-full py-2 px-5 text-center"
        :to="
          localePath({
            name: 'categorylink',
            params: {
              categorylink: data.category_link,
            },
          })
        "
      >
        {{ $t('button.view_collection') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import CategoryService from '~/services/CategoryService';
import type { CategoryType } from '~/types/CategoryType';
import type { CmsOurSelection } from '~/types/cms/HomePageType';

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const { data } = defineProps<{
  data?: CmsOurSelection;
}>();

const localePath = useLocalePath();

const catrgoryInfo = ref<CategoryType | null>(null);

const categoryService = new CategoryService();
if (data?.idCategory) {
  try {
    catrgoryInfo.value = await categoryService.products({
      IdCategory: data.idCategory,
      LanguageIsoCode: languageIsoCode.value,
      CurrencyIsoCode: currencyIsoCode.value,
      Offset: 0,
      Limit: data.numberOfProducts || 6,
    });
  } catch (error) {}
}
</script>

<style lang="scss">
$ourSelection: '.ourSelection';

#{$ourSelection} {
  .carouselProduct .carouselProduct-swiper {
    @apply ml-0;
  }
}
</style>
