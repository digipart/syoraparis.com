<script setup lang="ts">
import CategoryService from '~/services/CategoryService';
import type { CategoryType } from '~/types/CategoryType';
const catrgoryInfo = ref<CategoryType | null>(null);
const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

const { shopthelook } = defineProps({
  shopthelook: {
    type: Boolean,
    default: true,
  },
});

const categoryService = new CategoryService();
try {
  catrgoryInfo.value = await categoryService.products({
    IdCategory: 261,
    LanguageIsoCode: languageIsoCode.value,
    CurrencyIsoCode: currencyIsoCode.value,
    Offset: 0,
    Limit: 6,
  });
} catch (error) {}
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="py-2 px-4 h-14 flex items-center border-b border-black">
      <BaseHeadLine class="text-xs">{{
        $t('label.recommended_products')
      }}</BaseHeadLine>
    </div>
    <div class="grid grid-cols-1 gap-3 px-4 py-4 flex-1 overflow-auto">
      <div v-for="(product, index) in catrgoryInfo?.Products" :key="index">
        <CardProduct
          :product="product"
          :slider="false"
          size="small"
          :shopthelook="shopthelook"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
