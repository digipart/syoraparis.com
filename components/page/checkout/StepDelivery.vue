<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const auth = useAuth();
const { isLoggedIn } = toRefs(auth);

const stepDelivery = ref<HTMLElement | null>(null);

const emit = defineEmits(['onAddressCreated']);

const onAddressCreated = (addressId: number) => {
  scrollToElementContainer(stepDelivery.value);
  emit('onAddressCreated', addressId);
};
</script>

<template>
  <div ref="stepDelivery">
    <div v-if="isLoggedIn">
      <PageCheckoutCustomer @onAddressCreated="onAddressCreated($event)" />
    </div>

    <div v-else ref="formDeliveryRef">
      <PageCheckoutGuest ref="PageCheckoutGuest" />
    </div>
  </div>
</template>

<style scoped></style>
