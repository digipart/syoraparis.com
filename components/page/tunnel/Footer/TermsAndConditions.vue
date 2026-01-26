<script setup lang="ts">
import PageTermsConditionsService from '~/services/cms/PageTermsConditionsService';
import type { PageTermConditionsDataType } from '~/types/cms/PageTermConditionsType';

const { locale } = useI18n();
const pageTermsAndConditionsData = ref<PageTermConditionsDataType | null | undefined>(
  null
);
const pageTermsAndConditionsService = new PageTermsConditionsService();

const isVisisble = ref(false);

try {
  pageTermsAndConditionsData.value = await pageTermsAndConditionsService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}
</script>

<template>
  <div>
    <span @click="isVisisble = true" class="cursor-pointer text-sm underline">
      {{ $t('label.terms_and_conditions') }}
    </span>

    <BaseModal v-model="isVisisble" size="692px" class="termsAndConditions">
      <template #header>
        <span class="uppercase font-normal">
          {{ $t('label.terms_and_conditions') }}
        </span>
      </template>
      <LayoutCms>
        <CmsRichText :data="pageTermsAndConditionsData?.content" />
      </LayoutCms>
    </BaseModal>
  </div>
</template>

<style lang="scss">
.termsAndConditions .cms {
  @apply py-2;
}
</style>
