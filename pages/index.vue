<template>
  <div v-if="!loading && homePageData" class="homePage">
    <!-- <div class="fakeScroll"></div> -->
    <CmsGrid>
  
      <template v-for="(item, index) in homePageData.body">
        <CmsColumn v-if="item.column" :column="item.column">
          <CmsBanner
            v-if="item.__typename === 'ComponentBlockBanner'"
            :data="item"
          />
          <CmsBannerText
            v-if="item.__typename === 'ComponentBlockBannerText'"
            :data="item"
          />
          <CmsBannerGroup
            v-if="item.__typename === 'ComponentBlockGroupBanner'"
            :benners="item.banners"
          />
        </CmsColumn>
        <div
          v-if="item.__typename === 'ComponentBlockOurSelection'"
          class="col-span-12"
        >
          <CmsOurSelection v-if="item.idCategory" :data="item" />
        </div>
    
      </template>
    </CmsGrid>
  </div>
</template>

<script setup lang="ts">
import HomePageService from '~/services/cms/HomePageService';
import type { HomePageDataType } from '~/types/cms/HomePageType';

const homePageData = ref<HomePageDataType | null | undefined>(null);
const homePageService = new HomePageService();
const loading = ref<boolean>(true);

const { locale } = useI18n();

try {
  homePageData.value = await homePageService.fetch({ locale: locale.value });
  useHead(() => ({
    title: () => homePageData.value?.seo?.title || '',
    description: () => homePageData.value?.seo?.description || '',
  }));
} catch (error) {
  console.log('error', error);
} finally {
  loading.value = false;
}
</script>

<style lang="scss">
$homePage: '.homePage';

#{$homePage} {
  @apply -mt-14;
}
.fakeScroll {
  @apply w-[1px] h-36 bg-white/40 absolute top-32 right-6 z-10;

  &::after {
    content: '';
    @apply top-0 w-full h-12 bg-white absolute;
  }
}
</style>
