<template>
  <div class="LoyaltyProductBlock" @click="visible = true">
    <div class="w-12 h-12 bg-black rounded-full p-1 flex items-center">
      <img src="/assets/images/logo-white.svg" alt="MY JMP" class="w-full" />
    </div>
    <div class="flex flex-col font-light gap-[4px]">
      <strong>{{ $t('ProductLoyalty.program_title') }}</strong>
      <div class="text-sm">
        {{ $t('ProductLoyalty.earn') }}
        <b
          class="inline-block bg-green-100 text-green-700 px-[4px] py-[3px] rounded ml-[2px]"
        >
          {{
            (hasPromtion
              ? promotionalPrice?.PriceTaxIncl
              : regularPrice?.PriceTaxIncl)?.toFixed(0)
          }}
          {{ $t('ProductLoyalty.pts') }}
        </b>
      </div>
      <div class="text-sm">{{ $t('ProductLoyalty.with_purchase') }}</div>
    </div>
    <IconChevronRight :size="1.5" class="LoyaltyProductBlock-chevron" />

    <BaseDrawer
      v-model="visible"
      size="100%"
      maxSize="600px"
      position="right"
      class="sideMenu-drawer"
    >
      <div class="flex flex-col h-full">
        <div
          class="loyalty-drawer-content p-4 text-sm font-light flex-1 overflow-auto"
        >
          <h2 class="font-real font-bold text-base mb-2">
            {{ $t('ProductLoyalty.discover_community') }}
          </h2>

          <p class="mb-4">
            {{ $t('ProductLoyalty.simple_points') }}
          </p>

          <div
            class="border rounded-md py-2 px-2 mb-5 border-indigo-100 text-sm"
          >
            <span class="font-medium">
              <b
                class="inline-block bg-green-100 text-green-700 px-[8px] py-[3px] rounded ml-[2px]"
              >
                {{
                  (hasPromtion
                    ? promotionalPrice?.PriceTaxIncl
                    : regularPrice?.PriceTaxIncl)?.toFixed(0)
                }}
                {{ $t('ProductLoyalty.pts') }}
              </b>
              {{ $t('ProductLoyalty.points_earned') }}
            </span>
          </div>

          <h3 class="font-real text-base font-bold mb-2">
            {{ $t('ProductLoyalty.how_it_works') }}
          </h3>

          <ol class="list-none pl-0 mb-4 space-y-3">
            <li>
              <span class="font-normal">
                {{ $t('ProductLoyalty.step1_title') }} </span
              >{{ $t('ProductLoyalty.step1_desc') }}
            </li>
            <li>
              <span class="font-normal">{{
                $t('ProductLoyalty.step2_title')
              }}</span
              >{{ $t('ProductLoyalty.step2_desc') }}
            </li>
            <li>
              <span class="font-normal">{{
                $t('ProductLoyalty.step3_title')
              }}</span
              >{{ $t('ProductLoyalty.step3_desc') }}
            </li>
          </ol>

          <p class="mt-2">{{ $t('ProductLoyalty.footer') }}</p>
        </div>
        <div class="p-3 flex gap-2 flex-col border-t">
          <NuxtLink
            :to="
              localePath({
                name: 'account-loyalty',
              })
            "
          >
            <BaseButton type="primary" class="w-full" size="small">
              {{ $t('button.learnMore') }}</BaseButton
            >
          </NuxtLink>
          <BaseButton
            type="primary"
            @click="visible = false"
            class="w-full"
            size="small"
            plain
          >
            {{ $t('button.close') }}
          </BaseButton>
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const { product } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
  },
});

// Ensure points is always a number for template usage

const visible = ref(false);
const localePath = useLocalePath();

const price = computed(() => {
  return product?.Price;
});

const hasPromtion = computed(() => {
  if (price.value?.PromotionalPrice) return true;

  return false;
});

const regularPrice = computed(() => {
  return price.value?.RegularPrice;
});
const promotionalPrice = computed(() => {
  return price.value?.PromotionalPrice;
});

// Translations are in i18n/fr.js, i18n/en.js, and i18n/de.js
</script>

<style lang="scss" scoped>
.LoyaltyProductBlock {
  @apply border flex items-center gap-3 py-2 pl-2 pr-8 duration-150 cursor-pointer relative;
  &:hover {
    @apply border-black;
    .LoyaltyProductBlock-chevron {
      @apply translate-x-1;
    }
  }
  &-chevron {
    @apply absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200;
  }
}
</style>

<style lang="scss">
.LoyaltyProductBlock-sidebar {
  .el-drawer {
    max-width: 676px;
  }
}
</style>
