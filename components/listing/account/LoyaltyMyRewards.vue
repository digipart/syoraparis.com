<template>
  <div v-if="loyaltyMyRewards?.LoyaltyRewards?.length" class="loyaltyHistory">
    <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
      {{ $t('label.my_rewards') }}
    </BaseHeadLine>
    <div class="grid grid-cols-12 gap-5">
      <div
        v-for="reward in loyaltyMyRewards?.LoyaltyRewards"
        :key="reward.IdLoyaltyReward"
        class="col-span-12 md:col-span-6 lg:col-span-3"
      >
        <CardReward :reward="reward" myReward />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyMyRewards } = loyaltyStore;
const { loyaltyMyRewards, loyaltyCustomer } = toRefs(loyaltyStore);

fetshLoyaltyMyRewards();
</script>

<style lang="scss">
$loyaltyHistory: '.loyaltyHistory';

#{$loyaltyHistory} {
}
</style>
