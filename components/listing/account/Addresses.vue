<template>
  <div class="accountAddresses">
    <div class="accountAddresses-list">
      <template v-if="addresses.length">
        <CardAddress
          v-for="address in addresses"
          :key="address.IdAddress"
          :address="address"
          :activeType="activeType"
          @onSelect="$emit('onAddressSelected', address)"
          class="cursor-pointer"
        />
      </template>
      <!-- <BaseAlert v-else class="" :closeButton="false">
        <template #icon>
          <IconInfo :size="1.7" />
        </template>
        {{ $t('messages.no_address_found') }}
      </BaseAlert> -->
    </div>
  </div>
</template>

<script setup lang="ts">
const addressStore = useAddressStore();
const { addresses } = toRefs(addressStore);

const { activeType } = defineProps({
  activeType: {
    type: String as PropType<'Delivery' | 'Invoice'>,
  },
});
</script>

<style scoped lang="scss">
$accountAddresses: '.accountAddresses';

#{$accountAddresses} {
  &-list {
    @apply flex flex-col gap-y-4;
  }
}
</style>
