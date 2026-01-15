import { defineStore } from 'pinia';
import CartService from '~/services/CartService';
import type { CartType } from '~/types/CartType';
import type { ProductType } from '~/types/ProductType';
import type { CarrierGenre } from '~/types/ShippingType';

const CART_ID = 'CART_ID';

type RequestQuery = {
  IdCart?: number;
  IdProduct?: number;
  IdProductAttribute?: number;
  Quantity?: number;
  NewIdProductAttribute?: number;

  FullName?: string;
  Email?: string;
  Message?: string;
  DateSend?: string;
  LanguageIsoCode?: string;
  ProductType?: string;
};

export const useCartStore = defineStore('cartStore', () => {
  const loaded = ref(false);
  const cart = ref({} as CartType);
  const cartId = ref(0);
  const totalToPay = ref(0);
  const productTotalToPay = ref(0);
  const totalProductQuantity = ref(0);
  const carrier = ref<CarrierGenre | null>(null);

  const promoCodes = computed(() => {
    return cart.value?.Discounts?.PromoCodes || [];
  });

  const totalDiscount = computed(() => {
    return cart.value?.Total?.Discount?.TaxIncl;
  });

  const clear = () => {
    cart.value = {} as CartType;
    cartId.value = 0;
    totalToPay.value = 0;
    totalProductQuantity.value = 0;
  };

  const initIdCart = () => {
    const auth = useAuth();
    const { customer, isLoggedIn } = auth;

    if (isLoggedIn) {
      cartId.value = customer?.IdCart || 0;
    } else {
      if (!cartId.value) {
        const cartCookie = useCookie(CART_ID, { maxAge: 60 * 60 * 8 });
        if (cartCookie.value) {
          cartId.value = Number(cartCookie.value);
        }
      }
    }
  };

  const addCartToCookie = (id: number) => {
    const cartCookie = useCookie(CART_ID, { maxAge: 60 * 60 * 8 });
    cartCookie.value = String(id);
  };

  const removeCartFromCookie = () => {
    const cartCookie = useCookie(CART_ID);
    cartCookie.value = null;
    cartId.value = 0;
  };

  const setDate = (data: CartType) => {
    cart.value = data;
    totalToPay.value = data?.Total?.ToPay?.TaxIncl || 0;
    productTotalToPay.value = data.Total?.Product?.TaxIncl || 0;
    totalProductQuantity.value = data.Total?.Product?.Quantity || 0;
    carrier.value = data?.Shipping?.Carrier || null;
  };

  const fetchCart = async (): Promise<CartType> => {
    const appStore = useAppStore();
    const { currencyIsoCode, countryIsoCode, languageIsoCode } =
      toRefs(appStore);

    const cartService = new CartService();
    const options: {
      IdCart?: number;
      CurrencyIsoCode: string;
      LanguageIsoCode: string;
      CountryIsoCode?: string;
      ResponseLevel: string;
    } = {
      CurrencyIsoCode: currencyIsoCode.value,
      LanguageIsoCode: languageIsoCode.value,
      CountryIsoCode: countryIsoCode.value,
      ResponseLevel: 'complete',
    };

    initIdCart();
    if (cartId.value) {
      options.IdCart = cartId.value;
    }

    if (!options.IdCart) {
      return {} as CartType;
    }
    return cartService
      .fetch(options)
      .then((data) => {
        loaded.value = true;
        setDate(data);
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const addToCart = ({
    idProduct,
    idProductAttribute,
    quantity = 1,
    fullName,
    email,
    message,
    dateSend,
    languageIsoCode,
    productType,
  }: {
    idProduct: number;
    idProductAttribute: number;
    quantity?: number;

    fullName?: string;
    email?: string;
    message?: string;
    dateSend?: string;
    languageIsoCode?: string;
    productType?: 'e-giftcard' | '';
  }) => {
    const auth = useAuth();
    const { isLoggedIn } = auth;

    const cartService = new CartService();

    const options: RequestQuery = {
      IdProduct: idProduct,
      IdProductAttribute: idProductAttribute,
      Quantity: quantity,
    };

    if (productType === 'e-giftcard') {
      // Only add defined values to the request
      if (fullName !== undefined) options.FullName = fullName;
      if (email !== undefined) options.Email = email;
      if (message !== undefined) options.Message = message;
      if (dateSend !== undefined) options.DateSend = dateSend;
      if (languageIsoCode !== undefined) options.LanguageIsoCode = languageIsoCode;
      options.ProductType = productType; // Always include product type
    }

    if (cartId.value) {
      options.IdCart = cartId.value;
    }

    return cartService
      .add(options)
      .then((data) => {
        if (data?.IdCart) {
          cartId.value = data?.IdCart;
          if (!isLoggedIn) {
            addCartToCookie(cartId.value);
          }
        }
        fetchCart();
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const updateProductInCart = ({
    idProduct,
    idProductAttribute,
    quantity = 1,
    newIdProductAttribute,
  }: {
    idProduct: number;
    idProductAttribute: number;
    quantity?: number;
    newIdProductAttribute?: number;
  }) => {
    const cartService = new CartService();

    const options: RequestQuery = {
      IdProduct: idProduct,
      IdProductAttribute: idProductAttribute,
      Quantity: quantity,
      NewIdProductAttribute: newIdProductAttribute,
    };

    if (cartId.value) {
      options.IdCart = cartId.value;
    }

    return cartService
      .update(options)
      .then((data) => {
        fetchCart();
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const removeFromCart = (product: ProductType) => {
    const cartService = new CartService();

    const options: RequestQuery = {
      IdProduct: product.IdProduct,
      IdProductAttribute: product.IdProductAttribute,
    };

    if (cartId.value) {
      options.IdCart = cartId.value;
    }

    return cartService
      .remove(options)
      .then(async (data) => {
        fetchCart();
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const updateShipping = ({
    idCarrier,
    IdRelayPoint,
  }: {
    idCarrier: number;
    IdRelayPoint?: string;
  }) => {
    const cartService = new CartService();

    const options: any = {
      IdCart: cartId.value,
      IdCarrier: idCarrier,
    };

    if (IdRelayPoint) {
      options.IdRelayPoint = IdRelayPoint;
    }

    return cartService
      .updateShipping(options)
      .then((data) => {
        return data;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  };

  const newIdCart = () => {
    const cartService = new CartService();
    return cartService.getNewCart().then((data) => {
      return data.IdCart;
    });
  };

  const removeCarrier = () => {
    carrier.value = null;
  };

  return {
    cart,
    cartId,
    totalToPay,
    productTotalToPay,
    totalProductQuantity,
    carrier,
    promoCodes,
    totalDiscount,
    loaded,
    clear,
    initIdCart,
    addCartToCookie,
    removeCartFromCookie,
    setDate,
    fetchCart,
    addToCart,
    updateProductInCart,
    removeFromCart,
    updateShipping,
    newIdCart,
    removeCarrier,
  };
});
