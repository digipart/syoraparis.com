<script setup lang="ts">
// #i18n#
definePageMeta({
  middleware: ['loyalty'],
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.loyalty.title'),
  description: () => t('pages.account.loyalty.description'),
}));

const loyaltyStore = useLoyaltyStore();
const { loyaltyCustomer } = toRefs(loyaltyStore);

const appStore = useAppStore();
const { shopName } = toRefs(appStore);
</script>
<template>
  <LayoutAccountLoyalty>
    <div v-if="loyaltyCustomer?.Subscribed">
      <ListingAccountLoyaltyMyRewards class="mb-10" />
      <ListingAccountLoyaltyRewards class="mb-10" />
      <ListingAccountLoyaltyHistory />
    </div>
    <div v-else class="max-w-screen-md">
      <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
        {{ $t('loyalty.form_subscribe.title', { shopname: shopName }) }}
      </BaseHeadLine>
      <p
        class="text-sm mb-5"
        v-html="
          $t('loyalty.form_subscribe.description', {
            shopname: shopName,
          })
        "
      ></p>
      <FormLoyaltySubscription />
    </div>
  </LayoutAccountLoyalty>
</template>

<style scoped></style>
