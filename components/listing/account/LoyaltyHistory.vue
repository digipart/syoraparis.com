<script setup lang="ts">
// #i18n#
const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyHistory } = loyaltyStore;
const { loyaltyHistory } = toRefs(loyaltyStore);

fetshLoyaltyHistory();
</script>

<template>
  <div v-if="loyaltyHistory?.LoyaltyEvents?.length" class="loyaltyHistory">
    <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
      {{ $t('label.my_points_history') }}
    </BaseHeadLine>
    <div class="flex flex-col border-t border-black">
      <div
        v-for="history in loyaltyHistory.LoyaltyEvents"
        class="border-b border-black py-2 flex justify-between"
      >
        <div class="flex items-center gap-3">
          <IconArrowUp
            v-if="history.TransactionType?.Code"
            class="text-green-400"
          />
          <IconArrowDown v-else class="text-red-400" />
          <div class="flex flex-col">
            <span>
              {{ history.Message }}
            </span>
            <span class="text-xs text-gray-888">
              {{ history.Name }}
            </span>
          </div>
        </div>
        <div class="flex text-sm items-center gap-3">
          <span>
            {{ history.Date }}
          </span>
          <span class="inline-block bg-gray-bbb/50 py-1 px-3 rounded-sm">
            {{ history.Points }} p
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$loyaltyHistory: '.loyaltyHistory';

#{$loyaltyHistory} {
}
</style>
