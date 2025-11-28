<script setup lang="ts">
const localePath = useLocalePath();

const activeTab = ref('');
</script>

<template>
  <div>
    <div class="flex border-b border-t border-black uppercase mb-5 -mx-5">
      <div
        class="h-14 flex-1 text-center flex items-center justify-center border-r border-black"
        :class="{ active: activeTab === 'home_office' }"
      >
        {{ $t('tunnel.delivery.home_office') }}
      </div>
      <div
        :class="{ active: activeTab === 'drop_point' }"
        class="h-14 flex-1 text-center flex items-center justify-center"
      >
        {{ $t('tunnel.delivery.drop_point') }}
      </div>
    </div>
    <label class="text-xs font-normal uppercase mb-2 block">
      {{ $t('tunnel.delivery.select_you_shipping') }}
    </label>
    <FormShipping />
    <div class="flex-1 mt-5">
      <p class="text-xs">
        {{ $t('membership.message', { amount: 79, returnDays: 60 }) }}
        <NuxtLink
          :to="localePath({ name: 'account-login' })"
          class="font-medium underline"
        >
          {{ $t('membership.login') }}
        </NuxtLink>
        {{ $t('label.or') }}
        <NuxtLink
          :to="localePath({ name: 'account-register' })"
          class="font-medium underline"
        >
          {{ $t('membership.signup') }}
        </NuxtLink>
        {{ $t('membership.now') }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  @apply font-normal;
}
</style>
