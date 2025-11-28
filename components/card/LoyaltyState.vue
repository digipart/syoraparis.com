<script setup lang="ts">
const auth = useAuth();
const { customer } = toRefs(auth);
const loyaltyStore = useLoyaltyStore();
const { loyaltyCustomer, tierList } = toRefs(loyaltyStore);
const { fetshLoyaltyTier, fetshLoyaltyCustomer } = loyaltyStore;

// const tierList = ref({
//   IdLoyaltyProgram: '4',
//   LanguageIsoCode: 'fr',
//   Count: 3,
//   LoyaltyProgramTiers: [
//     {
//       IdLoyaltyProgramTier: 2,
//       LoyaltyProgramTierDefaultName: 'Essentiel',
//       LoyaltyProgramTierFromTotalPoint: 0,
//       LoyaltyProgramTierToTotalPoint: 499,
//       LoyaltyProgramTierActive: 1,
//     },
//     {
//       IdLoyaltyProgramTier: 4,
//       LoyaltyProgramTierDefaultName: 'Premium',
//       LoyaltyProgramTierFromTotalPoint: 500,
//       LoyaltyProgramTierToTotalPoint: 5999,
//       LoyaltyProgramTierActive: 1,
//     },
//     {
//       IdLoyaltyProgramTier: 5,
//       LoyaltyProgramTierDefaultName: 'Exception',
//       LoyaltyProgramTierFromTotalPoint: 6000,
//       LoyaltyProgramTierToTotalPoint: 100000,
//       LoyaltyProgramTierActive: 1,
//     },
//   ],
// });

// try {
//   await fetshLoyaltyCustomer();
//   await fetshLoyaltyTier();
// } catch (error) {}

const nextTier = computed(() => {
  const points = loyaltyCustomer.value?.TotalCumulatePoints || 0;

  const currentTierIndex =
    tierList.value?.LoyaltyProgramTiers?.findIndex((item) => {
      return (
        points >= (item?.LoyaltyProgramTierFromTotalPoint || 0) &&
        points < (item?.LoyaltyProgramTierToTotalPoint || 0)
      );
    }) || 0;

  if (tierList.value?.LoyaltyProgramTiers) {
    if (
      (currentTierIndex || 0) <
      tierList.value?.LoyaltyProgramTiers.length - 1
    ) {
      return tierList.value.LoyaltyProgramTiers[currentTierIndex + 1];
    }
  }

  return null;
});

const pointsRemain = computed(() => {
  return (
    (nextTier.value?.LoyaltyProgramTierFromTotalPoint || 0) -
    (loyaltyCustomer.value?.TotalPoints || 0)
  );
});

const progersse = computed(() => {
  return (
    ((loyaltyCustomer.value?.TotalPoints || 0) /
      (nextTier.value?.LoyaltyProgramTierFromTotalPoint || 0)) *
    100
  );
});
</script>

<template>
  <div v-if="loyaltyCustomer?.Subscribed">
    <BaseHeadLine size="lg">
      {{ $t('loyalty.customer_state.welcome') }}
      <b>{{ customer?.Firstname }}</b>
    </BaseHeadLine>
    <div class="mb-3">
      {{ $t('loyalty.customer_state.you_have') }}
      <b>{{ loyaltyCustomer?.TotalPoints }} {{$t('label.points')}}</b>,
      {{ $t('loyalty.customer_state.your_status_is') }}
      <b> {{ loyaltyCustomer?.LoyaltyProgram?.Tier?.Name }} </b>.
    </div>
    <div class="mb-5">
      <NuxtImg
        :src="loyaltyCustomer?.LoyaltyProgram?.Card?.Media?.Image?.Src"
        class="max-w-sm w-full"
      />
      <span class="text-sm">
        {{ loyaltyCustomer?.LoyaltyProgram?.Card?.Number }}
      </span>
    </div>

    <div v-if="nextTier" class="text-sm font-extralight mt-3">
      {{
        $t('loyalty.customer_state.points_remaining', { points: pointsRemain })
      }}
      <b>{{ nextTier.LoyaltyProgramTierDefaultName }}</b>
      <div class="max-w-md mt-1">
        <BaseProgressBar :progress="progersse" />
      </div>
      <div>
        {{ loyaltyCustomer?.TotalPoints }}
        /
        {{ nextTier?.LoyaltyProgramTierFromTotalPoint }}
      </div>
    </div>
  </div>
</template>

<style scoped></style>
