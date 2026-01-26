<script setup lang="ts">
import PagePrivacyPolicyService from '~/services/cms/PagePrivacyPolicyService';
import type { PagePrivacyPolicyDataType } from '~/types/cms/PagePrivacyPolicyType';

const { locale } = useI18n();
const pagePrivacyPolicyData = ref<PagePrivacyPolicyDataType | null | undefined>(
  null
);
const pagePrivacyPolicyService = new PagePrivacyPolicyService();

const isVisisble = ref(false);

try {
  pagePrivacyPolicyData.value = await pagePrivacyPolicyService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}
</script>

<template>
  <div>
    <span @click="isVisisble = true" class="cursor-pointer text-sm underline">
      {{ $t('label.privacy_policy') }}
    </span>

    <BaseModal v-model="isVisisble" size="692px" class="privacyPolicy">
      <template #header>
        <span class="uppercase font-normal">
          {{ $t('label.privacy_policy') }}
        </span>
      </template>
      <LayoutCms>
        <CmsRichText :data="pagePrivacyPolicyData?.content" />
      </LayoutCms>
    </BaseModal>
  </div>
</template>

<style lang="scss">
.privacyPolicy .cms {
  @apply py-2;
}
</style>
