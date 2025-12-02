import { defineStore } from 'pinia';
import CountryService from '~/services/CountryService';
import type { CountryType } from '~/types/CountryType';
import type { CurrencyType } from '~/types/CurrencyType';

const COUNTRY_ID = 'COUNTRY_ID';
const CURRENCY_ID = 'CURRENCY_ID';

export const useCountryStore = defineStore('countryStore', () => {
  const countries = ref<CountryType[]>([]);
  const countrySelected = ref<CountryType>();
  const currencySelected = ref<CurrencyType>();

  const idCountryCookie = () => {
    const countryID = useCookie(COUNTRY_ID);
    return Number(countryID.value || 0);
  };
  const idCurrencyCookie = () => {
    const currencyID = useCookie(CURRENCY_ID);
    return currencyID.value ? Number(currencyID.value) : 0;
  };

  const initData = (countries: CountryType[]) => {
    // Your logic to set selected country
    let defaultCountry = null;
    if (idCountryCookie() === 0) {
      defaultCountry = countries.find(
        (country) => country?.CountryIsoCode === 'FR'
      );
    } else {
      defaultCountry = countries.find(
        (country) => country.IdCountry === idCountryCookie()
      );
    }

    const defaultCurrency = defaultCountry?.CountryCurrencies?.find(
      (currency) => {
        const idCurrency = idCurrencyCookie(); // Check if the cookie has a value

        if (idCurrency) {
          return currency.IdCurrency === idCurrency; // Use cookie value if available
        }

        return currency.IsMainCurrency; // Fallback to main currency
      }
    );
    if (defaultCountry && defaultCurrency) {
      setLocationData({ country: defaultCountry, currency: defaultCurrency });
    }
  };

  const setLocationData = ({
    country,
    currency,
  }: {
    country: CountryType;
    currency: CurrencyType;
  }) => {
    countrySelected.value = country;
    currencySelected.value = currency;

    const countryID = useCookie(COUNTRY_ID, {
      maxAge: 60 * 60 * 8,
    });
    countryID.value = String(countrySelected.value.IdCountry);

    const currencyID = useCookie(CURRENCY_ID, {
      maxAge: 60 * 60 * 8,
    });

    currencyID.value = String(currencySelected.value.IdCurrency);
  };

  const fetchCountries = async () => {
    const appStore = useAppStore();
    const { languageIsoCode } = toRefs(appStore);

    const countryService = new CountryService();
    const options = {
      LanguageIsoCode: languageIsoCode.value,
    };

    try {
      const data = await countryService.fetch(options);
      countries.value = data;
      initData(data);
    } catch (error) {}
  };

  return {
    countries,
    countrySelected,
    currencySelected,
    fetchCountries,
    setLocationData,
  };
});
