<template>
  <div v-if="loyaltyRewards?.LoyaltyRewards?.length" class="loyaltyHistory">
    <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
      {{ $t('label.rewards_catalog') }}
    </BaseHeadLine>
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="reward in loyaltyRewards?.LoyaltyRewards"
        :key="reward.IdLoyaltyReward"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      >
        <CardReward :reward="reward" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyRewards } = loyaltyStore;
const { loyaltyRewards, loyaltyCustomer } = toRefs(loyaltyStore);

fetshLoyaltyRewards();
</script>

<style lang="scss">
$loyaltyHistory: '.loyaltyHistory';

#{$loyaltyHistory} {
}
</style>
