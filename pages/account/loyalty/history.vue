<template>
  <LayoutAccountLoyalty>
    <div class="pageLoyaltyHistory">
      <ListingAccountLoyaltyHistory />
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
  title: () => t('pages.account.loyalty_history.title'),
  description: () => t('pages.account.loyalty_history.description'),
}));
</script>

<style lang="scss">
$pageLoyaltyHistory: '.pageLoyaltyHistory';
#{$pageLoyaltyHistory} {
}
</style>
