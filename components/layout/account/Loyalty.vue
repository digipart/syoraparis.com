<script setup lang="ts">
// #i18n#

const { t } = useI18n();
const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyCustomer, fetshLoyaltyTier } = loyaltyStore;

const appStore = useAppStore();
const { setLoadingPage } = appStore;

const tabItems = ref([
  {
    label: t('label.dashboard'),
    name: 'account-loyalty',
  },
  {
    label: t('label.my_rewards'),
    name: 'account-loyalty-my-rewards',
  },
  {
    label: t('label.rewards_catalog'),
    name: 'account-loyalty-rewards-catalog',
  },
  {
    label: t('label.my_points_history'),
    name: 'account-loyalty-history',
  },
  {
    label: t('label.earn_more_points'),
    name: 'account-loyalty-events',
  },
]);
// setLoadingPage(true);
// fetshLoyaltyCustomer().finally(() => {
//   setLoadingPage(false);
// });

try {
  setLoadingPage(true);
  await fetshLoyaltyCustomer();
  await fetshLoyaltyTier();
} catch (error) {
  console.log('loyalty error', error);
}
setLoadingPage(false);
</script>
<template>
  <LayoutAccount>
    <LayoutAccountChildMenu
      :items="tabItems"
      class="mb-8 md:mb-14 lg:mb-20 mt-10"
    />
    <div class="grid grid-cols-12 gap-5">
      <div class="col-span-12 md:col-span-4 lg:col-span-4">
        <CardLoyaltyState class="static lg:sticky top-20" />
      </div>
      <div class="col-span-12 md:col-span-8 lg:col-span-8">
        <slot />
      </div>
    </div>
  </LayoutAccount>
</template>

<style scoped></style>
