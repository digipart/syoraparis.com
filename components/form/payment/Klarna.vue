<template>
  <div>
    <div class="mb-3">
      <span
        class="text-xs ml-1 inline-block -translate-y-0.5"
        v-html="
          t('tunnel.payment.cgv', {
            shopname: shopName,
            link_cgv: localePath({
              name: 'terms-and-conditions',
            }),
          })
        "
      >
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);
const localePath = useLocalePath();
</script>

<style scoped></style>
