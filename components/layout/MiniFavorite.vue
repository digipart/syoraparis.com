<script setup lang="ts">
const appStore = useAppStore();
const { miniFavoriteVisible, miniCartVisible } = toRefs(appStore);

const auth = useAuth();
const { isLoggedIn } = toRefs(auth);

const openMiniCart = () => {
  miniCartVisible.value = true;
  miniFavoriteVisible.value = false;
};
const localePath = useLocalePath();
</script>
<template>
  <BaseDrawer v-model="miniFavoriteVisible" size="768px">
    <template #header>
      <div
        class="min-h-14 border-b border-black flex justify-between items-center -mx-5 px-5 -mt-2"
      >
        <BaseHeadLine class="uppercase">
          {{ $t('label.my_favorites') }}</BaseHeadLine
        >
      </div>
      <div class="min-h-14 flex justify-between items-center -mx-5 px-5 -mb-2">
        <div></div>
        <NuxtLink
          :to="
            localePath({
              name: 'account-favorites',
            })
          "
        >
          <BaseButton
            type="primary"
            class="w-full min-w-52"
            @click="openMiniCart"
            :title="$t('button.cart')"
          >
            {{ $t('label.my_favorites') }}
          </BaseButton>
        </NuxtLink>
      </div>
    </template>

    <div>
      <ListingFavoriteItems />
    </div>

    <template v-if="!isLoggedIn" #footer>
      <div class="flex items-center gap-5 w-full">
        <div class="flex-1">
          <p class="text-left text-xxs md:text-xs">
            {{ $t('html.mini_favorite') }}
          </p>
        </div>
        <div>
          <NuxtLink :to="localePath({ name: 'account-login' })">
            <BaseButton
              type="primary"
              :title="$t('button.login')"
              class="w-full"
              @click="miniFavoriteVisible = false"
              size="small"
            >
              {{ $t('button.save') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </template>
  </BaseDrawer>
</template>

<style scoped></style>
