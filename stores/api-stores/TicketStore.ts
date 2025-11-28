// stores/productStore.ts
import { defineStore } from 'pinia';
import TicketService from '~/services/TicketService';
import type { BoughtProductsType, TicketType } from '~/types/TicketType';

export const useTicketStore = defineStore('ticketStore', () => {
  const lastBoughtProductsResponse = ref<BoughtProductsType | null>(null);
  const ticketsList = ref<TicketType[]>([]);
  const ticket = ref<TicketType | null>(null);

  const fetchTickets = () => {
    const ticketService = new TicketService();

    return ticketService
      .fetchTickets({ FromProductNumber: 0, ToProductNumber: 5 })
      .then((data) => {
        ticketsList.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchTicket = (options: { IdTicket: number }) => {
    const ticketService = new TicketService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    return ticketService
      .fetchTicket({
        IdTicket: options.IdTicket,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        ticket.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const createTicket = (options: {
    IdOrder: string;
    Title?: string;
    Description?: string;
    Priority: number;
    IdProductAttribute: number;
    LanguageIsoCode: string;
  }) => {
    const ticketService = new TicketService();

    return ticketService
      .createTicket(options)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };
  const sendMessage = (options: { IdTicket: number; Message?: string }) => {
    const ticketService = new TicketService();

    return ticketService
      .sendMessage(options)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  const fetchLastBoughtProducts = () => {
    const ticketService = new TicketService();
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    return ticketService
      .fetchLastBoughtProducts({
        Offset: 0,
        Limit: 5,
        LanguageIsoCode: languageIsoCode.value,
      })
      .then((data) => {
        lastBoughtProductsResponse.value = data;
        return data;
      })
      .catch((error) => {
        throw error;
      });
  };

  return {
    lastBoughtProductsResponse,
    ticketsList,
    ticket,
    fetchLastBoughtProducts,
    fetchTickets,
    sendMessage,
    fetchTicket,
    createTicket,
  };
});
