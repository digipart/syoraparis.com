<template>
  <div class="grid grid-cols-12 gap-5">
    <div
      v-for="(faqCat, index) in filteredData"
      :key="index"
      class="col-span-12 md:col-span-6 lg:col-span-4"
    >
      <div class="border border-black cursor-pointer">
        <div class="border-b border-black py-3 px-5">
          <BaseHeadLine size="md" class="font-normal">
            {{ faqCat.title }}
          </BaseHeadLine>
        </div>
        <div class="px-5 py-3">
          <ul class="text-sm flex flex-col gap-2">
            <li v-for="faq in faqCat.faqs">
              {{ faq.question }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const appStore = useAppStore();
const { setLoadingPage } = appStore;
const { locale } = useI18n();
const faqStore = useFaqStore();
const { fetchFaqPage } = faqStore;
const { faqCategories, termToSearch } = toRefs(faqStore);

setLoadingPage(true);
fetchFaqPage(locale.value).finally(() => {
  setLoadingPage(false);
});

const filteredData = computed(() => {
  const searchTerm = termToSearch.value;
  return faqCategories.value.filter((item) => {
    const titleMatch = item?.title?.toLowerCase().includes(searchTerm);
    const questionMatch = item?.faqs?.some((faq) =>
      faq?.question?.toLowerCase().includes(searchTerm)
    );
    return titleMatch || questionMatch;
  });
});
</script>

<style scoped></style>
