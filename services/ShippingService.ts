import type { RelayPointsType } from '~/types/RelayPointsType';
import Service from './Services';
import type { ShippingType } from '~/types/ShippingType';

export type ShippingRequestType = {
  IdAddress?: number;
  LanguageIsoCode?: string;
  CurrencyIsoCode?: string;
  ResponseLevel?: 'summary' | 'details' | 'complete';
};

export default class ShippingService extends Service {
  constructor() {
    super();
  }

  async fetch(options: ShippingRequestType) {
    try {
      const data = await this.$get<ShippingType>('carrier', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async fetchRelayPoint(options: { IdAddress: number; IdCarrier: number }) {
    options = { ...options, ...{ CarrierType: 'relayPoint' } };
    try {
      const data = await this.$get<RelayPointsType>('carrier/relayPoint', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async findRelayPoint(options: { Postcode: string; City: string }) {
    try {
      const data = await this.$get<RelayPointsType>('colissimo/relaypoints', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
