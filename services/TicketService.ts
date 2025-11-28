import type { BoughtProductsType, TicketType } from '~/types/TicketType';
import Service from './Services';

export default class TicketService extends Service {
  constructor() {
    super();
  }

  async fetchTickets(options: any) {
    try {
      const data = await this.$get<TicketType[]>('tickets', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async fetchTicket(options: { IdTicket: number; LanguageIsoCode: string }) {
    try {
      const data = await this.$get<TicketType>('ticket', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async createTicket(options: any) {
    try {
      const data = await this.$post<any>('ticket', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async sendMessage(options: any) {
    try {
      const data = await this.$post<any>('ticket/message', {
        options,
        isAuth: true,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async fetchLastBoughtProducts(options: {
    Offset: number;
    Limit: number;
    LanguageIsoCode?: string;
  }) {
    try {
      const data = await this.$get<BoughtProductsType>(
        'order/lastBoughtProducts',
        {
          options,
          isAuth: true,
        }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
}
