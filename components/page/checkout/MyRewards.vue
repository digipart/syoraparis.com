<script setup lang="ts">
import CodepromoService from '~/services/CodepromoService';

const loyaltyStore = useLoyaltyStore();
const { fetshLoyaltyMyRewards } = loyaltyStore;
const { loyaltyMyRewards } = toRefs(loyaltyStore);

const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);
const loading = ref(false);
const useCart = useCartStore();
const { fetchCart } = useCart;
const { cart } = toRefs(useCart);

const auth = useAuth();
const { isLoggedIn, isGuest } = toRefs(auth);

const emit = defineEmits(['onCodePromoApplied']);

onMounted(async () => {
  if (isLoggedIn.value) {
    if (!isGuest.value) {
      fetshLoyaltyMyRewards();
    }
  }
});

const applyCode = (code: string) => {
  const codepromoService = new CodepromoService();
  if (cart.value.IdCart) {
    loading.value = true;
    codepromoService
      .apply({
        PromoCode: code,
        IdCart: cart.value.IdCart,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then(async () => {
        await fetchCart();
        emit('onCodePromoApplied');
      })
      .catch((error) => {})
      .finally(() => {
        loading.value = false;
      });
  }
};

const isUsed = (code: string | number) => {
  return cart.value.Discounts?.PromoCodes?.some((cp) => cp.Code === code);
};
</script>

<template>
  <BasePanel
    :title="$t('label.my_rewards')"
    class="mb-5"
    v-loading="loading"
    v-if="loyaltyMyRewards?.LoyaltyRewards?.length"
  >
    <div class="flex flex-col gap-3">
      <div
        v-for="reward in loyaltyMyRewards.LoyaltyRewards"
        class="flex items-center gap-2 justify-between"
        :class="{ 'opacity-50': isUsed(reward.Type?.Code || '') }"
      >
        <div class="flex items-center gap-2">
          <NuxtImg :src="reward.Media?.Image?.Src" class="w-14" />
          <span class="text-xs">{{ reward.CodeName }} </span>
        </div>
        <BaseButton
          v-if="reward.Type?.Code"
          type="primary"
          size="small"
          plain
          :title="$t('button.apply')"
          :disabled="loading || isUsed(reward.Type?.Code || '')"
          @click="applyCode(reward.Type?.Code as string)"
        >
          {{ $t('button.apply') }}
        </BaseButton>
      </div>
    </div>
  </BasePanel>
</template>

<style scoped></style>
