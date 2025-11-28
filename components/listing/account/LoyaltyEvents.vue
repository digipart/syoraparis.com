<template>
  <div v-if="loyaltyEvents?.LoyaltyEvent?.length" class="loyaltyEvent">
    <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
      {{ $t('label.loyalty_events') }}
    </BaseHeadLine>
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="loyaltyEvent in loyaltyEvents?.LoyaltyEvent"
        :key="loyaltyEvent.IdLoyaltyProgramEvent"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      >
        <CardEvent :loyaltyEvent="loyaltyEvent" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyEvents } = loyaltyStore;
const { loyaltyEvents, loyaltyCustomer } = toRefs(loyaltyStore);

fetshLoyaltyEvents();
</script>

<style lang="scss">
$loyaltyEvent: '.loyaltyEvent';

#{$loyaltyEvent} {
}
</style>
