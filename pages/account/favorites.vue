<script setup lang="ts">
definePageMeta({
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.my_favorites.title'),
  description: () => t('pages.account.my_favorites.description'),
}));

const favoriteStore = useFavoritesStore();
const { favorite } = toRefs(favoriteStore);

const localePath = useLocalePath();

const products = computed(() => {
  return favorite.value?.Products;
});
</script>

<template>
  <LayoutAccount>
    <div class="md:mt-14 lg:mt-20 -mx-5">
      <div v-if="products?.length" class="grid grid-cols-12 gap-y-8">
        <div
          v-for="(product, index) in products"
          :key="product.IdProduct + '-' + index"
          class="col-span-6 md:col-span-4 lg:col-span-3 xl:col-span-2"
        >
          <div>
            <CardProduct
              :product="product"
              :body="true"
              :addToCart="true"
              imageSize="small"
            />
          </div>
        </div>
      </div>
      <div v-else class="max-w-screen-md px-5">
        <BaseAlert :closeButton="false">
          {{ $t('messages.no_favoris_yet') }}
          <NuxtLink class="underline" :to="localePath({ name: 'index' })">
            {{ $t('label.continue_shopping') }}
          </NuxtLink>
        </BaseAlert>
      </div>
    </div>
  </LayoutAccount>
</template>

<style scoped></style>
