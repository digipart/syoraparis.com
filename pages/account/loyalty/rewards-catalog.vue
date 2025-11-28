<script setup lang="ts">
definePageMeta({
  middleware: ['loyalty'],
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.loyalty_reward_catalog.title'),
  description: () => t('pages.account.loyalty_reward_catalog.description'),
}));
</script>

<template>
  <LayoutAccountLoyalty>
    <div class="pageRewardsCatalog">
      <ListingAccountLoyaltyRewards class="mb-10" />
    </div>
  </LayoutAccountLoyalty>
</template>

<style lang="scss">
$pageRewardsCatalog: '.pageRewardsCatalog';
#{$pageRewardsCatalog} {
}
</style>
