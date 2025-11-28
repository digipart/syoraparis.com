<template>
  <div>
    <div class="mb-3">
      <span class="text-xs ml-1 inline-block -translate-y-0.5">
        {{ t('tunnel.payment.cgv', { shopname: shopName }) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);
</script>

<style scoped></style>
