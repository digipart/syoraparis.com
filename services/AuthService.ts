import type { AuthDataType, CustomerRegisterType } from '~/types/AuthDataType';
import Service from './Services';

export type LoginOptions = {
  GoogleCustomerId?: string;
  FacebookCustomerId?: string;

  Email?: string;
  Password?: string;
  Firstname?: string;
  Lastname?: string;

  IdCart?: number;
  IdFavorite?: number;

  CurrencyIsoCode?: string;
  LanguageIsoCode?: string;
};

export type RegisterOptions = {
  Email?: string;
  Password?: string;
  Firstname?: string;
  Lastname?: string;
  Birthday?: string;

  IdCart?: number;
  IdFavorite?: number;

  CurrencyIsoCode?: string;
  LanguageIsoCode?: string;
  NewletterActive?: boolean;
};

export type LoginType = 'credentials' | 'facebook' | 'google';

export default class AuthService extends Service {
  constructor() {
    super();
  }
  async login(type: LoginType, options: LoginOptions) {
    let loginUrl = 'authentification/email';

    if (type === 'google') {
      loginUrl = 'authentification/google';
    } else if (type === 'facebook') {
      loginUrl = 'authentification/facebook';
    }

    try {
      const data = await this.$post<AuthDataType>(loginUrl, { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async register(options: RegisterOptions) {
    try {
      const data = await this.$post<AuthDataType>('customer', { options });
      return data;
    } catch (error) {
      throw error;
    }
  }
  async updateProfil(options: RegisterOptions) {
    try {
      const data = await this.$put<{ IdCustomer: number; message: string }>(
        'customer',
        { options, isAuth: true }
      );
      return data;
    } catch (error) {
      throw error;
    }
  }
  async refresh() {
    try {
      const data = await this.$get<AuthDataType>('customer', { isAuth: true });
      return data;
    } catch (error) {
      throw error;
    }
  }

  //guest

  async emailIsAvailble(email: string) {
    const options = {
      Email: email,
    };
    try {
      const data = await this.$post<AuthDataType>('customer/email/available', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  async registerGuest(options: CustomerRegisterType) {
    try {
      const data = await this.$post<AuthDataType>('customer', {
        options,
      });
      return data;
    } catch (error) {
      throw error;
    }
  }
}
