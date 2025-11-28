<script setup lang="ts">
import User from '~/components/icon/user.vue';
import Cart from '~/components/icon/cart.vue';
import Favorite from '~/components/icon/favorite.vue';
import Loyalty from '~/components/icon/loyalty.vue';
import CustomerService from '~/components/icon/CustomerService.vue';

const runtimeConfig = useRuntimeConfig();
const { t, locale } = useI18n();
const localePath = useLocalePath();

const route = useRoute();

const isActive = (routeName: string) => {
  return route.name === `${routeName}___${locale.value}`;
};

const menuItems = ref([
  {
    label: t('label.my_orders'),
    icon: markRaw(User),
    name: 'account-orders',
    routesNameActives: ['account-orders', 'account-returns'],
  },
  {
    label: t('label.my_profil'),
    icon: markRaw(Cart),
    name: 'account-profil',
    routesNameActives: ['account-profil'],
  },
  {
    label: t('label.my_favorites'),
    icon: markRaw(Favorite),
    name: 'account-favorites',
    routesNameActives: ['account-favorites'],
  },
  {
    label: t('label.customer_Service'),
    icon: markRaw(CustomerService),
    name: 'account-service',
    routesNameActives: ['account-service'],
  },
]);
if (runtimeConfig.public.appReferral === 'enabled') {
  menuItems.value.push({
    label: t('label.loyalty'),
    icon: markRaw(Loyalty),
    name: 'account-loyalty',
    routesNameActives: ['account-loyalty'],
  });
}
</script>

<template>
  <div class="accountMenu">
    <LayoutAccountMenuItem
      v-for="(item, index) in menuItems"
      :key="index"
      :item="item"
    />
  </div>
</template>

<style lang="scss">
$accountMenu: '.accountMenu';

#{$accountMenu} {
  @apply flex gap-3 flex-wrap;
}
</style>
