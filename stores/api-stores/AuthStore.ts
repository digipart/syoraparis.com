import { defineStore } from 'pinia';
import { toRefs } from 'vue';
import type {
  LoginOptions,
  RegisterOptions,
  LoginType,
} from '~/services/AuthService';
import AuthService from '~/services/AuthService';
import Service from '~/services/Services';
import type { AddressType } from '~/types/AddressType';
import type {
  AuthDataType,
  CustomerRegisterType,
  CustomerType,
} from '~/types/AuthDataType';

export const useAuth = defineStore('useAuthStore', () => {
  const customer = ref<CustomerType | undefined | null>(undefined);
  // const token = ref<string | null | undefined>(null);
  const isGuest = ref(false);
  const isLoggedIn = ref(false);
  const token = ref<string | null>(null);
  const service = new Service();

  // const tokenCookie = computed({
  //   get() {
  //     const service = new Service();
  //     return service.getTokenFromoCookie().value;
  //   },
  //   set(value: string | null | undefined) {
  //     const service = new Service();
  //     service.setTokenToCookie(value);
  //   },
  // });

  function initStore() {
    const favoriteStore = useFavoritesStore();
    const cartStore = useCartStore();

    const { fetchCart } = cartStore;
    const { fetchFavorite } = favoriteStore;

    // const addressStore = useAddressStore();
    // const { fetchAddresses } = addressStore;
    // fetchAddresses();

    setTimeout(() => {
      fetchCart();
      fetchFavorite();
    }, 100);
  }

  function updateAuthData(data: AuthDataType | null) {
    if (data) {
      customer.value = data?.AuthData?.Customer;
      token.value = data?.AuthData?.Token || null;

      service.setTokenToCookie(token.value);

      isLoggedIn.value = true;
      isGuest.value = !!data.AuthData?.Customer?.Guest;
    } else {
      customer.value = null;
      token.value = null;
      service.setTokenToCookie(null);
      isLoggedIn.value = false;
      isGuest.value = false;
    }
  }

  function login(type: LoginType, options: LoginOptions) {
    const authService = new AuthService();

    const cartStore = useCartStore();
    const { removeCartFromCookie } = cartStore;
    const { cartId } = toRefs(cartStore);

    const favoriteStore = useFavoritesStore();
    const { removeFavoriteFromCookie } = favoriteStore;
    const { favoriteId } = toRefs(favoriteStore);

    const appStore = useAppStore();
    const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

    options.CurrencyIsoCode = currencyIsoCode.value;
    options.LanguageIsoCode = languageIsoCode.value;

    if (cartId.value) {
      options.IdCart = Number(cartId.value);
      removeCartFromCookie();
    }
    if (favoriteId.value) {
      options.IdFavorite = Number(favoriteId.value);
      removeFavoriteFromCookie();
    }

    return authService
      .login(type, options)
      .then((data) => {
        updateAuthData(data);
        initStore();

        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  async function register(options: RegisterOptions) {
    const authService = new AuthService();
    const cartStore = useCartStore();
    const { removeCartFromCookie } = cartStore;
    const { cartId } = toRefs(cartStore);

    const favoriteStore = useFavoritesStore();
    const { removeFavoriteFromCookie } = favoriteStore;
    const { favoriteId } = toRefs(favoriteStore);

    const appStore = useAppStore();
    const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

    try {
      options.CurrencyIsoCode = currencyIsoCode.value;
      options.LanguageIsoCode = languageIsoCode.value;

      if (cartId.value) {
        options.IdCart = Number(cartId.value);
        removeCartFromCookie();
      }
      if (favoriteId.value) {
        options.IdFavorite = Number(favoriteId.value);
        removeFavoriteFromCookie();
      }

      const data = await authService.register(options);
      updateAuthData(data);

      initStore();
    } catch (error) {
      throw error;
    }
  }

  function updateProfil(options: RegisterOptions) {
    const authService = new AuthService();

    return authService
      .updateProfil(options)
      .then((data) => {
        refresh();
        return data;
      })
      .catch((error) => {
        throw error;
      });
  }

  async function registerGuest(options: CustomerRegisterType) {
    const authService = new AuthService();

    const cartStore = useCartStore();
    const { removeCartFromCookie } = cartStore;
    const { cartId } = toRefs(cartStore);

    const favoriteStore = useFavoritesStore();
    const { removeFavoriteFromCookie } = favoriteStore;
    const { favoriteId } = toRefs(favoriteStore);

    const appStore = useAppStore();
    const { currencyIsoCode, countryIsoCode, languageIsoCode } =
      toRefs(appStore);

    options.CurrencyIsoCode = currencyIsoCode.value;
    options.LanguageIsoCode = languageIsoCode.value;
    options.Guest = true;
    options.IsDelivery = true;
    options.IsInvoice = true;

    try {
      if (cartId.value) {
        options.IdCart = Number(cartId.value);
        removeCartFromCookie();
      }
      if (favoriteId.value) {
        options.IdFavorite = Number(favoriteId.value);
        removeFavoriteFromCookie();
      }

      const data = await authService.registerGuest(options);

      updateAuthData(data);
      initStore();

      return data;
    } catch (error) {
      throw error;
    }
  }

  // async function registerGuest() {
  //   const authService = new AuthService();

  //   const cartStore = useCartStore();
  //   const { removeCartFromCookie } = cartStore;
  //   const { cartId } = toRefs(cartStore);

  //   const favoriteStore = useFavoritesStore();
  //   const { removeFavoriteFromCookie } = favoriteStore;
  //   const { favoriteId } = toRefs(favoriteStore);

  //   const appStore = useAppStore();
  //   const { currencyIsoCode, countryIsoCode, languageIsoCode } =
  //     toRefs(appStore);

  //   const formDeliveryStore = useFormDeliveryStore();
  //   const { state } = toRefs(formDeliveryStore);

  //   const options: CustomerRegisterType = {
  //     Lastname: state.value.name,
  //     Firstname: state.value.firstname,
  //     Email: state.value.email,
  //     Address1: state.value.address,
  //     Postcode: state.value.postcode,
  //     City: state.value.city,
  //     MobilePhone: state.value.phone,
  //   };

  //   options.CountryIsoCode = countryIsoCode.value;
  //   options.CurrencyIsoCode = currencyIsoCode.value;
  //   options.LanguageIsoCode = languageIsoCode.value;
  //   options.Guest = true;
  //   options.IsDelivery = true;
  //   options.IsInvoice = true;

  //   try {
  //     if (cartId.value) {
  //       options.IdCart = Number(cartId.value);
  //       removeCartFromCookie();
  //     }
  //     if (favoriteId.value) {
  //       options.IdFavorite = Number(favoriteId.value);
  //       removeFavoriteFromCookie();
  //     }

  //     const data = await authService.registerGuest(options);

  //     updateAuthData(data);
  //     initStore();

  //     return data;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  function logout() {
    token.value = null;
    service.setTokenToCookie(token.value);

    const cartStore = useCartStore();
    cartStore.removeCartFromCookie();
    cartStore.clear();

    const favoriteStore = useFavoritesStore();
    favoriteStore.removeFavoriteFromCookie();
    favoriteStore.clear();

    const addressStore = useAddressStore();
    addressStore.clear();

    const shippingStore = useShippingStore();
    shippingStore.clear();

    customer.value = {};
    isLoggedIn.value = false;
  }

  async function refresh(): Promise<AuthDataType | null> {
    const authService = new AuthService();
    const service = new Service();
    try {
      const tokenCookie = service.getTokenFromoCookie();

      if (!tokenCookie.value) {
        updateAuthData(null);
        throw new Error('No token');
      }
      const data = await authService.refresh();
      updateAuthData(data);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async function loginWithFacebook(facebookData: {
    accessToken: string;
    userId: string;
    email?: string;
    name?: string;
    picture?: string;
  }) {
    try {
      const firstname = facebookData.name?.split(' ')[0] || '';
      const lastname =
        facebookData.name?.split(' ').slice(1).join(' ') || firstname;
      const options: LoginOptions = {
        FacebookCustomerId: facebookData.userId,
        Email: facebookData.email,
        Firstname: firstname,
        Lastname: lastname,
      };

      const cartStore = useCartStore();
      const { removeCartFromCookie } = cartStore;
      const { cartId } = toRefs(cartStore);

      const favoriteStore = useFavoritesStore();
      const { removeFavoriteFromCookie } = favoriteStore;
      const { favoriteId } = toRefs(favoriteStore);

      const appStore = useAppStore();
      const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

      options.CurrencyIsoCode = currencyIsoCode.value;
      options.LanguageIsoCode = languageIsoCode.value;

      if (cartId.value) {
        options.IdCart = Number(cartId.value);
        removeCartFromCookie();
      }
      if (favoriteId.value) {
        options.IdFavorite = Number(favoriteId.value);
        removeFavoriteFromCookie();
      }

      return await login('facebook', options);
    } catch (error) {
      throw error;
    }
  }

  async function customerSaveAddress() {
    const checkoutStore = useCheckoutStore();
    const { checkoutCustomer, hasSameAddressForShipping } =
      toRefs(checkoutStore);
    const addressStore = useAddressStore();
    const { addressDelivery } = toRefs(addressStore);
    const { addAddress } = addressStore;
    if (isLoggedIn.value && !isGuest.value && !addressDelivery.value) {
      await addAddress({
        Firstname: checkoutCustomer.value.deliveryAddress.firstname,
        Lastname: checkoutCustomer.value.deliveryAddress.lastname,
        Address1: checkoutCustomer.value.deliveryAddress.address,
        Postcode: checkoutCustomer.value.deliveryAddress.postalCode,
        City: checkoutCustomer.value.deliveryAddress.city,
        CountryIsoCode: checkoutCustomer.value.deliveryAddress.country,
        MobilePhone: checkoutCustomer.value.deliveryAddress.phone,
        IsInvoice: true,
        IsDelivery: true,
      });

      if (!hasSameAddressForShipping.value) {
        const address = {} as AddressType;
        address.Firstname = checkoutCustomer.value.invoiceAddress.firstname;
        address.Lastname = checkoutCustomer.value.invoiceAddress.lastname;
        address.Address1 = checkoutCustomer.value.invoiceAddress.address;
        address.Postcode = checkoutCustomer.value.invoiceAddress.postalCode;
        address.City = checkoutCustomer.value.invoiceAddress.city;
        address.CountryIsoCode = checkoutCustomer.value.invoiceAddress.country;
        address.MobilePhone = checkoutCustomer.value.invoiceAddress.phone;
        address.IsDelivery = false;
        address.IsInvoice = true;
        await addAddress(address);
      }
    }
  }

  return {
    customer,
    token,
    isGuest,
    isLoggedIn,
    initStore,
    updateAuthData,
    login,
    register,
    updateProfil,
    registerGuest,
    logout,
    refresh,
    loginWithFacebook,
    customerSaveAddress,
  };
});
