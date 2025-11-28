<script setup lang="ts">
import type { LoyaltyRewardType } from '~/types/RewardType';

const loyaltyStore = useLoyaltyStore();
const { loyaltyCustomer } = toRefs(loyaltyStore);
const localePath = useLocalePath();
const { MyNotification } = useNotification();

const { t } = useI18n();

const { reward, myReward } = defineProps({
  reward: {
    type: {} as PropType<LoyaltyRewardType>,
    required: true,
  },
  myReward: {
    type: Boolean,
    default: false,
  },
});

const disabled = computed(() => {
  return (
    (reward?.Points || 0) > (loyaltyCustomer.value?.TotalPoints || 0) &&
    !myReward
  );
  //   return (reward?.Points || 0) <= 8020;
});

const copyCode = () => {
  const code = reward.Type?.Code;

  if (code) {
    copyTextClipBoard(code as string);
    MyNotification({
      title: t('label.copied'),
      message: h('span', t('messages.promocode_has_copied')),
    });
  }
};
</script>

<template>
  <div class="cardReward" :class="{ disabled: disabled }">
    <div class="cardReward-top" :class="{ 'opacity-70': disabled }">
      <NuxtImg :src="reward.Media?.Image?.Src" class="w-full" />
    </div>
    <div class="cardReward-body">
      <BaseHeadLine name="h3" size="sm">
        {{ reward.Title }}
      </BaseHeadLine>
      <p class="text-xs mt-2 text-gray-888 mb-3">
        {{ reward.Description }}
      </p>
      <div
        v-if="reward.Type?.Code"
        class="inline-flex gap-1 text-xs bg-gray-bbb/20 px-3 py-2 mb-3"
      >
        {{ $t('label.promocode') }} :
        <span class="text-black"> {{ reward.Type?.Code }}</span>
      </div>

      <BaseButton
        v-if="myReward"
        type="primary"
        size="small"
        class="w-full"
        @click="copyCode"
        :title="$t('button.copy_to_clipboard')"
      >
        {{ $t('button.copy_to_clipboard') }}
      </BaseButton>

      <NuxtLink
        v-else
        :to="
          localePath({
            name: 'account-loyalty-reward-idReward',
            params: {
              idReward: reward.IdLoyaltyReward,
            },
          })
        "
        :class="{ 'pointer-events-none': disabled }"
      >
        <BaseButton
          type="primary"
          plain
          size="small"
          class="w-full"
          :class="{ '!border-gray-888 !text-gray-888': disabled }"
          :title="$t('button.unlock_with', { points: reward?.Points })"
        >
          {{ $t('button.unlock_with', { points: reward?.Points }) }}
        </BaseButton>
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
$cardReward: '.cardReward';

#{$cardReward} {
  @apply border border-black;

  &-body {
    @apply px-3 pt-2 pb-3;
  }

  &.disabled {
    filter: blur(0.8px);
    @apply text-gray-888 border-gray-888;
    #{$cardReward} {
    }
  }
}
</style>
