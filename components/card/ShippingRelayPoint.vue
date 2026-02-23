<script setup lang="ts">
import type { CarrierGenre } from '~/types/ShippingType';

const { carrierSelected } = defineProps({
  carrierSelected: {
    type: Object as PropType<CarrierGenre>,
  },
});

const shippingStore = useShippingStore();
const { fetchRelayPoints } = shippingStore;
const { relayPointSelected, relayPoints, relayPointsSerched, carrier } =
  toRefs(shippingStore);

const loading = ref(false);

const emit = defineEmits(['onSelectPointRelay']);

const sideRelayPointsVisible = ref(false);

const term = ref('');
const relayPointSelectedID = ref('');

watch(
  relayPointSelected,
  (newVal) => {
    relayPointSelectedID.value = newVal?.Id || '';
  },
  { immediate: true }
);

const rpSchedulesOpen = ref('');

const selectPointRelay = () => {
  sideRelayPointsVisible.value = false;
  setTimeout(() => {
    emit('onSelectPointRelay', relayPointSelectedID.value);
  }, 200);
};

const selectedMarkerId = ref<string | number | null>(null);

const markers = computed(() => {
  return relayPoints.value?.map((point, index) => ({
    id: point.Id || index,
    position: {
      lat: parseFloat(point?.Location?.Latitude || '0'),
      lng: parseFloat(point?.Location?.Longitude || '0'),
    },
    title: point.Name || '',
    clickable: true,
    draggable: false,
  }));
});

const centerMarker = computed(() => {
  return {
    lat: parseFloat(relayPointSelected.value?.Location?.Latitude || '0'),
    lng: parseFloat(relayPointSelected.value?.Location?.Longitude || '0'),
  };
});

function handleMarkerClick(marker: any) {
  sideRelayPointsVisible.value = false;
  relayPointSelectedID.value = marker.id;
  setTimeout(() => {
    emit('onSelectPointRelay', relayPointSelectedID.value);
  }, 200);
}

const selectAddress = async (details: {
  postalCode: string;
  city: string;
  country: string;
  address: string;
}) => {
  try {
    relayPointsSerched.value = [];
    loading.value = true;
    await fetchRelayPoints({
      Postcode: details.postalCode,
      City: details.city,
      Country: details.country,
      Address1: details.address,
      IdCarrier: carrierSelected?.IdCarrier,
    });
  } catch (error) {}
  loading.value = false;
};

const onDrawerClosed = () => {
  relayPointsSerched.value = relayPoints.value;
  term.value = '';
};
</script>

<template>
  <div class="flex flex-wrap gap-4 w-full justify-between items-start">
    <div class="flex flex-col text-xs flex-1">
      <span v-if="relayPointSelected?.Name" class="font-normal mb-1">
        {{ relayPointSelected?.Name }}
      </span>

      <span v-if="relayPointSelected?.Address1">
        {{ relayPointSelected?.Address1 }}
      </span>
      <span v-if="relayPointSelected?.Address2">
        {{ relayPointSelected?.Address2 }}
      </span>
      <span v-if="relayPointSelected?.Address3">
        {{ relayPointSelected?.Address3 }}
      </span>
      <span v-if="relayPointSelected?.Postcode">
        {{ relayPointSelected?.Postcode }}
        <span v-if="relayPointSelected?.City">
          {{ relayPointSelected?.City }}
        </span>
      </span>

      <div class="mt-3 flex gap-5">
        <span
          v-if="relayPointSelected?.Location?.DistanceFromAddress"
          class="font-normal"
        >
          {{ relayPointSelected?.Location.DistanceFromAddress }}m
        </span>

        <span v-if="relayPointSelected?.OpeningHours" class="font-normal">
          <CardShippingRelayPointSchedules
            :relayPointSelected="relayPointSelected"
          />
        </span>
      </div>
    </div>
    <div>
      <BaseButton
        plain
        type="primary"
        size="small"
        @click.stop="sideRelayPointsVisible = true"
      >
        {{ $t('button.choose_another_relay_point') }}
      </BaseButton>
      <BaseDrawer
        v-model="sideRelayPointsVisible"
        size="100%"
        maxSize="768px"
        position="right"
        @onClose="onDrawerClosed"
      >
        <template #header>
          <span class="uppercase font-normal">
            {{ $t('button.choose_another_relay_point') }}
          </span>
        </template>
        <div class="flex flex-col h-full">
          <div class="relative">
            <InputGoogoleAutoComplete
              v-model="term"
              id="autocomplete"
              @onSelect="selectAddress"
              :placeholder="$t('label.find_relay_point')"
              border
            >
              <template #icon>
                <IconSearch color="#888888" />
              </template>
            </InputGoogoleAutoComplete>
          </div>
          <div
            class="-mx-5 flex-1 border-t border-black -mb-5"
            v-loading="loading"
          >
            <BaseTabs
              v-if="relayPointsSerched.length > 0"
              default-tab="tab-list"
            >
              <BaseTabsItem name="tab-list" :label="$t('label.relayPointList')">
                <div class="relayPoints-list overflow-auto">
                  <div v-for="rp in relayPointsSerched" :key="rp.Id">
                    <div
                      v-if="rp.Id"
                      class="cursor-pointer flex flex-col text-xs border-b border-black p-5 pl-12 relative overflow-hidden"
                      @click="relayPointSelectedID = rp.Id"
                    >
                      <InputRadio
                        v-if="rp.Id"
                        :id="`rp-${rp.Id}`"
                        :value="rp.Id"
                        v-model="relayPointSelectedID"
                        class="!absolute top-5 left-4"
                      />
                      <span v-if="rp?.Name" class="font-normal mb-1">
                        {{ rp?.Name }}
                      </span>
                      <span v-if="rp?.Address1">
                        {{ rp?.Address1 }}
                      </span>
                      <span v-if="rp?.Address2">
                        {{ rp?.Address2 }}
                      </span>
                      <span v-if="rp?.Address3">
                        {{ rp?.Address3 }}
                      </span>
                      <span v-if="rp?.Postcode">
                        {{ rp?.Postcode }}
                        <span v-if="rp?.City">
                          {{ rp?.City }}
                        </span>
                      </span>
                      <div class="mt-3 flex gap-5">
                        <span
                          v-if="rp?.Location?.DistanceFromAddress"
                          class="font-normal"
                        >
                          {{ rp?.Location.DistanceFromAddress }}m
                        </span>

                        <span v-if="rp?.OpeningHours" class="font-normal">
                          <span
                            class="text-xs inline-flex cursor-pointer"
                            @click="
                              rpSchedulesOpen === rp.Id
                                ? (rpSchedulesOpen = '')
                                : (rpSchedulesOpen = rp.Id)
                            "
                          >
                            {{ $t('button.schedules_and_info') }}
                            <IconPlus />
                          </span>
                        </span>
                      </div>

                      <transition name="slide">
                        <div
                          class="flex flex-col border border-black mt-3"
                          v-if="
                            relayPointSelected?.OpeningHours &&
                            rpSchedulesOpen === rp.Id
                          "
                        >
                          <div
                            v-for="(
                              hour, groupName, index
                            ) in relayPointSelected?.OpeningHours"
                            :key="groupName"
                            class="flex text-xs border-black"
                            :class="{
                              'border-b':
                                index <
                                Object.keys(relayPointSelected?.OpeningHours)
                                  .length -
                                  1,
                            }"
                          >
                            <span
                              class="text-xs min-w-32 font-light border-r border-black py-1 px-3"
                            >
                              {{ groupName }} :
                            </span>
                            <span class="text-xs font-normal py-1 px-3">
                              {{ hour }}
                            </span>
                          </div>
                        </div>
                      </transition>
                      <div v-if="relayPointSelectedID === rp.Id" class="mt-3">
                        <BaseButton
                          type="primary"
                          size="small"
                          class="w-full"
                          plain
                          @click="selectPointRelay()"
                        >
                          {{ $t('button.choose_this_parcel_relay') }}
                        </BaseButton>
                      </div>
                    </div>
                  </div>
                </div>
              </BaseTabsItem>
              <BaseTabsItem name="tab-map" :label="$t('label.relayPointMap')">
                <div class="relayPoints-list">
                  <BaseGoogleMap
                    v-if="markers"
                    :center="centerMarker"
                    :zoom="14"
                    :markers="markers"
                    :selectedMarkerId="relayPointSelectedID || 0"
                    @markerClick="handleMarkerClick"
                  />
                </div>
              </BaseTabsItem>
            </BaseTabs>
            <div
              v-if="relayPointsSerched.length === 0 && !loading"
              class="flex items-center justify-center h-full"
            >
              <span class="text-xs font-normal">{{
                $t('message.no_relay_point_found')
              }}</span>
            </div>
          </div>
        </div>
      </BaseDrawer>
    </div>
  </div>
</template>

<style lang="scss">
.relayPoints-list {
  height: calc(100dvh - 12rem);
}
</style>
