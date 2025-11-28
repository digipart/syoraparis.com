<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();

const { items } = defineProps<{
  items: {
    label: string;
    name: string;
  }[];
}>();
</script>

<template>
  <div class="chileMenu">
    <div class="flex gap-4 flex-wrap">
      <LayoutAccountChildMenuItem
        v-for="(tab, index) in items"
        :key="index"
        :item="tab"
      />
    </div>
    <BaseHr spacing="0.2rem" />
  </div>
</template>

<style lang="scss">
$chileMenu: '.chileMenu';

#{$chileMenu} {
}
</style>
