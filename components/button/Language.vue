<script setup lang="ts">
const formLanguageStore = useFormLanguageStore();
const { state, v$ } = toRefs(formLanguageStore);

const countryStore = useCountryStore();
const { setLocationData } = countryStore;
const { countries, currencySelected, countrySelected } = toRefs(countryStore);

const { locale, locales, t, setLocale } = useI18n();

const isVisible = ref(false);

const countrySelectedModal = computed(() => {
  return countries.value.find(
    (country) => country.IdCountry === state.value.country
  );
});

const currencySelectedModal = computed(() => {
  const defaultCurrency =
    countrySelectedModal.value?.CountryCurrencies?.find(
      (currency) => currency.IdCurrency === state.value.currency
    ) ||
    countrySelectedModal.value?.CountryCurrencies?.find(
      (currency) => currency.IsMainCurrency
    );

  return defaultCurrency;
});

const countriesOptions = computed(() => {
  return countries.value.map((country) => ({
    label: country.CountryName,
    value: country.IdCountry,
  }));
});
const currenciesOptions = computed(() => {
  if (countrySelectedModal.value?.CountryCurrencies) {
    const currencies = countrySelectedModal.value?.CountryCurrencies?.map(
      (currency) => ({
        label: currency.CurrencyName,
        value: currency.IdCurrency,
      })
    );

    return currencies;
  }

  return [];
});
const languages = computed(() => {
  return locales.value.map((lg) => ({
    label: t(`label.country_${lg}`),
    value: lg as string,
  }));
});

const switchLocalePath = useSwitchLocalePath();

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    if (countrySelectedModal.value && currencySelectedModal.value) {
      setLocationData({
        country: countrySelectedModal.value,
        currency: currencySelectedModal.value,
      });
    }

    isVisible.value = false;
    setLocale(state.value.language);
    // setTimeout(() => {
    // window.location.reload();
    window.location.href = switchLocalePath(state.value.language);
    // }, 100);
  } else {
  }
};

const setDefaultCurrency = (event: any) => {
  const defaultCountry = countries.value.find(
    (country) => country.IdCountry === event
  );

  const defaultCurrency = defaultCountry?.CountryCurrencies?.find(
    (currency) => {
      if (currency.IdCurrency === event) {
        return currency.IdCurrency === event;
      }
      return currency.IsMainCurrency;
    }
  );

  state.value.currency = defaultCurrency?.IdCurrency || 1;
};

state.value.country = countrySelected?.value?.IdCountry || 1;
state.value.currency = currencySelected.value?.IdCurrency || 1;
state.value.language = locale.value;
onMounted(() => {});
</script>

<template>
  <div class="languageModal">
    <span v-if="locale" @click="isVisible = true" class="languageModal-btn">
      <span>
        {{ locale }}
      </span>
      <ClientOnly>
        <span>|</span>
        <span v-if="currencySelected?.CurrencySign">
          {{ currencySelected?.CurrencySign }}
        </span>
      </ClientOnly>
    </span>

    <BaseModal class="languageModal-Modal" v-model="isVisible" size="600px">
      <template #header>
        <span class="text-base uppercase font-medium">
          {{ $t('titles.preference') }}
        </span>
      </template>
      <div>
        <form @submit.prevent="submitForm">
          <div class="grid grid-cols-12 gap-x-5">
            <div class="col-span-12">
              <InputSelect
                id="languageModalCountry"
                v-model="state.country"
                type="text"
                :errors="v$.country.$errors"
                :label="$t('label.make_your_purchases_in')"
                :selectOptions="countriesOptions"
                :key="state.country"
                @change="setDefaultCurrency($event)"
              />
            </div>
            <div class="col-span-6">
              <InputSelect
                id="languageModalLanguage"
                v-model="state.language"
                type="text"
                :errors="v$.language.$errors"
                :label="$t('label.your_language')"
                :selectOptions="languages"
                :key="state.language"
              />
            </div>
            <div class="col-span-6">
              <InputSelect
                id="languageModalCurrency"
                v-model="state.currency"
                type="text"
                :errors="v$.currency.$errors"
                :label="$t('label.your_currency')"
                :selectOptions="currenciesOptions"
                :key="state.currency"
              />
            </div>
            <div class="col-span-12">
              <div class="languageModal-cta mt-3">
                <BaseButton
                  type="primary"
                  size="small"
                  plain
                  class="w-full"
                  @click.stop="isVisible = false"
                  :title="$t('button.cancel')"
                >
                  {{ $t('button.cancel') }}
                </BaseButton>
                <BaseButton
                  type="primary"
                  size="small"
                  class="w-full"
                  :title="$t('button.save')"
                  submit
                >
                  {{ $t('button.save') }}
                </BaseButton>
              </div>
            </div>
          </div>
        </form>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss">
$languageModal: '.languageModal';

#{$languageModal} {
  @apply text-base flex items-center;
  &-btn {
    @apply font-light pb-[5px] pt-[12px] px-1 cursor-pointer
    uppercase flex items-center gap-1;
  }

  &-cta {
    @apply flex gap-5;
  }
  &-Modal {
    .modal-content {
      overflow: visible;
    }
  }
}
</style>
