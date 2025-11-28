<template>
  <LayoutAccountLoyalty>
    <div class="pageLoyaltyEvent">
      <ListingAccountLoyaltyEvents />
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
  title: () => t('pages.account.loyalty_events.title'),
  description: () => t('pages.account.loyalty_events.description'),
}));
</script>

<style lang="scss">
$pageLoyaltyEvent: '.pageLoyaltyEvent';
#{$pageLoyaltyEvent} {
}
</style>
