<script setup lang="ts">
import PagePrivacyPolicyService from '~/services/cms/PagePrivacyPolicyService';
import type { PagePrivacyPolicyDataType } from '~/types/cms/PagePrivacyPolicyType';

const { locale } = useI18n();
const pagePrivacyPolicyData = ref<PagePrivacyPolicyDataType | null | undefined>(
  null
);
const pagePrivacyPolicyService = new PagePrivacyPolicyService();

try {
  pagePrivacyPolicyData.value = await pagePrivacyPolicyService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}

if (pagePrivacyPolicyData.value) {
  useHead(() => ({
    title: () => pagePrivacyPolicyData.value?.seo?.title || '',
    meta: [
      {
        name: 'description',
        content: () => pagePrivacyPolicyData.value?.seo?.description || '',
      },
    ],
  }));
}
</script>

<template>
  <LayoutCms>
    <LayoutContainer>
      <CmsRichText :data="pagePrivacyPolicyData?.content" />
    </LayoutContainer>
  </LayoutCms>
</template>

<style lang="scss"></style>
