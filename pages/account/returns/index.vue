<script setup lang="ts">
definePageMeta({
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.my_returns.title'),
  description: () => t('pages.account.my_returns.description'),
}));

const appStore = useAppStore();
const { setLoadingPage } = appStore;
const loading = ref(false);
setLoadingPage(true);

const orderReturnStore = useOrderReturnStore();
const { fetchOrdereReturns } = orderReturnStore;
const { orderReturnList } = toRefs(orderReturnStore);

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

onMounted(() => {
  fetchOrdereReturns().finally(() => {
    loading.value = true;
    setLoadingPage(false);
  });
});
</script>

<template>
  <LayoutAccountOrder>
    <template v-if="loading && !orderReturnList.OrderReturns?.length">
      <div class="max-w-screen-md">
        <BaseAlert :closeButton="false">
          {{ $t('messages.no_returns_recorded') }}
          <NuxtLink
            class="underline"
            :to="localePath({ name: 'account-orders' })"
          >
            {{ $t('button.view_my_orders') }}
          </NuxtLink>
        </BaseAlert>
      </div>
    </template>
    <template v-if="orderReturnList.OrderReturns">
      <div
        v-for="orderReturn in orderReturnList.OrderReturns"
        :key="orderReturn.IdOrderReturn"
        class="md:mt-14 lg:mt-20 -mx-5"
      >
        <div class="grid grid-cols-12 mb-4 px-5">
          <div class="col-span-6">
            <ul class="uppercase">
              <li class="mb-1 flex items-center font-normal">
                <NuxtLink
                  :to="
                    localePath({
                      name: 'account-returns-idOrderReturn',
                      params: {
                        idOrderReturn: orderReturn.IdOrderReturn,
                      },
                    })
                  "
                >
                  {{ orderReturn.IdOrder }}
                </NuxtLink>
              </li>
              <li class="mb-1 flex items-center text-xs">
                <span
                  class="return-state"
                  :class="[state(orderReturn.State?.Code || 0)]"
                ></span>
                {{ orderReturn.State?.Label }}
              </li>
            </ul>
          </div>
          <div class="col-span-6 flex flex-col justify-end"></div>
        </div>
        <div
          v-for="orderReturnDetail in orderReturn.OrderReturnDetail"
          :key="orderReturnDetail.IdOrderReturnDetail"
          class="lg:border-t lg:border-b border-black mb-[-1px]"
        >
          <CardOrderReturn
            v-if="orderReturnDetail?.IdOrder"
            :product="orderReturnDetail.Product"
            :orderId="orderReturnDetail?.IdOrder"
            class="mb-5 lg:my-[-1px]"
            :returnDetail="orderReturnDetail"
          />
        </div>
      </div>
    </template>
  </LayoutAccountOrder>
</template>

<style scoped lang="scss">
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
