<script setup lang="ts">
import type { TicketProduct } from '~/types/TicketType';

definePageMeta({
  
  requireAuth: true,
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.account.customer_services_myrequest.title'),
  description: () => t('pages.account.customer_services_myrequest.description'),
}));

const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);

const ticketStore = useTicketStore();
const { fetchTicket } = ticketStore;
const { ticket } = toRefs(ticketStore);

const image = (product: TicketProduct) => {
  if (product?.Media?.Images?.product_large?.length) {
    return product?.Media?.Images?.product_large[0];
  }
  return null;
};
const title = (product?: TicketProduct) => {
  const t = product?.Description.Title;

  if (t) {
    return t;
  }

  return null;
};

const route = useRoute();
const idTicket = Number(route.params.idTicket as string);

const loadData = () => {
  setLoadingPage(true);
  fetchTicket({ IdTicket: idTicket }).finally(() => {
    setLoadingPage(false);
  });
};
loadData();
</script>

<template>
  <LayoutAccountServiceClient>
    <div class="max-w-screen-lg" v-if="ticket && idTicket">
      <div class="cardTicket">
        <div class="cardTicket-img">
          <NuxtImg v-if="ticket?.Product" :src="image(ticket?.Product)?.Src" />
        </div>
        <div class="cardTicket-body">
          <div>
            <BaseHeadLine size="md" class="uppercase font-normal">
              {{ title(ticket?.Product) }}
              <small class="block text-xs font-light">{{
                ticket.Product?.Reference
              }}</small>
            </BaseHeadLine>
          </div>
        </div>
      </div>
      <div class="border border-black mt-5 p-5">
        <div
          v-for="message in ticket?.Messages"
          class="cardTicket-message"
          :class="{ sender: message.SentByCustomer }"
        >
          <div
            class="cardTicket-message-box"
            :class="{ sender: message.SentByCustomer }"
          >
            {{ message.Message }}
          </div>
          <div class="text-xxs mt-2 text-black/80">
            <span
              >{{
                message.SentByCustomer
                  ? ticket?.CustomerFirstname
                  : ticket?.MemberFirstname
              }},
            </span>
            <span>{{ message.SentDate }}</span>
          </div>
        </div>
        <div v-if="ticket.Status === 'Opened'" class="mt-10">
          <FormTicketMessage :idTicket="idTicket" @onSubmit="loadData" />
        </div>
      </div>
    </div>
  </LayoutAccountServiceClient>
</template>

<style lang="scss" scoped>
$cardTicket: '.cardTicket';

#{$cardTicket} {
  @apply flex gap-5;
  @screen mdMax {
    @apply flex-col;
  }
  &-img {
    @apply max-w-56;
  }
  // &-body {
  //   @apply flex flex-col justify-between;
  // }
  &-message {
    @apply flex flex-col items-start;
    &.sender {
      @apply items-end;
    }
    &-box {
      @apply bg-gray-bbb/20 text-sm p-3 mt-5 w-auto;
      max-width: calc(100% - 60px);
      &.sender {
        @apply bg-yellow-100/40;
      }
    }
  }
}
</style>
