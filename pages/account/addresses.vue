<script setup lang="ts">

definePageMeta({
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.my_addresses.title'),
  description: () => t('pages.account.my_addresses.description'),
}));

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);
const { fetchAddresses } = addressStore;

const addAddress = ref(false);
const addressFormAdd = ref<HTMLElement | null>(null);

const openAddAddress = () => {
  addAddress.value = true;
  setTimeout(() => {
    scrollToElementContainer(addressFormAdd.value);
  }, 300);
};

const setAddressHandler = () => {};

onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <LayoutAccountProfil>
    <div class="max-w-[778px]">
      <div>
        <ListingAccountAddresses @onAddressSelected="setAddressHandler" />
        <div class="flex justify-end mt-3 mb-3">
          <span
            class="underline text-xs cursor-pointer"
            @click="openAddAddress()"
          >
            {{ $t('button.add_new_address') }}
          </span>
        </div>
      </div>
      <transition name="slide">
        <div
          v-show="addAddress"
          ref="addressFormAdd"
          class="border border-black p-5"
        >
          <FormAddress
            @cancel="addAddress = !addAddress"
            @onAddressCreated="$emit('onAddressCreated')"
          />
        </div>
      </transition>
    </div>
  </LayoutAccountProfil>
</template>

<style scoped></style>
