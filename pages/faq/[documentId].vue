<template>
  <LayoutCms>
    <LayoutContainer v-if="currentFaq">
      <h1>{{ currentFaq?.question }}</h1>
      <CmsRichText :data="currentFaq?.answer" />

      <NuxtLink
        :to="localePath('/faq')"
        class="text-primary hover:underline mt-4 inline-block"
      >
        {{ $t('label.faq.back_to_faq') }}
      </NuxtLink>
    </LayoutContainer>
  </LayoutCms>
</template>

<script setup lang="ts">
const route = useRoute();
const documentId = Array.isArray(route.params.documentId)
  ? route.params.documentId[0]
  : (route.params.documentId as string);

const localePath = useLocalePath();
if (!documentId) {
  navigateTo(localePath('/faq'));
}

const appStore = useAppStore();
const { setLoadingPage } = appStore;
const { locale } = useI18n();
const faqStore = useFaqStore();
const { fetchSingleFaqPage } = faqStore;
const { currentFaq } = toRefs(faqStore);

const isLoading = ref(true);

setLoadingPage(true);
if (documentId) {
  fetchSingleFaqPage(locale.value, documentId).finally(() => {
    setLoadingPage(false);
    isLoading.value = false;
  });
} else {
  setLoadingPage(false);
  isLoading.value = false;
  navigateTo(localePath('/faq'));
}
</script>

<style scoped></style>
