<script setup lang="ts">
import ShopService from '~/services/ShopService';

definePageMeta({
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.newsletter.title'),
  description: () => t('pages.account.newsletter.description'),
}));

const appStore = useAppStore();
const { currencyIsoCode, languageIsoCode, shopName } = toRefs(appStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const newsletter = ref(false);

const submit = () => {
  const shopService = new ShopService();
  if (newsletter.value) {
    shopService.subscribeNewsletter({
      Email: customer.value?.Email,
      CurrencyIsoCode: currencyIsoCode.value,
      LanguageIsoCode: languageIsoCode.value,
    });
  } else {
    shopService.unSubscribeNewsletter();
  }
};
</script>

<template>
  <LayoutAccountProfil>
    <div class="max-w-[778px]">
      <BaseHeadLine class="uppercase font-normal mb-2">
        {{ $t('account.newsletter.title') }}
      </BaseHeadLine>
      <p class="text-sm font-light mb-5">
        {{ $t('account.newsletter.discription') }}
      </p>

      <div class="mb-5">
        <InputCheckBox id="accountProfilNewsletter" v-model="newsletter">
          {{ $t('label.receive_newsletter', { shopname: shopName }) }} *
        </InputCheckBox>
      </div>

      <BaseButton type="primary" @click="submit()">
        {{ $t('button.save') }}
      </BaseButton>
      <BaseHr />
      <div
        class="text-xs font-light"
        v-html="
          $t('html.newsletter_read_understood', {
            privacyLink: '#',
            shopname: shopName,
          })
        "
      ></div>
    </div>
  </LayoutAccountProfil>
</template>

<style scoped></style>
