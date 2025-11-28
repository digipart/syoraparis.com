<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();


const tabItems = ref([
  {
    label: t('label.my_profil'),
    name: 'account-profil',
  },
  {
    label: t('label.my_addresses'),
    name: 'account-addresses',
  },
  {
    label: t('label.newsletter'),
    name: 'account-newsletter',
  },
]);

</script>

<template>
  <LayoutAccount>
    <LayoutAccountChildMenu
      :items="tabItems"
      class="mb-8 md:mb-14 lg:mb-20 mt-10"
    />
    <slot />
  </LayoutAccount>
</template>

<style scoped></style>
