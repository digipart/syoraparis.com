<script setup lang="ts">
import LookBookService from '~/services/cms/LookBookService';
import type { CmsLookBookCategoriesType } from '~/types/cms/LookBookType';

const lookbooksData = ref<CmsLookBookCategoriesType | null | undefined>(null);
const lookbookService = new LookBookService();

const { locale } = useI18n();
const localePath = useLocalePath();

const route = useRoute();

const permalink = computed((): string => {
  const param = route.params.permalink as string;
  const documentId = param.split('-').pop() || '';
  return documentId;
});

const lookbooks = computed(() => {
  console.log(lookbooksData.value);
  
  if (lookbooksData.value) {
    return lookbooksData.value[0].lookbooks;
  }
});

try {
  lookbooksData.value = await lookbookService.fetchLookbooks({
    categoryId: permalink.value,
    locale: locale.value,
  });

  console.log(lookbooksData.value);
  
  if (lookbooksData.value?.length) {
    const category = lookbooksData.value[0];

    useHead({
      title: category?.title || '',
      meta: [
        {
          name: 'description',
          content: category?.seo?.description || '',
        },
      ],
    });
  }
} catch (error) {
  console.log('error', error);
}
</script>
<template>
  <div class="lookbookCard">
    <!-- <CmsGrid>
      <template v-for="lookbook in lookbooks">
        {{ lookbook.banner }}
         <CmsColumn :column="lookbook.banner?.column" class="relative">
          <CmsImage :image="lookbook.image" />
          <div class="lookbookCard-body">
            <template v-for="lookbookProduct in lookbook.products">
              <CardLookBookPin :lookbookProduct="lookbookProduct" />
            </template>
          </div>
        </CmsColumn>
      </template>
    </CmsGrid>-->

    <CmsGrid>
      <template v-for="lookbook in lookbooks">
        <CmsColumn
          v-if="lookbook?.banner?.column"
          :column="lookbook?.banner?.column"
          class="relative"
        >
          <CmsBanner :data="lookbook?.banner" />
          <div class="lookbookCard-body">
            <template v-for="lookbookProduct in lookbook.products">
              <CardLookBookPin :lookbookProduct="lookbookProduct" />
            </template>
          </div>
        </CmsColumn>
      </template>
    </CmsGrid>
  </div>
</template>

<style lang="scss">
$lookbookCard: '.lookbookCard';

#{$lookbookCard} {
  @apply overflow-hidden;
  &-body {
    @apply absolute top-0 left-0
    w-full h-full
    bg-black/10 z-10 opacity-0 duration-200;

    @screen mdMax {
      @apply opacity-100;
    }
  }

  &:hover {
    #{$lookbookCard} {
      &-body {
        @apply opacity-100;
      }
    }
  }
}
</style>
