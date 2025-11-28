import Service from './Services';
import type { AddressResponse, AddressType } from '~/types/AddressType';

export default class AddressService extends Service {
  constructor() {
    super();
  }

  async fetch(options: any) {
    try {
      const data = await this.$get<AddressType[]>('customer/address', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async add(address: AddressType) {
    try {
      const data = await this.$post<AddressResponse>('customer/address/add', {
        options: address,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async update(address: AddressType) {
    try {
      const data = await this.$put<AddressResponse>('customer/address/update', {
        options: address,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateType(options: {
    IdAddress: number;
    IsDelivery: boolean;
    IsInvoice: boolean;
  }) {
    try {
      const data = await this.$put<AddressResponse>('customer/address/type', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
