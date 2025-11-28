<template>
  <LayoutAccountLoyalty>
    <div class="pageMyRewards">
      <ListingAccountLoyaltyMyRewards />
    </div>
  </LayoutAccountLoyalty>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: ['loyalty'],
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.loyalty_myreward.title'),
  description: () => t('pages.account.loyalty_myreward.description'),
}));
</script>

<style lang="scss">
$pageMyRewards: '.pageMyRewards';
#{$pageMyRewards} {
}
</style>
