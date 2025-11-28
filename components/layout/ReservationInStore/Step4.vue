<script setup lang="ts">
import type { ProductType, Variant } from '~/types/ProductType';
import type { StockInStoreType } from '~/types/StoreReservationProductType';
const { product, variantSelected, storeSelected } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  variantSelected: {
    type: {} as PropType<Variant>,
    required: true,
  },
  storeSelected: {
    type: {} as PropType<StockInStoreType>,
    required: true,
  },
  customer: {
    type: {} as PropType<{
      firstname?: string;
      lastname?: string;
      email?: string;
      phone?: string;
    }>,
    required: true,
  },
});

const emit = defineEmits(['onClose']);
const close = () => {
  emit('onClose');
};
</script>

<template>
  <div class="reservationInStoreInfo-body pr-1">
    <div class="grid grid-cols-12 gap-5 gap-y-10">
      <div class="col-span-12 md:col-span-5 order-2 md:order-1">
        <div class="mb-3 border-b pb-1 flex justify-between items-center">
          <BaseHeadLine size="sm" class="uppercase font-normal">
            {{ $t('label.product') }}
          </BaseHeadLine>
        </div>
        <CardStoreAddressProduct
          :product="product"
          :variantSelected="variantSelected"
          class="mb-5"
        />
        <div class="mb-3 border-b pb-1 flex justify-between items-center">
          <BaseHeadLine size="sm" class="uppercase font-normal">
            {{ $t('label.Store') }}
          </BaseHeadLine>
        </div>
        <CardStoreAddress
          v-if="storeSelected"
          :checked="true"
          :store="storeSelected"
          :one="true"
        />
      </div>
      <div
        class="col-span-12 md:col-span-7 order-1 md:order-2 md:border-l md:pl-5"
      >
        <div class="text-base flex justify-center mt-10 mb-10">
          <div
            class="flex justify-center items-center border rounded-full border-black p-5"
          >
            <IconCheck :size="3" />
          </div>
        </div>
        <div
          v-html="
            $t('reservation_store.msg_confirmation', {
              name: customer.firstname,
            })
          "
        ></div>

        <div class="flex justify-end mt-10">
          <BaseButton
            type="primary"
            size="small"
            :title="$t('button.close')"
            @click="close()"
          >
            {{ $t('button.close') }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
