<script setup lang="ts"></script>

<template>
  <div class="guest-sidebar">
    <ListingCartItems :editable="false" :mini="true" checkout />
    <PageCheckoutMyRewards class="mt-6" />
    <div class="mt-6">
      <FormCodePromo />
    </div>
    <hr class="my-6 border-zinc-100" />
    <PageTunnelOrderSummary />

    <PageTunnelFooter class="lg:hidden mt-8" />
  </div>
</template>

<style scoped lang="scss">
.guest-sidebar {
  @apply lg:sticky lg:top-8;
}
</style>
