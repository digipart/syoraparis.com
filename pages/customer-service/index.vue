<template>
  <div class="mb-20">
    <LayoutContainer>
      <div class="pt-10 pb-10 max-w-3xl mx-auto">
        <BaseHeadLine class="font-normal mb-10" size="_2xl">
          {{ $t('titles.customer_service') }}
        </BaseHeadLine>
        <InputText
          id="customerServiceTerm"
          v-model="termToSearch"
          border
          :placeholder="$t('label.search')"
        >
          <template #icon>
            <IconSearch icon="mynaui:search" />
          </template>
        </InputText>
      </div>

      <div class="grid grid-cols-12 gap-5 gap-y-8">
        <div class="col-span-12">
          <BaseHeadLine size="md" class="font-normal uppercase mb-3">
            {{ $t('titles.themes') }}
          </BaseHeadLine>
          <CmsFaqListing />
        </div>

        <div class="col-span-6">
          <BaseHeadLine size="md" class="font-normal uppercase mb-3">
            {{ $t('titles.faq') }}
          </BaseHeadLine>

          <BaseCollapsible :index-active="[]">
            <BaseCollapsibleItem
              v-for="(faq, index) in faqHighlight"
              :key="index"
              :index="index"
              :closeOthers="true"
              :hideArrow="false"
            >
              <template #header>
                {{ faq.question }}
              </template>
              <template #content>
                <div class="px-5 py-3">
                  <CmsRichText :data="faq.answer" />
                </div>
              </template>
            </BaseCollapsibleItem>
          </BaseCollapsible>
        </div>

        <div class="col-span-6">
          <BaseHeadLine size="md" class="font-normal uppercase mb-3">
            {{ $t('titles.do_you_need_to_contact_us') }}
          </BaseHeadLine>
          <NuxtLink :to="localePath({ name: 'contact-us' })">
            <BaseButton
              type="primary"
              plain
              :title="$t('button.contactus_now')"
            >
              {{ $t('button.contactus_now') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
const faqStore = useFaqStore();
const { faqHighlight, termToSearch } = toRefs(faqStore);

const localePath = useLocalePath();

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.customer_service.title'),
  description: () => t('pages.customer_service.description'),
}));
</script>

<style scoped lang="scss">
.qtsFqt {
  @apply border border-black px-5;
  li {
    @apply border-b border-black py-3 text-sm;
    &:last-child {
      @apply border-b-0;
    }
  }
}
</style>
