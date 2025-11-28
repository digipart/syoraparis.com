import { defineStore } from 'pinia';
import ShopService from '~/services/ShopService';
import type {
  StockInStoreType,
  StoreReservationProductType,
} from '~/types/StoreReservationProductType';
export const useShopStore = defineStore('shopStore', () => {
  const storeReservationStores = ref<StoreReservationProductType | null>(null);
  const stores = ref<StockInStoreType[]>([]);

  const fetchStoreReservationStores = (options: {
    IdProduct: number;
    IdProductAttribute: number;
  }) => {
    const shopService = new ShopService();
    storeReservationStores.value = null;
    return shopService
      .storeReservationProduct(options)
      .then((data) => {
        // storeReservationStores.value = data;

        storeReservationStores.value = {
          IdProduct: 3598,
          Reference: 'ROCOCO869-75831/JC483',
          Attributes: {
            Size: '8(54/56)',
            Color: '75831/JC483',
          },
          StockInStore: [
            {
              IdStore: 17,
              StoreCode: 'LILLE',
              StoreName: 'LILLE',
              StoreOpeningHours: {
                Tuesday: '10:00 13:30',
                Wednesday: '10:00 13:30',
                Thursday: '10:00 13:30',
                Friday: '10:00 13:30',
                Saturday: '10:00 13:30',
              },
              StoreGoogleMapsUrl:
                'https://www.google.com/maps/place/JMP+-+JeanMarcPhilippe+-+V%C3%AAtements+grandes+tailles+Femme/@50.6120249,3.0503511,13z/data=!4m8!1m2!2m1!1sjmp+lille!3m4!1s0x47c2d588623dab43:0x1cdccc36b4fa600c!8m2!3d50.6363194!4d3.0622528',
              StoreAddress1: '2 rue Jean Roisin',
              StoreAddress2: '',
              StorePostalCode: '59800',
              StoreCity: 'Lille',
              StorePhone: '0320553466',
              StoreEmail: 'jmp.lille@gmail.com',
              Quantity: 2,
              StockStatus: 'hsksk',
            },
            {
              IdStore: 19,
              StoreCode: 'SIEGE',
              StoreName: 'SIEGE',
              StoreOpeningHours: {
                Monday: '09:15 13:00',
                Tuesday: '09:15 13:00',
                Wednesday: '09:15 13:00',
                Thursday: '09:15 13:00',
                Friday: '09:15 13:00',
              },
              StoreGoogleMapsUrl:
                'https://www.google.com/maps/place/Jean+Marc+Philippe/@48.8684008,2.3512813,17z/data=!4m12!1m6!3m5!1s0x47e66e10fe805bdf:0x3667267ab57f81c0!2sJean+Marc+Philippe!8m2!3d48.8684008!4d2.35347!3m4!1s0x47e66e10fe805bdf:0x3667267ab57f81c0!8m2!3d48.8684008!4d2',
              StoreAddress1: '135 boulevard Sébastopol',
              StoreAddress2: '',
              StorePostalCode: '75002',
              StoreCity: 'Paris',
              StorePhone: '0142364154',
              StoreEmail: 'marion@jeanmarcphilippe.com',
              Quantity: 4,
              StockStatus: 'Limited Stock',
            },
          ],
        };
        return storeReservationStores.value;
      })
      .catch((error) => {
        throw error;
      });
  };
  const saveReservationInStore = (options: {
    IdStore: number;
    IdProductAttribute: number;
    IdGender: number;
    Firstname: string;
    Lastname: string;
    Email: string;
    MobilePhone: string;
    IdProduct: number;
    Quantity: 1;
    PriceTaxIncl: number;
    PriceTaxExcl: number;
  }) => {
    const shopService = new ShopService();
    storeReservationStores.value = null;
    return shopService
      .saveReservationInStore(options)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const ftechStores = (options?: { latitude: number; longitude: number }) => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

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
        stores.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  return {
    fetchStoreReservationStores,
    saveReservationInStore,
    ftechStores,
    storeReservationStores,
    stores,
  };
});
