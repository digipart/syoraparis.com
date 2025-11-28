<script setup lang="ts">
import PageLegalNoticesService from '~/services/cms/PageLegalNoticesService';
import type { PageLegalNoticesDataType } from '~/types/cms/PageLegalNoticesType';

const { locale } = useI18n();
const pageLegalNoticesData = ref<PageLegalNoticesDataType | null | undefined>(
  null
);
const pageLegalNoticesService = new PageLegalNoticesService();

try {
  pageLegalNoticesData.value = await pageLegalNoticesService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}

if (pageLegalNoticesData.value) {
  useHead(() => ({
    title: () => pageLegalNoticesData.value?.seo?.title || '',
    meta: [
      {
        name: 'description',
        content: () => pageLegalNoticesData.value?.seo?.description || '',
      },
    ],
  }));
}
</script>

<template>
  <LayoutCms>
    <LayoutContainer>
      <CmsRichText :data="pageLegalNoticesData?.content" />
    </LayoutContainer>
  </LayoutCms>
</template>

<style lang="scss"></style>
