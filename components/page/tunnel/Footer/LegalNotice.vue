<script setup lang="ts">
import PageLegalNoticesService from '~/services/cms/PageLegalNoticesService';
import type { PageLegalNoticesDataType } from '~/types/cms/PageLegalNoticesType';

const { locale } = useI18n();
const pageLegalNoticesData = ref<PageLegalNoticesDataType | null | undefined>(
  null
);
const pageLegalNoticesService = new PageLegalNoticesService();

const isVisisble = ref(false);

try {
  pageLegalNoticesData.value = await pageLegalNoticesService.fetch({
    locale: locale.value,
  });
} catch (error) {
  console.log('error', error);
}
</script>

<template>
  <div>
    <span @click="isVisisble = true" class="cursor-pointer text-sm underline">
      {{ $t('label.legal_notice') }}
    </span>

    <BaseModal v-model="isVisisble" size="692px" class="legalNotice">
      <template #header>
        <span class="uppercase font-normal">
          {{ $t('label.legal_notice') }}
        </span>
      </template>
      <LayoutCms>
        <CmsRichText :data="pageLegalNoticesData?.content" />
      </LayoutCms>
    </BaseModal>
  </div>
</template>

<style lang="scss">
.legalNotice .cms {
  @apply py-2;
}
</style>
