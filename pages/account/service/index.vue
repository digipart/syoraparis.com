<script setup lang="ts">
definePageMeta({
  
  requireAuth: true,
});


const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.customer_services.title'),
  description: () => t('pages.account.customer_services.description'),
}));

const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);

const ticketStore = useTicketStore();
const { fetchLastBoughtProducts } = ticketStore;
const { lastBoughtProductsResponse } = toRefs(ticketStore);

const { customer } = useAuth();

fetchLastBoughtProducts().finally(() => {
  setLoadingPage(false);
});
</script>

<template>
  <LayoutAccountServiceClient>
    <BaseHeadLine size="md" class="font-normal uppercase">
      {{
        $t('account.service.assistance.title', { name: customer?.Firstname })
      }}
    </BaseHeadLine>
    <p
      class="text-sm font-light"
      v-html="
        $t('account.service.assistance.discription', {
          faq_url: '/#',
        })
      "
    ></p>
    <!-- {{ lastBoughtProductsResponse }} -->
    <div class="grid grid-cols-10 -mx-5 mt-10">
      <div
        v-for="(product, index) in lastBoughtProductsResponse"
        :key="index"
        class="col-span-2"
      >
        <CardTicketProduct :product="product"  />
      </div>
    </div>
  </LayoutAccountServiceClient>
</template>

<style scoped></style>
