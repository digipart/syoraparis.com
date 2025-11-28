<script setup lang="ts">
import LoyaltyService from '~/services/LoyaltyService';
import type { LoyaltyRewardType } from '~/types/RewardType';
const { MyNotification } = useNotification();

definePageMeta({
  middleware: ['loyalty'],
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.loyalty_reward.title'),
  description: () => t('pages.account.loyalty_reward.description'),
}));

const appStore = useAppStore();
const { languageIsoCode, currencyIsoCode } = toRefs(appStore);

const reward = ref<LoyaltyRewardType | null>(null);

const route = useRoute();
const { idReward } = route.params; // Replace 'id' with the actual parameter name
const isNumber = /^\d+$/.test(idReward as string);

// if (!isNumber) {
//   throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
// }

const loyaltyService = new LoyaltyService();

try {
  reward.value = await loyaltyService.fetshLoyaltyRewardDetail({
    IdLoyaltyReward: Number(idReward),
    IdLoyaltyProgram: 4,
    CurrencyIsoCode: currencyIsoCode.value,
    LanguageIsoCode: languageIsoCode.value,
  });
} catch (error) {
  console.log(error);

  // throw createError({ statusCode: 404, statusMessage: 'Page Not Found' });
}

const loading = ref(false);
const router = useRouter();
const localePath = useLocalePath();

const obtainReward = () => {
  loading.value = true;
  return loyaltyService
    .obtainReward({
      LanguageIsoCode: languageIsoCode.value,
      IdLoyaltyProgram: 8,
      IdLoyaltyReward: reward.value?.IdLoyaltyReward,
    })
    .then((data) => {
      MyNotification({
        title: 'The reward claimed',
        message: h('span', 'The reward has been successfully claimed.'),
      });
      router.replace(
        localePath({
          name: 'account-loyalty-my-rewards',
        })
      );
    })
    .catch((error) => {})
    .finally(() => {
      loading.value = false;
    });
};
</script>

<template>
  <LayoutAccountLoyalty>
    <LayoutContainer class="pageLoyaltyReward">
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-12 lg:col-span-4">
          <NuxtImg :src="reward?.Media?.Image?.Src" />
        </div>

        <div class="col-span-12 lg:col-span-8">
          <BaseHeadLine name="h1" size="xl" class="uppercase font-normal">
            {{ reward?.Title }}
          </BaseHeadLine>
          <p class="text-sm lg:text-base">
            {{ reward?.Description }}
          </p>
          <span
            class="inline-flex items-center gap-1 bg-yellow-100 rounded px-2"
          >
            <IconCoins :size="2" />
            {{ reward?.Points }}
          </span>
          <div class="mt-5">
            <BaseButton
              type="primary"
              class="!px-10"
              @click="obtainReward"
              v-loading="loading"
              :title="$t('button.unlock_with', { points: reward?.Points })"
            >
              {{ $t('button.unlock_with', { points: reward?.Points }) }}
            </BaseButton>
          </div>
        </div>
      </div>
    </LayoutContainer>
  </LayoutAccountLoyalty>
</template>

<style scoped></style>
