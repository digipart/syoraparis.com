<template>
  <div class="cardTicketProduct">
    <div class="cardTicketProduct-wrapper" @click="openMessageForm">
      <div class="cardTicketProduct-top">
        <NuxtImg v-if="image" :src="image.Src" class="w-full" />
      </div>
    </div>

    <BaseDrawer
      v-model="messageFormIsVisible"
      size="100%"
      maxSize="600px"
      position="left"
      class="sideMenu-drawer"
    >
      <template #header>
        <div class="flex uppercase font-normal">
          <span>
            {{ $t('account.service.drawer.title') }}
          </span>
        </div>
      </template>
      <div class="h-full flex flex-col">
        <div class="flex-1 overflow-auto flex flex-col gap-y-5 mb-5">
          <div class="flex gap-3">
            <div class="max-w-32">
              <NuxtImg v-if="image" :src="image.Src" class="w-full" />
            </div>
            <div>
              <BaseHeadLine class="font-normal" size="sm">
                {{ title }}
              </BaseHeadLine>
              <small>
                {{ product?.Reference }}
              </small>
              <div class="flex flex-col mt-3">
                <span class="text-xs text-gray-777">
                  {{ $t('label.date') }} :
                </span>
                <span class="text-sm">
                  {{ product?.DateAdd }}
                </span>
              </div>
            </div>
          </div>
          <!-- <div class="bg-gray-bbb/10 p-3 text-sm">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo odio
            soluta distinctio labore cum ducimus saepe sint asperiores?
            Voluptatibus hic esse eius alias provident sapiente, accusamus
            deleniti temporibus totam. Fugit ratione numquam nostrum corrupti?
            Saepe voluptatem, provident quia minima id dignissimos
            necessitatibus minus porro eius numquam, accusamus, obcaecati eos
            quis.
          </div> -->
        </div>

        <div class="">
          <FormTicketProductMessage @onSubmit="close" :product="product" />
        </div>
      </div>
    </BaseDrawer>
  </div>
</template>

<script setup lang="ts">
import type { TicketProduct } from '~/types/TicketType';

const { product } = defineProps({
  product: {
    type: {} as PropType<TicketProduct>,
  },
});

const ticketStore = useTicketStore();
const { fetchTickets } = ticketStore;
const { ticketsList } = toRefs(ticketStore);

const { locale } = useI18n();
const messageFormIsVisible = ref(false);

const image = computed(() => {
  if (product?.Media?.Images?.product_large?.length) {
    return product?.Media?.Images?.product_large[0];
  }
  return null;
});
const title = computed(() => {
  const t = product?.Description.Title;

  if (t) {
    return t;
  }

  return null;
});

const router = useRouter();
const localePath = useLocalePath();

const openMessageForm = () => {
  if (ticketsList.value.length) {
  } else {
    fetchTickets()
      .then((data) => {})
      .finally(() => {});
  }
  messageFormIsVisible.value = true;
};

const close = () => {
  messageFormIsVisible.value = false;
  router.push(localePath({ name: 'account-service-requests' }));
};
</script>

<style lang="scss">
$cardTicketProduct: '.cardTicketProduct';

#{$cardTicketProduct} {
  @apply relative cursor-pointer;
  &:after {
    content: '';
    box-shadow: 1px 0 black, 0 1px black, 1px 1px black, 1px 0 black inset,
      0 1px black inset;
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
  }
}
</style>
