<script setup lang="ts">
const appStore = useAppStore();
const { miniCartVisible, currencyIsoCode } = toRefs(appStore);

const cartStore = useCartStore();
const { totalToPay } = toRefs(cartStore);

const localePath = useLocalePath();
</script>
<template>
  <BaseDrawer v-model="miniCartVisible" size="768px">
    <div
      class="absolute top-0 left-0 w-[200px] h-full bg-white -translate-x-full border-x border-black"
    >
      <ListingRecommendedProducts />
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
          >
            {{ $t('button.checkout') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </template>

    <div>
      <ListingCartItems :editable="true" />
    </div>

    <template #footer>
      <div class="w-full">
        <NuxtLink
          :to="
            localePath({
              name: 'checkout',
            })
          "
        >
          <BaseButton
            type="primary"
            class="w-full"
            @click="miniCartVisible = false"
            :title="$t('button.checkout')"
          >
            {{ $t('button.checkout') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </template>
  </BaseDrawer>
</template>

<style scoped></style>
