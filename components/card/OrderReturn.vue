<script setup lang="ts">
import { ProductHelper } from '~/helpers/ProductHelper';
import OrderReturnService from '~/services/OrderReturnService';
import type {
  OrderReturnDetail,
  OrderReturnReasonType,
} from '~/types/OrderReturnType';
import type { ProductOrderType } from '~/types/OrderType';
import type { Variant } from '~/types/ProductType';

const { product, orderId } = defineProps({
  product: {
    type: {} as PropType<ProductOrderType>,
  },
  orderId: {
    type: String,
    required: true,
  },
  returnDetail: {
    type: {} as PropType<OrderReturnDetail>,
  },
});

const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);
const { setLoadingPage } = appStore;

const localePath = useLocalePath();

const orderReturnStore = useOrderReturnStore();
const { orderReturns } = toRefs(orderReturnStore);

const orderReturnService = new OrderReturnService();

const reasonValueSelected = ref(0);
const reasonTypeValue = ref(-1);
const sizesAvailabilitySelected = ref(0);
const selected = ref(false);

const sizesAvailability = ref<Variant[]>([]);

const emit = defineEmits(['onOrderReturnChange']);

const selectReasonType = (rType: number) => {
  reasonTypeValue.value = rType;
  sizesAvailabilitySelected.value = 0;
  if (rType === 1) {
    // const options: {
    //   IdProduct: number | undefined;
    // } = {
    //   IdProduct: product?.IdProduct,
    // };

    if (product?.IdProduct) {
      setLoadingPage(true);
      orderReturnService
        .fetchAvailability(product?.IdProduct, {
          LanguageIsoCode: languageIsoCode.value,
        })
        .then((data) => {
          sizesAvailability.value = data;
        })
        .finally(() => {
          setLoadingPage(false);
        });
    }
  } else {
    orderChangeHandler();
  }
};

const selectReasonValue = (reason: OrderReturnReasonType) => {
  sizesAvailabilitySelected.value = 0;
  reasonTypeValue.value = -1;
  reasonValueSelected.value = reason.OrderReturnReasonCodeValue;
};

const selectReasonSize = (idProductAttribute: number) => {
  sizesAvailabilitySelected.value = idProductAttribute;
  orderChangeHandler();
};

const productReturned = computed(() => {
  return {
    IdProduct: product?.IdProduct,
    IdProductAttribute: product?.Variant?.Combination?.IdProductAttribute,
    Quantity: product?.Quantity,
    IdOrderDetail: product?.IdOrderDetail,
    OrderReturnDetailType: reasonTypeValue.value,
    OrderReturnReasonCodeValue: reasonValueSelected.value,
    OrderReturnNewIdProductAttribute: sizesAvailabilitySelected.value || '',
  };
});

const orderChangeHandler = () => {
  emit('onOrderReturnChange', productReturned.value);
};
</script>

<template>
  <div class="cardOrderReturn grid grid-cols-10 gap-3">
    <div class="col-span-5 lg:col-span-2">
      <CardOrderProduct :product="product" />
    </div>
    <div
      v-if="!returnDetail"
      class="col-span-10 md:col-span-5 lg:col-span-8 px-0 pt-5 lg:p-5"
    >
      <div class="mb-3">
        <InputCheckBox
          :id="`returnDetail-${product?.IdOrderDetail}`"
          v-model="selected"
        >
          {{ $t('button.return_product') }}
        </InputCheckBox>
      </div>
      <div v-if="selected" class="grid grid-cols-12 gap-5">
        <div class="col-span-12 md:col-span-6 lg:col-span-4">
          <ul v-if="selected" class="flex flex-col gap-y-3">
            <li
              v-for="reason in orderReturns?.Reasons"
              :key="reason.IdOrderReturnReasonCode"
            >
              <BaseButton
                type="primary"
                :plain="
                  reasonValueSelected !== reason.OrderReturnReasonCodeValue
                "
                class="w-full"
                @click="selectReasonValue(reason)"
                size="small"
              >
                {{ reason.OrderReturnReasonCodeDefinition }}
              </BaseButton>
            </li>
          </ul>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-4">
          <div v-if="reasonValueSelected" class="flex flex-col gap-3">
            <BaseButton
              type="primary"
              class="w-full"
              @click="selectReasonType(0)"
              size="small"
              :plain="reasonTypeValue === 0 ? false : true"
            >
              <span class="text-xs font-medium"> {{ $t('Refund') }} </span>
            </BaseButton>
            <BaseButton
              type="primary"
              class="w-full"
              size="small"
              @click="selectReasonType(1)"
              :plain="reasonTypeValue === 1 ? false : true"
            >
              <span class="text-xs font-medium"> {{ $t('Exchange') }} </span>
            </BaseButton>
            <ul
              v-if="reasonTypeValue === 1"
              class="flex flex-col gap-y-3 border-r border-l border-b border-black p-3 -mt-3"
            >
              <li
                v-for="sA in sizesAvailability"
                :key="sA.Combination?.IdProductAttribute"
              >
                <BaseButton
                  v-if="sA.Combination?.IdProductAttribute"
                  :plain="
                    sizesAvailabilitySelected !==
                    sA.Combination?.IdProductAttribute
                  "
                  type="primary"
                  class="w-full"
                  size="small"
                  @click="selectReasonSize(sA.Combination?.IdProductAttribute)"
                >
                  {{ ProductHelper.getSize(sA) }}
                </BaseButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="col-span-5 lg:col-span-8 px-0 pt-0 Lg:pt-5 lg:p-5">
      <!-- <BaseHeadLine size="lg" class="font-normal mb-3">
        <NuxtLink
          :to="
            localePath({
              name: 'account-order-idOrder',
              params: {
                idOrder: returnDetail.IdOrder,
              },
            })
          "
        >
          {{ returnDetail.IdOrder }}
        </NuxtLink>
      </BaseHeadLine> -->
      <ul>
        <!-- <li class="mb-1 flex items-center">
          <span
            class="cardOrderReturn-state"
            :class="[returnDetail.State?.Value]"
          ></span>
          <span class="text-xs uppercase">
            {{ returnDetail.State?.Label }}
          </span>
        </li> -->
        <li v-if="returnDetail.IdOrder" class="mb-1">
          <NuxtLink
            :to="
              localePath({
                name: 'account-order-idOrder',
                params: {
                  idOrder: returnDetail.IdOrder,
                },
              })
            "
          >
            <span class="underline text-sm font-light">
              {{ $t('button.vieworder') }}</span
            >
          </NuxtLink>
        </li>
        <li class="mb-1" v-if="returnDetail?.HistoryDate">
          <span class="text-xs"
            >{{ $t('label.returns_on') }} :
            {{ returnDetail?.HistoryDate?.Return }}</span
          >
        </li>
      </ul>
      <ul v-if="returnDetail.Type">
        <li class="text-sm font-normal capitalize">
          {{ returnDetail.Type.Label }}
        </li>

        <li class="text-sm font-normal uppercase">
          {{ returnDetail.Product.Variant?.Original?.Attribute.Size }},
          {{ returnDetail.Product.Variant?.New?.Attribute.Size }}
        </li>
        <li class="text-sm font-normal uppercase">
          {{ returnDetail.Product.Variant?.Original?.Attribute.Color }},
          {{ returnDetail.Product.Variant?.New?.Attribute.Color }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
$cardOrderReturn: '.cardOrderReturn';

#{$cardOrderReturn} {
  &-state {
    @apply h-2 w-2 mr-1;

    &.pending {
      @apply bg-slate-400;
    }
    &.received {
      @apply bg-orange-400;
    }
    &.process {
      @apply bg-blue-500;
    }
    &.processed {
      @apply bg-green-400;
    }
    &.canceled {
      @apply bg-red-500;
    }
  }
}
</style>
