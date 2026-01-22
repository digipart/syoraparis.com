import { defineStore } from 'pinia';
import { ref } from 'vue';
import ShippingService, {
  type ShippingRequestType,
} from '~/services/ShippingService';
import type { RelayPointType } from '~/types/RelayPointsType';
import type { CarrierType, ShippingType } from '~/types/ShippingType';

export const useShippingStore = defineStore('shippingStore', () => {
  const carriers = ref<string[]>([]);
  const carrier = ref<CarrierType>({} as CarrierType);
  const toshow = ref<string>('all');
  const error = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const relayPoints = ref<RelayPointType[]>([]);
  const relayPointsSerched = ref<RelayPointType[]>([]);
  const relayPointSelected = ref<RelayPointType | null>(null);
  

  const clear = () => {
    carriers.value = [];
    carrier.value = {};
    relayPoints.value = [];
    relayPointsSerched.value = [];
    relayPointSelected.value = {};
  };

  const setData = (data: ShippingType) => {
    if (data.Carriers) {
      carriers.value = data.Carriers;
      try {
        toshow.value = carriers.value[0] || '';
      } catch (err) {
        console.error('Error setting toshow:', err);
      }
    }
    if (data.Carrier) {
      carrier.value = data.Carrier;
    }
  };

  const fetchShipping = async (options: ShippingRequestType) => {
    const shippingService = new ShippingService();
    const appStore = useAppStore();
    const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

    loading.value = true;
    options.LanguageIsoCode = languageIsoCode.value;
    options.CurrencyIsoCode = currencyIsoCode.value;

    try {
      const data = await shippingService.fetch(options);
      setData(data);
      return data;
    } catch (err) {
      error.value = true;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchRelayPoints = (options: {
    IdAddress: number;
    IdCarrier: number;
  }) => {
    const shippingService = new ShippingService();
    return shippingService
      .fetchRelayPoint(options)
      .then((data) => {
        if (data.RelayPoints) {
          relayPoints.value = data.RelayPoints;
          relayPointsSerched.value = data.RelayPoints;
        }
        return data.RelayPoints;
      })
      .catch((error) => {
        throw error;
      });
  };
  const findRelayPoint = (options: { Postcode: string; City: string }) => {
    const shippingService = new ShippingService();
    return shippingService
      .findRelayPoint(options)
      .then((data) => {
        if (data.RelayPoints) {
          relayPointsSerched.value = data.RelayPoints;
        }
        return data.RelayPoints;
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    carriers,
    carrier,
    toshow,
    error,
    loading,
    relayPoints,
    relayPointsSerched,
    relayPointSelected,
    clear,
    setData,
    fetchShipping,
    fetchRelayPoints,
    findRelayPoint,
  };
});
