<template>
  <BaseModal v-model="isVisible">
    <template #header>
      {{ $t('titles.welcome_to', { shopname: shopName }) }}
    </template>
    <div class="text-sm text-justify" v-html="$t('html.cookies_info')"></div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <BaseButton size="small" @click="decline()">
          {{ $t('button.continue_without_accepting') }}
        </BaseButton>
        <BaseButton type="primary" size="small" @click="accept()">
          {{
            $t('button.accept_cookies', {
              shopname: shopName,
              terms_link: '/#',
            })
          }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
const cookiesPopUpStore = useCookiesPopUpStore();
const { acceptCookies, declineCookies } = cookiesPopUpStore;
const { cookiesPopUpVisible } = toRefs(cookiesPopUpStore);

const appStore = useAppStore();
const { shopName } = toRefs(appStore);
const isVisible = ref(cookiesPopUpVisible.value);

const accept = () => {
  isVisible.value = false;
  acceptCookies();
};
const decline = () => {
  isVisible.value = false;
  declineCookies();
};
</script>

<style scoped></style>
