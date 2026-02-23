<script setup lang="ts">
import CategoryService from '~/services/CategoryService';
import type { CategoryType } from '~/types/CategoryType';

const appStore = useAppStore();
const { miniCartVisible, currencyIsoCode, languageIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { totalToPay, cart, promoCodes, hasUnavailableProducts } =
  toRefs(cartStore);

const localePath = useLocalePath();

const catrgoryInfo = ref<CategoryType | null>(null);
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

const products = computed(() => {
  return catrgoryInfo.value?.Products || [];
});
</script>
<template>
  <BaseDrawer v-model="miniCartVisible" size="768px">
    <div
      v-if="products.length"
      class="absolute top-0 left-0 w-[200px] h-full bg-white -translate-x-full border-x border-black"
    >
      <ListingRecommendedProducts :shopthelook="false" :products="products" />
    </div>
    <template #header>
      <div
        class="min-h-14 border-b border-black flex justify-between items-center -mx-5 px-5 -mt-2"
      >
        <BaseHeadLine class="uppercase"> {{ $t('cart.title') }}</BaseHeadLine>
      </div>
      <div class="min-h-14 flex justify-between items-center -mx-5 px-5 -mb-2">
        <div>
          <span class="font-light">{{ $t('cart.total') }} : </span>
          <span> {{ totalToPay }}{{ currencyIsoCode }}</span>
        </div>
        <NuxtLink
          :to="
            localePath({
              name: 'cart',
            })
          "
        >
          <BaseButton
            type="primary"
            size="small"
            @click="miniCartVisible = false"
            :title="$t('button.checkout')"
            :disabled="hasUnavailableProducts"
          >
            {{ $t('button.checkout') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </template>

    <div>
      <BaseAlert
        v-if="hasUnavailableProducts"
        type="danger"
        size="small"
        class="mb-4"
        :closeButton="false"
      >
        <template #icon>
          <IconInfo :size="2" />
        </template>
        <div class="pt-1">{{ $t('cart.has_unavailable_products') }}</div>
      </BaseAlert>
      <ListingCartItems :editable="true" />
    </div>

    <template #footer>
      <div class="w-full flex flex-col gap-2">
        <NuxtLink
          v-if="cart?.Products?.length || 0 > 0"
          :to="
            !hasUnavailableProducts
              ? localePath({
                  name: 'checkout',
                })
              : ''
          "
        >
          <BaseButton
            type="primary"
            class="w-full"
            @click="miniCartVisible = false"
            :title="$t('button.checkout')"
            :disabled="hasUnavailableProducts"
          >
            {{
              hasUnavailableProducts
                ? $t('button.edit_cart')
                : $t('button.checkout')
            }}
          </BaseButton>
        </NuxtLink>
        <BaseButton
          type="primary"
          plain
          class="w-full"
          @click="miniCartVisible = false"
          :title="$t('label.continue_shopping')"
        >
          {{ $t('label.continue_shopping') }}
        </BaseButton>
      </div>
    </template>
  </BaseDrawer>
</template>

<style scoped></style>
