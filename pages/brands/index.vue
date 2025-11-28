<script setup lang="ts">
const brandStore = useBrandStore();
const { fetchBrands } = brandStore;
const { brands } = toRefs(brandStore);

const { t } = useI18n();
const localePath = useLocalePath();

fetchBrands();
</script>

<template>
  <div>
    <div class="grid grid-cols-12 border-b border-black">
      <div
        class="col-span-12 lg:col-span-4 border-b lg:border-b-0 lg:border-r border-black"
      >
        <NuxtImg src="/assets/images/brands.webp" class="w-full" />
       
      </div>

      <div class="col-span-12 lg:col-span-8 flex flex-col justify-center p-5">
        <BaseHeadLine name="h1" size="_2xl" class="mb-2 font-normal">
          {{ $t('label.brands') }}
        </BaseHeadLine>
        <div class="text-sm">
          <div v-html="t('html.brands_discription')"></div>
        </div>
      </div>
    </div>
    <LayoutContainer class="my-12 lg:my-20">
      <BaseHeadLine
        size="xl"
        class="mb-10 font-normal border-b border-black pb-3"
      >
        {{ $t('titles.discover_our_brands') }}
      </BaseHeadLine>
      <div class="grid grid-cols-12 gap-5">
        <div
          v-for="brand in brands"
          :key="brand.IdBrand"
          class="col-span-6 lg:col-span-3"
        >
          <NuxtLink
            :to="
              localePath({
                name: 'brands-slug',
                params: {
                  slug: brand.Seo.FriendlyURL,
                },
              })
            "
            class="border border-black flex flex-col items-center p-5"
          >
            <div class="max-w-32 w-full mb-5">
              <NuxtImg
                v-if="brand?.Logo?.Src"
                :src="brand.Logo.Src"
                :alt="brand.Name"
                class="w-auto h-16 object-contain"
              />
            </div>
            <BaseHeadLine size="sm" class="text-center font-normal">
              {{ brand.Name }}
            </BaseHeadLine>
          </NuxtLink>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>

<style scoped></style>
