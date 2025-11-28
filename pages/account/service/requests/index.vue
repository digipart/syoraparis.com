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


const localePath = useLocalePath();
const appStore = useAppStore();
const { setLoadingPage } = appStore;
setLoadingPage(true);

const ticketStore = useTicketStore();
const { fetchTickets } = ticketStore;
const { ticketsList } = toRefs(ticketStore);

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

setLoadingPage(true);
fetchTickets().finally(() => {
  setLoadingPage(false);
});
</script>

<template>
  <LayoutAccountServiceClient>
    <div class="max-w-screen-lg">
      <template v-for="(ticket, index) in ticketsList">
        <div class="cardTicket">
          <div class="cardTicket-img">
            <NuxtImg
              v-if="ticket?.Product"
              :src="image(ticket?.Product)?.Src"
            />
          </div>
          <div class="cardTicket-body">
            <div>
              <BaseHeadLine size="md" class="uppercase font-normal">
                {{ title(ticket?.Product) }}
                <small class="block text-xs font-light">{{
                  ticket.Product?.Reference
                }}</small>
              </BaseHeadLine>

              <div class="cardTicket-msg">
                {{ ticket.LastMessage?.Message }}
              </div>

              <div class="text-xs mt-2 text-black/80">
                <span
                  class="cardTicket-state"
                  :class="[
                    ticket.Status === 'Opened' ? 'bg-green-300' : 'bg-red-400',
                  ]"
                ></span>
                <span>{{ ticket.LastMessage?.MemberFirstname }}, </span>
                <span>{{ ticket.LastMessage?.SentDate }}</span>
              </div>
            </div>
            <div class="mt-10">
              <NuxtLink
                :to="
                  localePath({
                    name: 'account-service-requests-idTicket',
                    params: {
                      idTicket: ticket.IdTicket,
                    },
                  })
                "
              >
                <BaseButton
                  type="primary"
                  size="small"
                  :title="$t('button.open_conversation')"
                >
                  {{ $t('button.open_conversation') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
        <BaseHr v-if="index < ticketsList.length - 1" />
      </template>
    </div>
  </LayoutAccountServiceClient>
</template>

<style lang="scss">
$cardTicket: '.cardTicket';

#{$cardTicket} {
  @apply flex gap-5;
  @screen mdMax {
    @apply flex-col;
  }
  &-img {
    @apply w-full max-w-56;
  }
  &-body {
    @apply flex-1;
  }
  &-msg {
    @apply bg-gray-bbb/20 text-sm p-3 mt-5;
  }
  &-state {
    @apply h-2 w-2 inline-block rounded-md mr-2;
  }
}
</style>
