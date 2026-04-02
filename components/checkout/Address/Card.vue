<script setup lang="ts">
import type { AddressType } from '~/types/AddressType';

const props = defineProps({
  address: {
    type: Object as PropType<AddressType>,
    required: true,
  },
  canEdit: {
    type: Boolean,
    default: false,
  },
  canSelect: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['onEdit', 'onSelect', 'onBack']);

const selectAddress = () => {
  emit('onSelect', props.address);
};
const isEdit = ref(false);
</script>

<template>
  <div>
    <div class="address-card">
      <span class="icon">
        <IconLocation :size="2" />
      </span>
      <div class="flex-1">
        <div class="font-medium text-black">
          {{ address.Company ? address.Company + ', ' : '' }}
          {{ address.Firstname }} {{ address.Lastname }}
        </div>
        <div>
          <div>
            {{ address.Address1 }} {{ address.Postcode }}
            {{ address.StateName }} {{ address.City }}, {{ address.Country }}
            <span v-if="address.StateCode">, {{ address.StateCode }}</span>
          </div>
        </div>
        <div>
          <span v-if="address.MobilePhone">{{ address.MobilePhone }}</span>
          <span v-if="address.Phone">{{ address.Phone }}</span>
        </div>
      </div>
      <div
        class="w-full md:w-auto flex justify-end"
        v-if="canEdit || canSelect"
      >
        <BaseButton
          type="default"
          size="small"
          v-if="canEdit"
          @click="isEdit = !isEdit"
        >
          <span v-if="!isEdit">{{ $t('button.modify') }}</span>
          <span v-else>{{ $t('button.cancel') }}</span>
        </BaseButton>
        <BaseButton
          size="small"
          v-if="canSelect"
          type="primary"
          plain
          @click="selectAddress"
        >
          {{ $t('button.select') }}
        </BaseButton>
      </div>
    </div>

    <CheckoutAddressForm
      v-if="isEdit"
      :address="address"
      class="mt-[-1px]"
      :title="address.Alias"
      @onBack="isEdit = false"
      :has-back-button="true"
    />
  </div>
</template>

<style scoped lang="scss">
.address-card {
  @apply border border-gray-200 bg-white p-3 text-sm text-gray-600;
  @apply flex justify-between items-center gap-2 flex-wrap;
}
</style>
