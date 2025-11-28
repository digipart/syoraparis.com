<template>
  <div>
    <LayoutContainer>
      <div class="pt-10 pb-10">
        <BaseHeadLine size="xl" class="font-normal">
          Avez-vous besoin d'aide concernant un article récent,
          {{ customer?.Firstname }} ?
        </BaseHeadLine>
        <p class="text-sm">
          Sélectionnez ci-dessous l'article pour lequel vous avez besoin d'aide
          ou obtenez de l'aide pour autre chose.
        </p>
      </div>
      <div class="mb-20">
        <div class="grid grid-cols-10">
          <div
            v-for="(product, index) in lastBoughtProductsResponse?.Products"
            :key="index"
            class="col-span-2"
          >
            <CardTicketProduct :product="product" />
          </div>
        </div>
      </div>
      <CmsFaqListing />
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
const auth = useAuth();
const { customer } = toRefs(auth);

const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);

const ticketStore = useTicketStore();
const { fetchLastBoughtProducts } = ticketStore;
const { lastBoughtProductsResponse } = toRefs(ticketStore);

fetchLastBoughtProducts().finally(() => {
  setLoadingPage(false);
});
</script>

<style scoped></style>
