<script setup lang="ts">
import ShopService from '~/services/ShopService';
import type { StockInStoreType } from '~/types/StoreReservationProductType';

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.stores.title'),
  description: () => t('pages.stores.description'),
}));

const shopStore = useShopStore();
const { ftechStores } = shopStore;
const { stores } = toRefs(shopStore);
const appStore = useAppStore();
const { languageIsoCode } = toRefs(appStore);

const storeSelected = ref<StockInStoreType | null>(null);

const selectStore = (store: StockInStoreType) => {
  storeSelected.value = store;
};

const storeSelectedHendler = (store: StockInStoreType) => {};

const markers = computed(() => {
  return stores.value?.map((store, index) => ({
    id: store.IdStore || index,
    position: {
      lat: parseFloat(store?.StoreLatitude || '0'),
      lng: parseFloat(store?.StoreLongitude || '0'),
    },
    title: store.StoreName || '',
    clickable: true,
    draggable: false,
    store: store,
  }));
});

const centerMarker = computed(() => {
  return {
    lat: parseFloat(storeSelected.value?.StoreLatitude || '0'),
    lng: parseFloat(storeSelected.value?.StoreLongitude || '0'),
  };
});

const handleMarkerClick = (marker: any) => {
  storeSelected.value = marker.store;
  scrollToRef(storeSelected.value?.IdStore);
};

const term = ref('');
const selectAddress = (details: { latitude: number; longitude: number }) => {
  let params = undefined;
  if (details.latitude) {
    params = { latitude: details.latitude, longitude: details.longitude };
  }
  filterStores(params);
};

const storesFiltred = ref<StockInStoreType[]>([]);
const filterStores = (options?: { latitude: number; longitude: number }) => {
  const shopService = new ShopService();

  const params: {
    Latitude?: number;
    Longitude?: number;
    LanguageIsoCode?: string;
  } = {
    LanguageIsoCode: languageIsoCode.value,
  };
  if (options) {
    params.Latitude = options.latitude;
    params.Longitude = options.longitude;
  }

  return shopService
    .stores(params)
    .then((data) => {
      storesFiltred.value = data;
      if (storesFiltred.value.length) {
        storeSelected.value = storesFiltred.value[0];

        scrollToRef(storeSelected.value.IdStore);
      }
      return data;
    })
    .catch((error) => {
      throw error;
    });
};

const scrollbarRef = ref(null);
const scrollToRef = (storeId?: number) => {
  // Scroll to the selected store
  nextTick(() => {
    const targetElement = document.getElementById(`store-${storeId}`);

    if (scrollbarRef.value && targetElement) {
      const scrollbarElement = (scrollbarRef.value as any).$el; // `el` points to the DOM element of PerfectScrollbar

      const offsetTop = targetElement.offsetTop;

      scrollbarElement.scrollTop = offsetTop;
    }
  });
};

try {
  await ftechStores({
    latitude: 48.8606104,
    longitude: 2.3391758,
    radius: 1000,
  });
  storeSelected.value = stores.value[0];
} catch (error) {}
</script>

<template>
  <div class="my-20">
    <LayoutContainer>
      <BaseHeadLine class="font-normal mb-10" size="_2xl">
        {{ $t('titles.our_stores') }}
        <small class="block font-light text-[60%]">
          {{ $t('titles.our_stores_near_you') }}
        </small>
      </BaseHeadLine>
      <div class="grid grid-cols-12 gap-5">
        <div class="col-span-4">
          <BaseHeadLine
            size="sm"
            class="uppercase font-normal mb-3 border-b pb-1"
          >
            {{ $t('label.stores') }}
          </BaseHeadLine>

          <div class="relative">
            <InputGoogoleAutoComplete
              v-model="term"
              id="autocomplete"
              @onSelect="selectAddress"
              :label="$t('label.search_address')"
              border
            >
            </InputGoogoleAutoComplete>
          </div>
          <PerfectScrollbar
            ref="scrollbarRef"
            class="max-h-[600px] overflow-auto stores"
          >
            <div class="flex flex-col gap-3">
              <template v-for="store in stores" :key="store.IdStore">
                <CardStoreAddress
                  :id="`store-${store.IdStore}`"
                  :ref="`store-${store.IdStore}`"
                  :checked="storeSelected?.IdStore === store?.IdStore"
                  :store="store"
                  @click="selectStore(store)"
                  @onStoreSelected="storeSelectedHendler($event)"
                />
              </template>
            </div>
          </PerfectScrollbar>
        </div>
        <div class="col-span-8">
          <BaseHeadLine
            size="sm"
            class="uppercase font-normal mb-3 border-b pb-1"
          >
            {{ $t('label.view_on_map') }}
          </BaseHeadLine>

          <BaseGoogleMap
            v-if="markers"
            :useMonoTheme="true"
            :center="centerMarker"
            :zoom="14"
            :markers="markers"
            :selectedMarkerId="storeSelected?.IdStore || 0"
            @markerClick="handleMarkerClick"
          />
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>

<style scoped></style>
