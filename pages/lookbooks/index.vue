<script setup lang="ts">
import LookBookService from '~/services/cms/LookBookService';
import type { CmsLookBookCategoriesType } from '~/types/cms/LookBookType';

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.lookbook.title'),
  description: () => t('pages.lookbook.description'),
}));

const lookbookCategories = ref<CmsLookBookCategoriesType | null | undefined>(
  null
);
const lookbookService = new LookBookService();

const { locale } = useI18n();
const localePath = useLocalePath();
const loading = ref(true);

try {
  lookbookCategories.value = await lookbookService.fetchCategories({
    locale: locale.value,
  });

  console.log(lookbookCategories.value);
  
  
} catch (error) {
  console.log('error', error);
} finally {
  loading.value = false;
}
</script>

<template>
  <div v-if="!loading">
    <template v-if="lookbookCategories">
      <div
        v-for="lookbook in lookbookCategories"
        class="relative"
      >
        <!-- <CmsImage :image="lookbook.image" />
      <NuxtLink
        to="/#"
        class="bg-black/10 absolute top-0 left-0 w-full h-full z-[2]"
      >
        <BaseHeadLine>
          {{ lookbook.title }}
        </BaseHeadLine>
      </NuxtLink> -->

        <NuxtLink
          :to="
            localePath({
              name: 'lookbooks-permalink',
              params: {
                permalink: `${lookbook.seo?.permalink}-${lookbook.documentId}`,
              },
            })
          "
          class="bannerLookBook"
        >
          <CmsImage :image="lookbook.image" class="bannerLookBook-bg" />

          <div class="bannerLookBook-box px-5 py-5 lg:py-10">
            <div class="sticky top-0 z-10 h-full max-h-screen">
              <div class="flex items-center h-full">
                <div class="sticky top-[calc(50%_-_0.5em_*_1.02)] z-30">
                  <BaseHeadLine class="bannerLookBook-title" size="auto">
                    {{ lookbook.title }}
                  </BaseHeadLine>
                </div>
              </div>
            </div>
          </div>
        </NuxtLink>
      </div>
    </template>

    <div v-else>
      <LayoutContainer>
        <div
          class="border border-black py-5 mb-20 mt-20 max-w-screen-md mx-auto"
        >
          <BaseHeadLine
            name="h1"
            size="_2xl"
            class="uppercase font-normal text-center"
          >
            {{ $t('titles.page_not_found') }} !
          </BaseHeadLine>
        </div>
      </LayoutContainer>
    </div>
  </div>
</template>

<style lang="scss">
$bannerLookBook: '.bannerLookBook';
#{$bannerLookBook} {
  @apply flex flex-col items-center justify-center relative;

  &-box {
    @apply absolute top-0 left-0  z-10 w-full h-full min-h-full flex-1;
  }

  &-bg {
    @apply relative min-h-full w-full bg-no-repeat bg-center bg-cover;
    @screen lg {
      background-position: center 18%;
    }
  }

  &-footer {
    @apply p-5 w-full text-center text-white font-light text-2xl;
  }

  #{$bannerLookBook} {
    &-title {
      @apply text-3xl leading-[1] font-bold uppercase text-white;

      @screen lg {
        @apply text-6xl leading-[0.8];
      }
      i {
        @apply font-[100] not-italic;
      }
    }
  }
}
</style>
