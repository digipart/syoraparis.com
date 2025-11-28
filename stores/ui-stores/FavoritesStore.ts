import { defineStore } from 'pinia';
import FavoriteService from '~/services/FavoriteService';
import type { FavoriteType } from '~/types/FavoriteType';

const FAVORITE_ID = 'FAVORITE_ID';

export const useFavoritesStore = defineStore('favoritesStore', {
  state: () => ({
    favorite: {} as FavoriteType,
    favoriteId: null as number | null,
  }),
  actions: {
    addFavoriteToCookie(id: number) {
      const favoriteID = useCookie(FAVORITE_ID, {
        maxAge: 60 * 60 * 8,
      });
      favoriteID.value = String(id);
    },

    clear() {
      this.favorite = {};
      this.favoriteId = null;
    },
    initIdFavorite() {
      const auth = useAuth();
      const { customer, isLoggedIn } = toRefs(auth);

      if (isLoggedIn.value) {
        this.favoriteId = customer.value?.IdFavorite || null;
      } else {
        if (!this.favoriteId) {
          const favoriteId = useCookie(FAVORITE_ID, {
            maxAge: 60 * 60 * 8,
          });
          if (favoriteId.value) {
            this.favoriteId = Number(favoriteId.value);
          }
        }
      }
    },

    removeFavoriteFromCookie() {
      const favoriteId = useCookie(FAVORITE_ID);
      favoriteId.value = null;
      this.favoriteId = null;
    },

    fetchFavorite() {
      const appStore = useAppStore();
      const { currencyIsoCode, languageIsoCode } = toRefs(appStore);

      const favoriteService = new FavoriteService();
      const options: {
        IdFavorite?: string;
        CurrencyIsoCode: string;
        LanguageIsoCode: string;
        ResponseLevel: string;
      } = {
        CurrencyIsoCode: currencyIsoCode.value,
        LanguageIsoCode: languageIsoCode.value,
        ResponseLevel: 'complete',
      };
     
      if (this.favoriteId) {
        options.IdFavorite = String(this.favoriteId);
      }

      if (options.IdFavorite) {
        favoriteService.fetch(options).then((data) => {
          this.favorite = data;
        });
      }
    },

    addToFavorite(idProduct: number): Promise<FavoriteType> {
      const favoriteService = new FavoriteService();
      const options: {
        IdFavorite?: number;
        IdProduct?: number;
      } = {
        IdProduct: idProduct,
      };

      const auth = useAuth();
      const { isLoggedIn } = auth;
      if (this.favoriteId) {
        options.IdFavorite = this.favoriteId;
      }

      return favoriteService
        .add(options)
        .then((data) => {
          
          if (data?.IdFavorite) {
            this.favoriteId = data?.IdFavorite;
            if (!isLoggedIn) {
              this.addFavoriteToCookie(this.favoriteId);
            }
          }

          this.fetchFavorite();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },

    removeFromFavorite(idProduct: number): Promise<FavoriteType> {
      const favoriteService = new FavoriteService();
      // const favoriteID = useCookie(FAVORITE_ID);

      const options: {
        IdFavorite?: number;
        IdProduct?: number;
      } = {
        IdProduct: idProduct,
      };

      if (this.favoriteId) {
        options.IdFavorite = this.favoriteId;
      }

      return favoriteService
        .remove(options)
        .then((data) => {
          this.fetchFavorite();
          return data;
        })
        .catch((error) => {
          throw error;
        });
    },

    isProductFavorite(idProduct: number) {
      if (this.favorite && this.favorite.Products) {
        return this.favorite.Products.some(
          (product) => product.IdProduct === Number(idProduct)
        );
      }
      return false;
    },
  },
});
