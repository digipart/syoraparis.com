<script setup lang="ts">
import OrderReturnService from '~/services/OrderReturnService';
definePageMeta({
  requireAuth: true,
});

const { t } = useI18n();

const orderReturnStore = useOrderReturnStore();
const { orderReturn } = toRefs(orderReturnStore);
const { fetchReturnDetail } = orderReturnStore;

const route = useRoute();
const localePath = useLocalePath();

const state = (code: number) => {
  let s = 'pending';

  switch (code) {
    case 0:
      return 'pending';
    case 1:
      return 'received';
    case 2:
      return 'process';
    case 3:
      return 'processed';
  }

  return s;
};

try {
  if (route.params.idOrderReturn) {
    await fetchReturnDetail(Number(route.params.idOrderReturn as string));

    useHead(() => ({
      title: () =>
        `${t('pages.account.my_returns.title')} - ${
          route.params.idOrderReturn
        }`,
      description: () => t('pages.account.my_returns.description'),
    }));
  }
} catch (error) {}

onMounted(() => {});
</script>

<template>
  <LayoutAccountOrder>
    <div class="accountReturnOrderDetail">
      <div class="grid grid-cols-12 mb-4">
        <div class="col-span-12 lg:col-span-6">
          <ul class="uppercase">
            <li class="mb-1 flex items-center font-normal">
              <NuxtLink
                :to="
                  localePath({
                    name: 'account-returns-idOrderReturn',
                    params: {
                      idOrderReturn: orderReturn?.IdOrder,
                    },
                  })
                "
              >
                {{ orderReturn?.IdOrder }}
              </NuxtLink>
            </li>
            <li class="mb-1 flex items-center text-xs">
              <span
                class="return-state"
                :class="[state(orderReturn?.State?.Code || 0)]"
              ></span>
              {{ orderReturn?.State?.Label }}
            </li>
          </ul>
        </div>
        <div class="col-span-12 lg:col-span-6 flex flex-col justify-end">
          <ul class="flex flex-col lg:flex-row gap-x-5">
            <li v-if="orderReturn?.ReturnLabelURL">
              <a
                :href="orderReturn?.ReturnLabelURL"
                target="_blank"
                download
                class="underline text-xs"
              >
                {{ $t('label.return_voucher') }}
              </a>
            </li>
            <li v-if="orderReturn?.ReturnShippingLabelURL">
              <a
                :href="orderReturn?.ReturnShippingLabelURL"
                target="_blank"
                download
                class="underline text-xs"
              >
                {{ $t('label.transport_label') }}
              </a>
            </li>
            <li v-if="orderReturn?.ReturnNoticeURL">
              <a
                :href="orderReturn?.ReturnNoticeURL"
                target="_blank"
                download
                class="underline text-xs"
              >
                {{ $t('label.return_notice') }}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-for="orderReturnDetail in orderReturn?.OrderReturnDetail"
        :key="orderReturnDetail.IdOrderReturnDetail"
        class="lg:border-t lg:border-b border-black mb-[-1px] -mx-5"
      >
        <!-- {{orderReturnDetail}} -->

        <CardOrderReturn
          v-if="orderReturn?.IdOrder"
          :product="orderReturnDetail.Product"
          :orderId="orderReturn?.IdOrder"
          class="mb-5 lg:my-[-1px]"
          :returnDetail="orderReturnDetail"
        />
      </div>
    </div>
  </LayoutAccountOrder>
</template>

<style lang="scss">
$accountReturnOrderDetail: '.accountReturnOrderDetail';

#{$accountReturnOrderDetail} {

}
.return-state {
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
}
</style>
