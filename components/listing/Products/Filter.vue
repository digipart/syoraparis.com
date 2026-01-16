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

// Create separate arrays for size and color attributes to avoid conflicts
const sizeAttrs = ref<string[]>([]);
const colorAttrs = ref<string[]>([]);

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
    return { id: item.IdAttribute || '0', label: item.AttributeName || '' };
  });
};

// Ensure price values are properly initialized
const ensurePriceValues = () => {
  if (!filterValues.value.price || !Array.isArray(filterValues.value.price) || filterValues.value.price.length !== 2) {
    if (filterAttributes.value?.FilterPrice?.RegularPrice) {
      filterValues.value.price = [
        filterAttributes.value.FilterPrice.RegularPrice.MinPriceTaxIncl || 0,
        filterAttributes.value.FilterPrice.RegularPrice.MaxPriceTaxIncl || 1000
      ];
    } else {
      filterValues.value.price = [0, 1000];
    }
  }
};

// Initialize size attributes from URL if present
const initSizeFromUrl = () => {
  const sizeQuery = route.query.sizes;
  if (sizeQuery) {
    const sizeValues = Array.isArray(sizeQuery) 
      ? sizeQuery.map(val => String(val)) 
      : [String(sizeQuery)];
      
    // Update sizeAttrs with values from URL
    sizeAttrs.value = sizeValues;
  }
};

// Call this when component is mounted
onMounted(() => {
  ensurePriceValues();
  initSizeFromUrl();
});

// Also watch for changes in filterAttributes
watch(() => filterAttributes.value, () => {
  ensurePriceValues();
}, { deep: true });

// Watch for route changes to update size values
watch(() => route.query, () => {
  initSizeFromUrl();
}, { deep: true });

const startFilter = () => {
  const isFilterPrice =
    filterValues.value.price[0] !==
      filterAttributes.value?.FilterPrice?.RegularPrice?.MinPriceTaxIncl ||
    filterValues.value.price[1] !==
      filterAttributes.value?.FilterPrice?.RegularPrice?.MaxPriceTaxIncl;
      
  // Get size attribute IDs from the filterAttrsSizes
  const sizeAttributeIds = filterAttrsSizes.value?.Attribute?.map(attr => attr.IdAttribute || '0') || [];
  
  // Filter out size attributes from the main attrs array
  const sizeValues = sizeAttrs.value.length > 0 ? sizeAttrs.value : [];
  
  // Filter out color attributes and other attributes that are not sizes
  const otherAttrs = filterValues.value.attrs.filter(attr => !sizeAttributeIds.includes(attr));

  router.replace({
    query: {
      ...(filterValues.value.sort !== ''
        ? { sort: filterValues.value.sort }
        : {}),

      // Include other attributes that are not sizes
      ...(otherAttrs.length > 0 ? { attrs: otherAttrs } : {}),
      
      // Include sizes as a separate parameter
      ...(sizeValues.length > 0 ? { sizes: sizeValues } : {}),

      ...(isFilterPrice ? { price: filterValues.value.price } : {}),

      ...(filterValues.value.promotion ? { promotion: 1 } : {}),

      brands: filterValues.value.brands,
    },
  });

  isVisible.value = false;
  emit('onFilterClick');
};

const resetFilter = () => {
  // Reset all filter values to their defaults
  filterValues.value.sort = '';
  filterValues.value.attrs = [];
  filterValues.value.brands = [];
  filterValues.value.promotion = false;
  
  // Also reset the separate attribute arrays
  sizeAttrs.value = [];
  colorAttrs.value = [];
  
  if (filterAttributes.value?.FilterPrice) {
    filterValues.value.price = [
      filterAttributes.value.FilterPrice.RegularPrice?.MinPriceTaxIncl || 0,
      filterAttributes.value.FilterPrice.RegularPrice?.MaxPriceTaxIncl || 1000
    ];
  }
  
  // Clear URL query parameters - explicitly remove sizes parameter
  router.replace({ 
    query: {} 
  });
  
  // Trigger filter update
  emit('onFilterClick');
  isVisible.value = false;
};
</script>

<template>
  <div>
    <span
      class="lg:text-sm flex items-center gap-1 cursor-pointer"
      @click="isVisible = true"
    >
      <IconFilter :size="1.4" />
      <span class="text-xxs lg:text-sm">{{ $t('button.filter') }} </span>
    </span>
    <BaseDrawer v-model="isVisible" size="100%" maxSize="600px" position="left">
      <template #header>
        <BaseHeadLine class="uppercase font-normal">
          {{ $t('titles.filter_and_sort') }}
        </BaseHeadLine>
      </template>
      <div v-if="filterAttributes">
        <BaseCollapsible>
          <BaseCollapsibleItem :index="0" :closeOthers="false">
            <template #header>
              <div class="flex justify-between w-full items-center">
                {{ $t('label.sort_by') }}
              </div>
            </template>
            <template #content>
              <div class="flex flex-wrap p-5 gap-3">
                <div v-for="sortOption in sortOptions">
                  <InputRadio
                    :id="`rp-${sortOption.value}`"
                    :value="sortOption.value"
                    v-model="filterValues.sort"
                    class="border border-black px-2 py-2"
                  >
                    {{ sortOption.label }}
                  </InputRadio>
                </div>
              </div>
            </template>
          </BaseCollapsibleItem>

          <BaseCollapsibleItem
            v-if="filterAttributes?.FilterBrand"
            :index="4"
            :closeOthers="false"
          >
            <template #header>
              <div class="flex justify-between w-full items-center">
                {{ $t('label.brands') }}
              </div>
            </template>
            <template #content>
              <div class="p-5">
                <div class="attrGroup">
                  <InputCheckBox
                    v-for="brand in filterAttributes?.FilterBrand"
                    name="filterAttrs"
                    :id="`brand-${brand.IdBrand}`"
                    v-model="filterValues.brands"
                    :value="String(brand.IdBrand)"
                    group
                  >
                    {{ brand.Name }}
                  </InputCheckBox>
                </div>
              </div>
            </template>
          </BaseCollapsibleItem>
          <BaseCollapsibleItem
            v-if="filterAttrsSizes?.Attribute?.length"
            :index="1"
            :closeOthers="false"
          >
            <template #header>
              <div class="flex justify-between w-full items-center">
                {{ filterAttrsSizes.AttributeGroupName }}
              </div>
            </template>
            <template #content>
              <div class="p-5">
                <div class="attrGroup">
                  <InputCheckBox
                    v-for="att in getOptions(filterAttrsSizes.Attribute)"
                    name="filterAttrs"
                    :id="`att-${att.id}`"
                    v-model="sizeAttrs"
                    :value="att.id"
                    group
                  >
                    {{ att.label }}
                  </InputCheckBox>
                </div>
              </div>
            </template>
          </BaseCollapsibleItem>

          <BaseCollapsibleItem
            v-if="filterAttrsColors?.Attribute?.length"
            :index="2"
            :closeOthers="false"
          >
            <template #header>
              <div class="flex justify-between w-full items-center">
                {{ filterAttrsColors.AttributeGroupName }}
              </div>
            </template>
            <template #content>
              <div class="p-5">
                <div class="attrGroup">
                  <InputCheckBox
                    v-for="att in getOptions(filterAttrsColors.Attribute)"
                    name="filterAttrs"
                    :id="`att-${att.id}`"
                    v-model="colorAttrs"
                    :value="att.id"
                    group
                  >
                    {{ att.label }}
                  </InputCheckBox>
                </div>
              </div>
            </template>
          </BaseCollapsibleItem>

          <BaseCollapsibleItem :index="3" :closeOthers="false">
            <template #header>
              <div class="flex justify-between w-full items-center">
                {{ $t('label.prices') }}
              </div>
            </template>
            <template #content>
              <div class="p-5">
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
                    :min="
                      filterAttributes.FilterPrice.RegularPrice?.MinPriceTaxIncl
                    "
                    :max="
                      filterAttributes.FilterPrice.RegularPrice?.MaxPriceTaxIncl
                    "
                  />
                </div>
              </div>
            </template>
          </BaseCollapsibleItem>
        </BaseCollapsible>

        <div class="mt-5">
          <BaseButton
            type="primary"
            class="w-full"
            @click="startFilter()"
            :title="$t('button.show_result')"
          >
            {{ $t('button.show_result') }}
          </BaseButton>
        </div>
        <div class="mt-3">
          <BaseButton
            type="primary"
            plain
            class="w-full"
            @click="resetFilter()"
          >
            {{ $t('button.reset') }}
          </BaseButton>
        </div>
      </div>
    </BaseDrawer>
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
