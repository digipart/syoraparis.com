<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const addressStore = useAddressStore();
const { addressDelivery, addressInvoice } = toRefs(addressStore);

const { address, activeType } = defineProps({
  address: {
    type: {} as PropType<AddressType>,
  },
  activeType: {
    type: String as PropType<'Delivery' | 'Invoice'>,
  },
});

const active = computed(() => {
  if (activeType === 'Delivery') {
    return address?.IdAddress === addressDelivery.value?.IdAddress;
  } else if (activeType === 'Invoice') {
    return address?.IdAddress === addressInvoice.value?.IdAddress;
  } else {
    return (
      address?.IdAddress === addressDelivery.value?.IdAddress ||
      address?.IdAddress === addressInvoice.value?.IdAddress
    );
  }
});

const emit = defineEmits(['onSelect']);

const edit = ref(false);

const clickHandler = () => {
  if (!edit.value) {
    emit('onSelect');
  }
};
</script>

<template>
  <div class="cardAddress" :class="{ active: active }" @click="clickHandler">
    <span class="cardAddress-modify" @click.stop="edit = !edit">
      {{ $t('button.modify') }}
    </span>
    <span class="cardAddress-select">
      {{ $t('button.select') }}
    </span>
    <div class="flex flex-col">
      <span class="text-sm font-normal mb-2">{{ address?.Alias }} </span>
      <span>
        {{ address?.Address1 }} <br />
        {{ address?.Postcode }}
      </span>
      <span> {{ address?.Country }} </span>
    </div>
    <transition name="slide">
      <FormAddress
        v-if="edit"
        class="mt-5"
        @cancel="edit = !edit"
        :address="address"
        input-border
      />
    </transition>
  </div>
</template>

<style scoped lang="scss">
$cardAddress: '.cardAddress';

#{$cardAddress} {
  @apply border border-gray-bbb relative uppercase text-xs px-5 py-3 bg-white;

  &.active {
    @apply border-black;
  }

  &-modify {
    @apply cursor-pointer absolute top-4 right-5 normal-case underline;
  }

  &-select {
    @apply cursor-pointer absolute bottom-4 right-5 normal-case underline;
  }
}
</style>
