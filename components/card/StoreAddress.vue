<template>
  <div
    class="cardShopAddress"
    :class="{ checked: checked }"
    @click="selectedShop()"
  >
    <span v-if="!one" class="cardShopAddress-radio">
      <span
        class="rounded h-2 w-2 bg-black duration-200"
        :class="[checked ? 'opacity-100' : 'opacity-0']"
      >
      </span>
    </span>
    <div class="mb-3" :class="{ 'pl-8': !one }">
      <BaseHeadLine size="md" class="cardShopAddress-name">
        {{ store.StoreName }}
      </BaseHeadLine>
      <span class="text-sm">{{ store.StoreAddress1 }}</span
      ><br />
      <span class="text-sm">
        {{ store.StorePostalCode }}, {{ store.StoreCity }}
      </span>
    </div>
    <span
      v-if="store.StockStatus === 'Limited Stock'"
      class="absolute top-4 right-3 text-xs pr-3"
    >
      {{ $t('reservation_store.last_product_inStock') }}
      <span
        class="rounded h-2 w-2 bg-green-400 inline-block absolute right-0 top-1"
      >
      </span>
    </span>
    <div class="flex justify-between text-sm mb-5" :class="{ 'pl-8': !one }">
      <a :href="`tel:${store.StorePhone}`">{{ store.StorePhone }}</a>
      <div v-if="!one" class="flex items-center gap-2">
        <span class="cursor-pointer flex items-center">
          <a
            v-if="store.StoreGoogleMapsUrl"
            :href="store.StoreGoogleMapsUrl"
            target="_blank"
            class="flex items-center mr-2"
          >
            <IconLocation /> {{ $t('reservation_store.view_on_map') }}
          </a>
        </span>
        <span
          class="cursor-pointer flex items-center"
          @click="openHoraire = !openHoraire"
        >
          <IconTime /> {{ $t('reservation_store.hours_and_info') }}
        </span>
      </div>
    </div>

    <Transition name="slide">
      <div
        class="flex flex-col border-t border-r border-l border-black mb-3"
        v-show="openHoraire"
      >
        <template v-if="store.StoreOpeningHours">
          <div
            v-for="(hour, groupName, index) in store.StoreOpeningHours"
            class="flex text-sm border-black border-b"
          >
            <span class="min-w-32 font-light border-r border-black py-2 px-5">
              {{ groupName }} :
            </span>
            <span class="font-normal py-2 px-5">
              {{ hour }}
            </span>
          </div>
        </template>
        <template v-else>
          <div
            v-for="schedule in store.Schedules"
            class="flex text-sm border-black border-b"
          >
            <span class="min-w-32 font-light border-r border-black py-2 px-5">
              {{ schedule.Day }} :
            </span>
            <span class="font-normal py-2 px-5 flex gap-x-3">
              <span
                v-for="(timeslot, index) in schedule.TimeSlots"
                :key="index"
              >
                {{ timeslot.TimeSlotStart }} -
                {{ timeslot.TimeSlotEnd }}
              </span>
            </span>
          </div>
        </template>
      </div>
    </Transition>
    <div v-if="!one">
      <BaseButton
        type="primary"
        size="small"
        class="w-full"
        :title="$t('reservation_store.choose_this_shop')"
        @click="emit('onStoreSelected', store)"
      >
        {{ $t('reservation_store.choose_this_shop') }}
      </BaseButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { StockInStoreType } from '~/types/StoreReservationProductType';

const { checked, store, one } = defineProps({
  checked: {
    type: Boolean,
    default: false,
  },
  one: {
    type: Boolean,
    default: false,
  },
  store: {
    type: {} as PropType<StockInStoreType>,
    default: false,
  },
});

const emit = defineEmits(['onStoreSelected']);

const openHoraire = ref(false);

const selectedShop = () => {
};
</script>

<style lang="scss">
$cardShopAddress: '.cardShopAddress';

#{$cardShopAddress} {
  @apply relative border p-3 duration-150;
  &.checked {
    @apply border-black;
  }
  &-radio {
    @apply absolute top-4 left-3 text-xs h-3 w-3 border-black border rounded-2xl flex justify-center items-center;
  }
  &-name {
    @apply font-normal uppercase mb-2;
  }
}
</style>
