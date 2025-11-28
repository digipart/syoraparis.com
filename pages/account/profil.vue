<script setup lang="ts">
// #i18n#
const { t } = useI18n();

definePageMeta({
  requireAuth: true,
});
useHead(() => ({
  title: () => t('pages.account.my_profil.title'),
  description: () => t('pages.account.my_profil.description'),
}));

const runtimeConfig = useRuntimeConfig();
const auth = useAuth();
const { customer } = toRefs(auth);
const localePath = useLocalePath();
const router = useRouter();

const loyaltyStore = useLoyaltyStore();
const { loyaltyCustomer } = toRefs(loyaltyStore);
const { fetshLoyaltyCustomer, fetshLoyaltyTier } = loyaltyStore;

const edit = ref(false);

const logOut = () => {
  auth.logout();
  router.replace(localePath({ name: 'index' }));
};

fetshLoyaltyCustomer().then(() => {
  fetshLoyaltyTier();
});
</script>

<template>
  <LayoutAccountProfil>
    <div class="grid grid-cols-12 gap-x-5 gap-y-10">
      <div class="col-span-12 md:col-span-6 lg:col-span-6 order-2 lg:order-1">
        <div class="max-w-screen-md">
          <div v-if="!edit" class="grid grid-cols-12 flex-col gap-5">
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.firstname') }} :</div>
              <div class="text-lg font-normal">{{ customer?.Firstname }}</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.lastname') }} :</div>
              <div class="text-lg font-normal">{{ customer?.Lastname }}</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.email') }} :</div>
              <div class="text-lg font-normal">{{ customer?.Email }}</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.birthdate') }} :</div>
              <div class="text-lg font-normal">{{ customer?.Birthday }}</div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.your_language') }} :</div>
              <div class="text-lg font-normal">
                {{ customer?.LanguageIsoCode }}
              </div>
            </div>
            <div class="col-span-12 md:col-span-6">
              <div class="text-sm">{{ $t('label.your_currency') }} :</div>
              <div class="text-lg font-normal">
                {{ customer?.CurrencyIsoCode }}
              </div>
            </div>

            <div class="col-span-4 mt-8">
              <BaseButton
                type="primary"
                plain
                class="w-full"
                @click="edit = true"
              >
                {{ $t('button.modify') }}
              </BaseButton>
            </div>

            <div class="col-span-12">
              <span
                class="text-sm cursor-pointer border-b border-black"
                @click="logOut()"
              >
                <IconLogout class="-ml-1.5" />
                {{ $t('button.logout') }}
              </span>
            </div>
          </div>

          <FormUpdateProfil
            v-else
            @cancelClick="edit = false"
            @onSuccess="edit = false"
          />
        </div>
      </div>
      <div class="col-span-12 md:col-span-6 lg:col-span-6 order-1 lg:order-2">
        <CardLoyaltyState class="mb-10" />
        <ListingAccountReferralInvitedSponsored
          v-if="runtimeConfig.public.appReferral === 'enabled'"
        />
      </div>
    </div>
  </LayoutAccountProfil>
</template>
