<script setup lang="ts">
import type { ProductType, Variant } from '~/types/ProductType';
import type { StockInStoreType } from '~/types/StoreReservationProductType';

const shopStore = useShopStore();
const { storeReservationStores } = toRefs(shopStore);
const { fetchStoreReservationStores } = shopStore;

const { product, variantSelected } = defineProps({
  product: {
    type: {} as PropType<ProductType>,
    required: true,
  },
  variantSelected: {
    type: {} as PropType<Variant>,
    required: true,
  },
});

const emit = defineEmits(['onContinue', 'stepIndexChange']);

const storeSelected = ref<StockInStoreType | null>(null);

const selectStore = (store: StockInStoreType) => {
  storeSelected.value = store;
};

const storeSelectedHendler = (store: StockInStoreType) => {
  emit('onContinue', store);
};

const changeStepIndex = (index: number) => {
  emit('stepIndexChange', index);
};

onMounted(() => {
  if (product.IdProduct && variantSelected.Combination?.IdProductAttribute) {
    fetchStoreReservationStores({
      IdProduct: product.IdProduct,
      IdProductAttribute: variantSelected.Combination?.IdProductAttribute,
    });
  }
});
</script>

<template>
  <div class="reservationInStoreInfo-body pr-1">
    <div class="grid grid-cols-12 gap-5 gap-y-10">
      <div class="col-span-12 md:col-span-5 order-2 md:order-1">
        <div class="mb-3 border-b pb-1 flex justify-between items-center">
          <BaseHeadLine size="sm" class="uppercase font-normal">
            {{ $t('label.product') }}
          </BaseHeadLine>
          <span class="text-xs cursor-pointer" @click="changeStepIndex(1)">
            {{ $t('button.modify') }}
          </span>
        </div>
        <CardStoreAddressProduct
          :product="product"
          :variantSelected="variantSelected"
        />
      </div>
      <div
        class="col-span-12 md:col-span-7 order-1 md:order-2 md:border-l md:pl-5"
      >
        <BaseHeadLine
          size="sm"
          class="uppercase font-normal mb-3 border-b pb-1"
        >
          {{ $t('label.stores') }}
        </BaseHeadLine>
        <div class="flex flex-col gap-3">
          <CardStoreAddress
            v-for="store in storeReservationStores?.StockInStore"
            :key="store.IdStore"
            :checked="storeSelected?.IdStore === store.IdStore"
            :store="store"
            @click="selectStore(store)"
            @onStoreSelected="storeSelectedHendler($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
