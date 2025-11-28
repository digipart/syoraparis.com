<script setup lang="ts">
import PageTermsConditionsService from '~/services/cms/PageTermsConditionsService';
import type { PagePrivacyPolicyDataType } from '~/types/cms/PagePrivacyPolicyType';

const { locale } = useI18n();
const pageTermConditionsData = ref<
  PagePrivacyPolicyDataType | null | undefined
>(null);
const pageTermConditionsService = new PageTermsConditionsService();

try {
  pageTermConditionsData.value = await pageTermConditionsService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}

if (pageTermConditionsData.value) {
  useHead(() => ({
    title: () => pageTermConditionsData.value?.seo?.title || '',
    meta: [
      {
        name: 'description',
        content: () => pageTermConditionsData.value?.seo?.description || '',
      },
    ],
  }));
}
</script>

<template>
  <LayoutCms>
    <LayoutContainer>
      <CmsRichText
        v-if="pageTermConditionsData?.content"
        :data="pageTermConditionsData?.content"
      />
    </LayoutContainer>
  </LayoutCms>
</template>

<style lang="scss"></style>
