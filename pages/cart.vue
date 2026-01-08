<script setup lang="ts">
definePageMeta({
  keepalive: false,
});

const cartStore = useCartStore();
const { totalProductQuantity, loaded } = toRefs(cartStore);
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.cart.title'),
  description: () => t('pages.cart.description'),
}));

// const router = useRouter();
const localePath = useLocalePath();

// const next = () => {
//   router.push(
//     localePath({
//       name: 'checkout',
//       query: {
//         step: 'address',
//       },
//     })
//   );
// };
</script>

<template>
  <div v-if="loaded">
    <LayoutContinueShopping v-if="!totalProductQuantity" class="my-16" />
    <template v-else>
      <LayoutContainer small class="mt-[-1px] lg:mt-10 mb-96 !px-0">
        <NuxtLink
          :to="localePath({ name: 'index' })"
          class="hidden lg:inline-flex items-center cursor-pointer text-sm mb-2"
        >
          <IconChevronLeft :size="1.3" class="mr-2" />
          {{ t('label.continue_shopping') }}
        </NuxtLink>
        <div class="grid grid-cols-12 gap-5">
          <div class="col-span-12 lg:col-span-8">
            <!-- Payment step -->
            <BasePanel
              :title="`${$t('cart.title')}  (${totalProductQuantity})`"
              class="lg:mb-5"
            >
              <ListingCartItems :editable="true" />
            </BasePanel>
            <div class="hidden lg:block">
              <NuxtLink
                :to="
                  localePath({
                    name: 'checkout',
                  })
                "
              >
                <BaseButton
                  type="primary"
                  size="small"
                  :title="$t('button.checkout')"
                  class="w-full"
                >
                  {{ $t('button.checkout') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>

          <div class="col-span-12 lg:col-span-4">
            <BasePanel
              :title="t('tunnel.delivery.order_summary.title')"
              class="mb-5"
            >
              <PageTunnelOrderSummary />
            </BasePanel>
            <PageCheckoutMyRewards class="mt-4" />
            <BasePanel class="hidden lg:block mb-5">
              <template #header>
                <div class="flex gap-3 justify-between items-center">
                  <BaseHeadLine size="md" class="font-normal uppercase">
                    {{ $t('cart.codepromo.title') }}
                  </BaseHeadLine>
                </div>
              </template>
              <div>
                <FormCodePromo />
              </div>
            </BasePanel>
            <div class="hidden lg:block">
              <NuxtLink
                :to="
                  localePath({
                    name: 'checkout',
                  })
                "
              >
                <BaseButton
                  type="primary"
                  size="small"
                  :title="$t('button.checkout')"
                  class="w-full"
                >
                  {{ $t('button.checkout') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </LayoutContainer>
      <div
        class="block lg:hidden fixed bottom-0 left-0 z-50 w-full p-5 bg-white border-black border-t"
      >
        <NuxtLink
          :to="
            localePath({
              name: 'checkout',
            })
          "
        >
          <BaseButton
            type="primary"
            size="medium"
            :title="$t('button.checkout')"
            class="w-full"
          >
            {{ $t('button.checkout') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </template>
  </div>
</template>

<style></style>
