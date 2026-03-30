<script setup lang="ts">
const emit = defineEmits(['promoRefresh']);

const refreshCodePromo = () => {
  emit('promoRefresh');
};
</script>

<template>
  <div class="guest-sidebar">
    <div class="box p-6 bg-white rounded-sm border border-zinc-100 shadow-sm">
      <ListingCartItems
        :editable="false"
        :mini="true"
        @onCodePromoRemoved="refreshCodePromo"
        checkout
      />
      <PageCheckoutMyRewards
        @onCodePromoApplied="refreshCodePromo"
        class="mt-6"
      />
      <div class="mt-6">
        <FormCodePromo @onCodePromoApplied="refreshCodePromo" />
      </div>
      <hr class="my-6 border-zinc-100" />
      <PageTunnelOrderSummary />

      <PageTunnelFooter class="lg:hidden mt-8" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.guest-sidebar {
  @apply lg:sticky lg:top-8;
}
</style>
