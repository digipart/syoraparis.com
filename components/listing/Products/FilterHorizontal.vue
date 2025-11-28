<script setup lang="ts">
import type {
  AttributeType,
  FilterAttributeGroup,
  FilterAttributeType,
} from '~/types/CategoryType';

const appStore = useAppStore();
const { currencySign } = toRefs(appStore);

const categoryStore = useCategoryStore();
const { fetchFilterAttrs, initFilterAttrs } = categoryStore;
const { filterAttributes, filterValues } = toRefs(categoryStore);

const { t } = useI18n();
const router = useRouter();
const route = useRoute();

const emit = defineEmits(['onFilterClick']);

const isVisible = ref(false);

const sortOptions = [
  {
    value: 'price_asc',
    label: t('label.price_asc'),
  },
  {
    value: 'price_desc',
    label: t('label.price_desc'),
  },
  {
    value: 'newest_desc',
    label: t('label.newest_desc'),
  },
  {
    value: 'newest_asc',
    label: t('label.newest_asc'),
  },
];

const filterAttrs = computed(() => {
  if (filterAttributes.value?.FilterAttribute) {
    return filterAttributes.value?.FilterAttribute;
  }

  return {} as FilterAttributeType;
});

const filterAttrsSizes = computed(() => {
  if (filterAttrs.value.AttributeGroup?.length) {
    return filterAttrs.value.AttributeGroup[0];
  }

  return {} as FilterAttributeGroup;
});

const filterAttrsColors = computed(() => {
  if (filterAttrs.value.AttributeGroup?.length) {
    return filterAttrs.value.AttributeGroup[1];
  }

  return {} as FilterAttributeGroup;
});

const rangePrices = filterValues.value.price;

const getOptions = (attr: AttributeType[]) => {
  return attr.map((item) => {
    return { value: item.IdAttribute || '0', label: item.AttributeName || '' };
  });
};

const startFilter = () => {
  const isFilterPrice =
    filterValues.value.price[0] !==
      filterAttributes.value?.FilterPrice?.RegularPrice?.MinPriceTaxIncl ||
    filterValues.value.price[1] !==
      filterAttributes.value?.FilterPrice?.RegularPrice?.MaxPriceTaxIncl;

  router.replace({
    query: {
      ...(filterValues.value.sort !== ''
        ? { sort: filterValues.value.sort }
        : {}),

      attrs: filterValues.value.attrs,

      ...(isFilterPrice ? { price: filterValues.value.price } : {}),

      ...(filterValues.value.promotion ? { promotion: 1 } : {}),

      brands: filterValues.value.brands,
    },
  });

  isVisible.value = false;
  emit('onFilterClick');
};

const handleChange = (items: any) => {
  startFilter();
};
</script>

<template>
  <div v-if="filterAttributes" class="grid grid-cols-10 gap-3">
    <div class="col-span-2">
      <ListingProductsFilterItemsSearch
        v-model="filterValues.sort"
        :items="sortOptions"
        :title="$t('label.sort_by')"
        @change="handleChange"
        :search="false"
        :multiple="false"
      />
    </div>
    <div class="col-span-2" v-if="filterAttributes?.FilterBrand">
      <ListingProductsFilterItemsSearch
        v-model="filterValues.brands"
        :items="
          filterAttributes.FilterBrand.map((b) => ({
            value: b.IdBrand,
            label: b.Name,
          }))
        "
        :title="t('label.brands')"
        @change="handleChange"
      />
    </div>
    <div class="col-span-2" v-if="filterAttrsSizes?.Attribute?.length">
      <ListingProductsFilterItemsSearch
        v-model="filterValues.attrs"
        :items="getOptions(filterAttrsSizes.Attribute)"
        :title="t('label.sizes')"
        @change="handleChange"
      />
    </div>

    <div class="col-span-2" v-if="filterAttrsColors?.Attribute?.length">
      <ListingProductsFilterItemsSearch
        v-model="filterValues.attrs"
        :items="getOptions(filterAttrsColors.Attribute)"
        :title="t('label.colors')"
        @change="handleChange"
      />
    </div>

    <!-- <div class="col-span-4">
      <div class="px-3 mb-10">
        <InputCheckBox
          id="filterPromotion"
          v-model="filterValues.promotion"
          switch
        >
          <span class="uppercase">
            {{ $t('label.promotion') }}
          </span>
        </InputCheckBox>
      </div>
      <div class="px-5">
        <InputRange
          v-if="filterAttributes?.FilterPrice"
          class="mt-5"
          v-model="filterValues.price"
          :format="{ suffix: currencySign, decimals: 2 }"
          :tooltips="true"
          :min="filterAttributes.FilterPrice.RegularPrice?.MinPriceTaxIncl"
          :max="filterAttributes.FilterPrice.RegularPrice?.MaxPriceTaxIncl"
        />
      </div>
    </div> -->
  </div>
</template>
<style lang="scss">
.attrGroup {
  @apply grid grid-cols-12 gap-3;

  .inputCheckbox {
    @apply col-span-4;
  }
}
</style>
