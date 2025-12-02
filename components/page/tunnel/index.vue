<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const formDeliveryStore = useFormDeliveryStore();
const { state, v$ } = toRefs(formDeliveryStore);

const auth = useAuth();
const { isLoggedIn, isGuest } = toRefs(auth);
const { registerGuest } = auth;
const { t } = useI18n();
const localePath = useLocalePath();

const router = useRouter();

const step = ref(1);
const formStartDeliveryVisible = ref(true);

const listAddressVisible = ref(false);

const headerStore = useHeaderStore();
const { backClick } = toRefs(headerStore);

const setBackBtnBackClick = () => {
  if (formStartDeliveryVisible.value === true) {
    backClick.value = () => {
      router.back();
    };
  } else {
    backClick.value = () => {
      formStartDeliveryVisible.value = true;
    };
  }
};
const setFormStartDeliveryVisible = () => {
  formStartDeliveryVisible.value = true;
  setBackBtnBackClick();
};
setBackBtnBackClick();

const appStore = useAppStore();
const { currencyIsoCode } = toRefs(appStore);

const shippingStore = useShippingStore();
const { carrier: allCarriers, toshow } = toRefs(shippingStore);
const { fetchShipping } = shippingStore;

const cartStore = useCartStore();
const { totalToPay, carrier, totalProductQuantity } = toRefs(cartStore);
const addressStore = useAddressStore();
const { addressDelivery, addresses } = toRefs(addressStore);
const { fetchAddresses } = addressStore;

const valide = computed(() => {
  return totalProductQuantity.value && addressDelivery.value && carrier.value;
});

const loginFormVisible = ref(false);

const showFormLogin = (event: any) => {
  loginFormVisible.value = event.visible;
};

const onStartDelivery = (event: any) => {
  state.value.email = event.email;
  formStartDeliveryVisible.value = false;
  setBackBtnBackClick();
};

const googleHandler = async () => {
  await fetchAddresses();
  await fetchShipping({
    IdAddress: addressDelivery.value?.IdAddress,
    ResponseLevel: 'summary',
  });
};

const addressesUpdated = async (addressId?: number) => {
  if (!addressId && addressDelivery.value) {
    addressId = addressDelivery.value.IdAddress;
  }
  await fetchShipping({
    IdAddress: addressId,
    ResponseLevel: 'summary',
  });
};

const submitFormDelivery = async () => {
  v$.value.$touch();
  if (!v$.value.$invalid) {
    registerGuest().then(async (data) => {
      await fetchAddresses();
      await fetchShipping({
        IdAddress: addressDelivery.value?.IdAddress,
        ResponseLevel: 'summary',
      });
      step.value = 2;
      setFormStartDeliveryVisible();
    });
  } else {
  }
};

const GuestFormvalide = computed(() => {
  if (isLoggedIn.value) {
    if (!totalProductQuantity.value) {
      return false;
    }
    if (step.value === 1) {
      return addressDelivery.value !== null;
    } else {
      return carrier.value?.IdCarrier !== undefined;
    }
  } else {
    return true;
  }
});
onMounted(async () => {
  if (isLoggedIn.value) {
    if (isGuest.value) {
      step.value = 2;
    }
  }
});
</script>

<template>
  <LayoutContainer small>
    <!-- <NuxtLink
      to="/"
      class="hidden lg:inline-flex items-center cursor-pointer text-sm mb-2"
    >
      <IconChevronLeft :size="1.3" class="mr-2" />
      {{ t('label.continue_shopping') }}
    </NuxtLink> -->
    <div class="grid grid-cols-12 gap-5 items-start pb-16">
      <div class="col-span-12 lg:col-span-8">
        <div class="lg:mb-5 block lg:hidden">
          <BaseCollapsible>
            <BaseCollapsibleItem :index="0" :closeOthers="true">
              <template #header>
                <div class="flex justify-between w-full items-center">
                  <BaseHeadLine size="md" class="uppercase font-normal">
                    {{ t('cart.title') }} ({{ totalProductQuantity }})
                  </BaseHeadLine>
                </div>
              </template>
              <template #content>
                <div class="p-5">
                  <NuxtLink
                    :to="
                      localePath({
                        name: 'cart',
                      })
                    "
                    class="block"
                  >
                    <BaseButton
                      type="primary"
                      size="small"
                      plain
                      class="w-full"
                    >
                      {{ $t('button.edit_cart') }}
                    </BaseButton>
                  </NuxtLink>
                  <hr class="my-4" />
                  <ListingCartItems :editable="false" />
                </div>
              </template>
            </BaseCollapsibleItem>
          </BaseCollapsible>
        </div>

        <!-- Delivery Options -->
        <BasePanel
          :title="t('tunnel.delivery.title')"
          class="mb-[-1px] lg:mb-5"
        >
          <div class="mb-3" v-if="isLoggedIn">
            <BaseHeadLine size="sm" class="uppercase font-normal">
              {{ $t('label.address_delivery') }} :
            </BaseHeadLine>

            <!-- Delivery address selected -->
            <div
              v-if="addressDelivery"
              class="border border-black px-5 py-3 mt-3"
            >
              <PageCheckoutDeliveryAddressShippingSelected
                hideShipping
                @onAddressSubmited="addressesUpdated()"
              />
            </div>
            <span
              class="underline text-xs cursor-pointer"
              @click="listAddressVisible = !listAddressVisible"
            >
              {{ t('button.select_another_address') }}
            </span>
          </div>

          <div v-show="!isLoggedIn" ref="formDeliveryRef" class="">
            <BaseHeadLine size="sm" class="uppercase font-normal mb-5">
              {{ $t('titles.complete_the_form') }} :
            </BaseHeadLine>

            <div v-if="formStartDeliveryVisible">
              <div>
                <PageTunnelFormStartDelivery
                  @onSubmit="onStartDelivery"
                  @onGoogleSubmit="googleHandler()"
                />
              </div>
            </div>
            <div v-else>
              <PageCheckoutGuest ref="PageCheckoutGuest" />
              <BaseButton
                v-if="!loginFormVisible"
                type="primary"
                class="w-full"
                size="medium"
                @click="submitFormDelivery()"
                :disabled="!GuestFormvalide"
              >
                {{ $t('button.register') }}
              </BaseButton>
              <BaseButton
                v-if="!loginFormVisible"
                type="primary"
                class="w-full mt-3"
                plain
                size="medium"
                @click="setFormStartDeliveryVisible()"
              >
                {{ $t('button.cancel') }}
              </BaseButton>
            </div>
          </div>

          <transition name="slide">
            <PageCheckoutStepDelivery
              v-if="
                listAddressVisible || (addresses.length === 0 && isLoggedIn)
              "
              class="mt-5"
              @onAddressCreated="addressesUpdated($event)"
            />
          </transition>

          <!-- Shipping option -->
          <template v-if="Object.keys(allCarriers).length">
            <hr class="mt-5 mb-5" />
            <div class="flex justify-between gap-5">
              <BaseHeadLine size="sm" class="uppercase font-normal mb-3">
                {{ $t('label.address_delivery') }} :
              </BaseHeadLine>
              <div>
                <ul class="flex gap-3 text-sm">
                  <li
                    class="cursor-pointer"
                    :class="{ 'underline font-normal': toshow === 'all' }"
                    @click="toshow = 'all'"
                  >
                    {{ t('label.all') }}
                  </li>
                  <li
                    v-for="(carrierGroup, groupName) in allCarriers"
                    class="cursor-pointer"
                    :class="{ 'underline font-normal': toshow === groupName }"
                    @click="toshow = groupName"
                  >
                    {{ $t('label.' + groupName) }}
                  </li>
                </ul>
              </div>
            </div>
            <FormShipping />
          </template>
        </BasePanel>

        <!-- Payment step -->
        <BasePanel v-if="valide" :title="$t('tunnel.payment.title')">
          <FormPayment :disabled="!valide" />
        </BasePanel>
      </div>

      <div class="col-span-12 lg:col-span-4 lg:sticky top-[4.5rem]">
        <BasePanel
          :title="t('tunnel.delivery.order_summary.title')"
          class="mb-5"
        >
          <PageTunnelOrderSummary />
        </BasePanel>
        <BasePanel class="hidden lg:block" bodyPadding="0px">
          <template #header>
            <div class="flex gap-3 justify-between items-center">
              <BaseHeadLine size="md" class="font-normal uppercase">
                {{ $t('cart.title') }} ({{ totalProductQuantity }})
              </BaseHeadLine>
              <NuxtLink
                :to="localePath({ name: 'cart' })"
                class="text-sm underline"
              >
                {{ $t('button.modify') }}
              </NuxtLink>
            </div>
          </template>
          <PerfectScrollbar class="max-h-[944px] overflow-auto p-5">
            <ListingCartItems :editable="false" :mini="true" />
          </PerfectScrollbar>
        </BasePanel>
      </div>
    </div>
    <Teleport to="body">
      <div
        class="flex lg:hidden fixed bottom-0 w-full border-t border-black bg-white py-3 px-5"
      >
        <div class="flex-1 flex items-center font-normal justify-end text-sm">
          <span class="ml-5 mr-2 uppercase">{{ $t('cart.total') }} : </span>
          <span class="font-normal text-base">
            {{ totalToPay }} {{ currencyIsoCode }}</span
          >
        </div>
      </div>
    </Teleport>
  </LayoutContainer>
</template>

<style scoped></style>
