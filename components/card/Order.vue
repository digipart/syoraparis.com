<script setup lang="ts">
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { OrderType } from '~/types/OrderType';
const appStore = useAppStore();
const { currencySign } = toRefs(appStore);

const { order, details } = defineProps<{
  order: OrderType;
  details?: boolean;
}>();

const localePath = useLocalePath();

const breakpoints: any = {
  '0': {
    slidesPerView: 2.1,
  },
  '768': {
    slidesPerView: 3.1,
  },
  '992': {
    slidesPerView: 4.1,
  },
  '1280': {
    slidesPerView: 5.1,
  },
};

const state = computed(() => {
  let s = 'created';

  //   "created": 0, "preparation": 1, "shipped": 2, "delivered": 3, "canceled": 4
  switch (order.State?.Code) {
    case 0:
      return 'created';
    case 1:
      return 'preparation';
    case 2:
      return 'shipped';
    case 3:
      return 'delivered';
    case 4:
      return 'canceled';
  }

  return s;
});
</script>
<template>
  <div class="cardOrder">
    <div class="grid grid-cols-12 mb-4 gap-y-2 lg:gap-y-0">
      <div class="col-span-12 lg:col-span-6">
        <ul class="uppercase text-xs font-light">
          <li class="mb-1 flex items-center">
            <span class="cardOrder-state" :class="[state]"></span>
            {{ order.State?.Label }}
          </li>
          <li>
            {{ order.DateAdd }}
          </li>
          <li v-if="!details" class="flex gap-x-3 mt-3">
            <span class="font-normal">
              {{ order.Total?.Paid?.TaxIncl?.toFixed(2) }}
              {{ currencySign }}
            </span>
            <NuxtLink
              v-if="!details"
              :to="
                localePath({
                  name: 'account-order-idOrder',
                  params: {
                    idOrder: order.IdOrder,
                  },
                })
              "
              class="normal-case underline"
            >
              {{ $t('button.vieworder') }}
            </NuxtLink>
            <NuxtLink
              v-if="order.OrderReturn?.Available"
              :to="
                localePath({
                  name: 'account-order-return-idOrder',
                  params: {
                    idOrder: order.IdOrder,
                  },
                })
              "
            >
              <span class="normal-case underline">
                {{ $t('button.return_product') }}
              </span>
            </NuxtLink>
            <!-- <span v-else class="normal-case text-gray-888">
              {{ $t('button.return_closed') }}
            </span> -->
          </li>
          <template v-if="details">
            <li v-if="order?.Delivery?.Date" class="mt-3">
              - {{ $t('label.delivered_on') }} :
              <b class="font-medium">{{ order?.Delivery?.Date }}</b>
            </li>
            <li v-if="order?.Shipping?.Date" class="mt-1">
              - {{ $t('label.shipped_on') }} :
              <b class="font-medium">{{ order?.Shipping?.Date }}</b>
            </li>
          </template>
        </ul>
      </div>
      <div
        v-if="details"
        class="col-span-12 lg:col-span-6 flex flex-col justify-end"
      >
        <ul class="flex gap-x-5">
          <li v-if="order.OrderReturn?.Available">
            <NuxtLink
              :to="
                localePath({
                  name: 'account-order-return-idOrder',
                  params: {
                    idOrder: order.IdOrder,
                  },
                })
              "
            >
              <span class="normal-case underline text-xs">
                {{ $t('button.return_product') }}
              </span>
            </NuxtLink>
            <!-- <span v-else class="normal-case text-xs text-gray-888">
              {{ $t('button.return_closed') }}
            </span> -->
          </li>
          <li v-if="order.Invoice?.URL">
            <a
              :href="order.Invoice?.URL"
              target="_blank"
              download
              class="underline text-xs"
            >
              {{ $t('button.download_invoice') }}
            </a>
          </li>
          <li>
            <LayoutOrderTracking :order="order" />
          </li>
        </ul>
      </div>
    </div>

    <div class="-mx-5 border-t border-b border-black">
      <swiper :breakpoints="breakpoints" :space-between="-1" class="my-[-1px]">
        <swiper-slide v-for="(product, index) in order.Products" :key="index">
          <div class="w-full">
            <CardOrderProduct :product="product" :showDetail="details" />
          </div>
        </swiper-slide>
      </swiper>
    </div>

    <div v-if="details" class="mt-10">
      <div class="grid grid-cols-12 gap-y-5 md:gap-y-8 lg:gap-y-0 gap-x-5">
        <div class="col-span-12 md:col-span-6 lg:col-span-4 order-2 lg:order-1">
          <BaseHeadLine class="uppercase font-medium mb-2">
            {{ $t('titles.shipping_address') }}
          </BaseHeadLine>
          <ul class="font-light">
            <li class="font-normal">
              {{ order.Shipping?.Address?.Firstname }}
              {{ order.Shipping?.Address?.Lastname }}
            </li>
            <li>
              {{ order.Shipping?.Address?.Address1 }}
            </li>
            <li>
              {{ order.Shipping?.Address?.Postcode }},
              {{ order.Shipping?.Address?.City }}
            </li>
            <li>
              {{ order.Shipping?.Address?.Country }}
            </li>
            <li>
              {{ order.Shipping?.Address?.MobilePhone }}
            </li>
          </ul>
        </div>
        <div class="col-span-12 md:col-span-6 lg:col-span-4 order-3 lg:order-2">
          <BaseHeadLine class="uppercase font-medium mb-2">
            {{ $t('titles.invoice_address') }}
          </BaseHeadLine>
          <ul class="font-light">
            <li class="font-normal">
              {{ order.Invoice?.Address?.Firstname }}
              {{ order.Invoice?.Address?.Lastname }}
            </li>
            <li>
              {{ order.Invoice?.Address?.Address1 }}
            </li>
            <li>
              {{ order.Invoice?.Address?.Postcode }},
              {{ order.Invoice?.Address?.City }}
            </li>
            <li>
              {{ order.Invoice?.Address?.Country }}
            </li>
            <li>
              {{ order.Invoice?.Address?.MobilePhone }}
            </li>
          </ul>
        </div>
        <div
          class="col-span-12 md:col-span-12 lg:col-span-4 order-1 lg:order-3"
        >
          <div class="md:max-w-80">
            <BaseHeadLine class="uppercase font-medium mb-2">
              {{ $t('titles.summary') }}
            </BaseHeadLine>
            <ul class="font-light">
              <li class="flex justify-between gap-x-3 mb-1">
                <span
                  >{{ order?.TotalProducts }} {{ $t('label.article') }}</span
                >
                <span class="font-normal">
                  {{ order?.Total?.Product?.TaxIncl?.toFixed(2) }}
                  {{ currencySign }}
                </span>
              </li>
              <li class="flex justify-between gap-x-3 mb-1">
                <span>
                  {{ $t('label.shipping') }}
                </span>
                <span class="font-normal">
                  {{ order?.Total?.Shipping?.TaxIncl?.toFixed(2) }}
                  {{ currencySign }}
                </span>
              </li>
              <li class="flex justify-between gap-x-3">
                <span>
                  {{ $t('label.total') }}
                </span>
                <span class="font-normal">
                  {{ order?.Total?.Paid?.TaxIncl?.toFixed(2) }}
                  {{ currencySign }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
$cardOrder: '.cardOrder';

#{$cardOrder} {
  &-state {
    @apply h-2 w-2 mr-1;

    &.created {
      @apply bg-slate-400;
    }

    &.preparation {
      @apply bg-orange-400;
    }

    &.shipped {
      @apply bg-blue-500;
    }

    &.delivered {
      @apply bg-green-400;
    }

    &.canceled {
      @apply bg-red-500;
    }
  }
}
</style>
