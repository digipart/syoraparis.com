<template>
  <div class="cardEvent" :class="{ disabled: disabled }">
    <div class="cardEvent-top" :class="{ 'opacity-70': disabled }">
      <NuxtImg :src="loyaltyEvent.Src" class="w-full" />
    </div>
    <div class="cardEvent-body">
      <BaseHeadLine name="h3" size="sm">
        {{ loyaltyEvent.LoyaltyProgramEventName }}
      </BaseHeadLine>
      <p class="text-xs mt-2 text-gray-888 mb-3">
        {{ loyaltyEvent.LoyaltyProgramEventDescriptionShort }}
      </p>
      <div class="mb-3">
        <span
          class="inline-flex items-center text-xs gap-1 bg-yellow-100 rounded px-1"
        >
          <IconCoins :size="2" />
          {{ loyaltyEvent.LoyaltyProgramEventCustomer?.TotalEarn }}
        </span>
      </div>
      <BaseButton
        v-if="loyaltyEvent.LoyaltyProgramEventButton"
        type="primary"
        size="small"
        class="w-full"
        :title="$t('button.earn_points')"
      >
        {{ $t('button.earn_points') }}
      </BaseButton>
      <div
        v-else
        class="border h-8 text-center text-sm py-1 uppercase text-gray-888 border-gray-888"
      >
        {{ $t('button.already_subscribed') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LoyaltyEvent } from '~/types/LoyaltyEventsType';
import type { LoyaltyRewardType } from '~/types/RewardType';

const loyaltyStore = useLoyaltyStore();
const { loyaltyCustomer } = toRefs(loyaltyStore);
const localePath = useLocalePath();

const { loyaltyEvent } = defineProps({
  loyaltyEvent: {
    type: {} as PropType<LoyaltyEvent>,
    required: true,
  },
});

const disabled = computed(() => {
  return false;
});

const isButton = computed(() => {
  if (loyaltyEvent.LoyaltyProgramEventButton) {
  }
});
</script>

<style lang="scss">
$cardEvent: '.cardEvent';

#{$cardEvent} {
  @apply border border-black;

  &-body {
    @apply px-3 pt-2 pb-3;
  }

  &.disabled {
    filter: blur(0.8px);
    @apply text-gray-888 border-gray-888;
    #{$cardEvent} {
    }
  }
}
</style>
