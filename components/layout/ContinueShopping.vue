<template>
  <div class="py-16">
    <LayoutContainer class="mb-10">
      <div class="flex flex-col justify-center items-center">
        <BaseHeadLine class="text-center mb-4" size="_3xl">
          {{ $t('label.cart_is_empty') }}
        </BaseHeadLine>
        <NuxtLink :to="localePath({ name: 'index' })">
          <BaseButton type="primary" plain>
            {{ $t('label.continue_shopping') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </LayoutContainer>

    <div class="w-full">
      <ListingCarouselProducts
        v-if="catrgoryInfo?.Products"
        :products="catrgoryInfo?.Products"
      >
      </ListingCarouselProducts>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryType } from '~/types/CategoryType';
import CategoryService from '~/services/CategoryService';

const localePath = useLocalePath();

const catrgoryInfo = ref<CategoryType | null>(null);

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const config = useRuntimeConfig();
const defaultCategoryId = config.public.defaultCategoryId;

const categoryService = new CategoryService();
try {
  catrgoryInfo.value = await categoryService.products({
    IdCategory: defaultCategoryId,
    LanguageIsoCode: languageIsoCode.value,
    CurrencyIsoCode: currencyIsoCode.value,
    Offset: 0,
    Limit: 6,
  });
} catch (error) {}
</script>

<style scoped></style>
