<script setup lang="ts">
import OrderReturnService from '~/services/OrderReturnService';
definePageMeta({
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.my_returns.title'),
  description: () => t('pages.account.my_returns.description'),
}));

const orderStore = useOrderStore();
const { order } = toRefs(orderStore);
const { fetchOrderById } = orderStore;

const orderReturnStore = useOrderReturnStore();
const { fetchReasons } = orderReturnStore;

const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);
const { setLoadingPage } = appStore;

const route = useRoute();
const router = useRouter();
const localePath = useLocalePath();

type ReturnOrderProduct = {
  IdProduct: number | undefined;
  IdProductAttribute: number | undefined;
  Quantity: number | undefined;
  IdOrderDetail: number | undefined;
  OrderReturnDetailType: number;
  OrderReturnReasonCodeValue: number;
  OrderReturnNewIdProductAttribute: string | number;
};

const returnOrderProducts = ref<ReturnOrderProduct[]>([]);

const addReturnProduct = (orderReturn: ReturnOrderProduct) => {
  const index = returnOrderProducts.value.findIndex(
    (product) => product.IdOrderDetail === orderReturn.IdOrderDetail
  );

  if (index !== -1) {
    returnOrderProducts.value.splice(index, 1);
  }

  returnOrderProducts.value.push(orderReturn);
};

const createResponse = ref<{ IdOrderReturn: number } | null>(null);

const orderReturnService = new OrderReturnService();
const createReturn = () => {
  setLoadingPage(true);
  orderReturnService
    .createReturn({
      IdOrder: order.value?.IdOrder || '',
      Products: JSON.stringify({ Products: returnOrderProducts.value }),
      LanguageIsoCode: languageIsoCode.value,
    })
    .then((data) => {
      // router.replace(
      //   localePath({
      //     name: 'account-returns',
      //   })
      // );
      createResponse.value = { IdOrderReturn: data.IdOrderReturn };
      // createResponse.value = { IdOrderReturn: 1111 };
    })
    .finally(() => {
      setLoadingPage(false);
    });
};

onMounted(() => {
  if (!order.value) {
    fetchOrderById(route.params.idOrder as string).then((data) => {});
  }
  fetchReasons();
});
</script>

<template>
  <LayoutAccountOrder class="accountReturnOrder">
    <div v-if="!createResponse">
      <div
        v-for="(product, index) in order?.Products"
        :key="product.IdOrderDetail"
        class="lg:border-t lg:border-b border-black mb-[-1px]"
      >
        <CardOrderReturn
          v-if="order?.IdOrder"
          :product="product"
          :orderId="order?.IdOrder"
          class="mb-5 lg:my-[-1px]"
          @onOrderReturnChange="addReturnProduct($event)"
        />
      </div>
      <div class="accountReturnOrder-save">
        <div class="grid grid-cols-12">
          <div class="col-span-12 lg:col-span-9"></div>
          <div class="col-span-12 lg:col-span-3">
            <BaseButton
              type="primary"
              size="large"
              class="w-full"
              @click="createReturn()"
            >
              {{ $t('button.save') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="returnConfirmedView">
      <div class="returnConfirmedView-container">
        <div class="returnConfirmedView-wrapper">
          <div class="returnConfirmedView-img">
            <BaseLogo is-svg />
          </div>

          <div
            class="returnConfirmedView-body text-xs lg:text-xl font-light"
            v-html="$t('order.return.confirmation')"
          ></div>

          <div
            class="returnConfirmedView-footer mt-5 flex justify-center flex-col md:flex-row gap-3"
          >
            <NuxtLink
              :to="
                localePath({
                  name: 'account-returns',
                })
              "
              class="w-full md:w-auto"
            >
              <BaseButton
                type="primary"
                plain
                class="w-full text-xs lg:text-base"
                :title="$t('button.see_my_returns')"
              >
                {{ $t('button.see_my_returns') }}
              </BaseButton>
            </NuxtLink>
            <NuxtLink
              :to="
                localePath({
                  name: 'account-returns-idOrderReturn',
                  params: { idOrderReturn: createResponse?.IdOrderReturn},
                })
              "
              class="w-full md:w-auto"
            >
              <BaseButton
                type="primary"
                plain
                class="w-full text-xs lg:text-base"
                :title="$t('button.details_my_return')"
              >
                {{ $t('button.details_my_return') }}
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </LayoutAccountOrder>
</template>

<style lang="scss">
$accountReturnOrder: '.accountReturnOrder';

#{$accountReturnOrder} {
  &-save {
    @apply fixed bottom-0 left-0 w-full p-5 z-10 
    border-black border-t
    bg-white;
  }
}
</style>

<style lang="scss">
.returnConfirmedView {
  @apply text-center;

  h1 {
    @apply text-2xl text-start;
  }
  h2 {
    @apply text-2xl lg:text-3xl mb-8 lg:mb-12;
  }

  &-body {
    a {
      @apply underline;
    }
    p {
      @apply mb-4;
    }
  }

  &-wrapper {
    @apply bg-white  py-4 lg:py-16 px-0 lg:px-8;
  }
  &-container {
    @apply max-w-[1024px] mx-auto;
  }
  &-img {
    @apply flex items-center justify-center mb-8;
    img {
      @apply w-auto h-12;
      @screen mdMax {
        @apply h-8;
      }
    }
  }
  &-footer {
    @apply mt-10;
  }
}
</style>
