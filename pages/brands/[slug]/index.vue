<script setup lang="ts">
import type { BreadCrumbType } from '~/components/layout/BreadCrumb.vue';
import BrandService from '~/services/BrandService';
const brandStore = useBrandStore();
const { fetchBrand } = brandStore;
const { brand } = toRefs(brandStore);
const categoryStore = useCategoryStore();
const { fetchFilterAttrs } = categoryStore;

const { bannerDisplay } = defineProps({
  bannerDisplay: {
    type: String,
    default: 'col',
  },
});

const route = useRoute();
const localePath = useLocalePath();
const { t } = useI18n();

const brandSlug = route.params.slug as string;

const breadcrumbItems = computed(() => {
  const list: BreadCrumbType[] = [];

  list.push({
    link: localePath({ name: 'brands' }),
    text: t('label.brands'),
  });
  if (brand) {
    list.push({
      text: brand.value?.Name || '',
    });
  }
  return list;
});

try {
  if (brandSlug) {
    try {
      await fetchFilterAttrs({ brandFriendlyURL: brandSlug });
    } catch (error) {}
    fetchBrand(brandSlug);
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Invalid brand ID' });
  }
} catch (error) {
  if (error instanceof Error) {
    throw createError({ statusCode: 404, statusMessage: error.message });
  } else {
    throw createError({ statusCode: 404, statusMessage: 'Unknown error' });
  }
}

const isExpanded = ref(false);
const maxLength = 140; // Adjust the length as needed

const displayedText = computed(() => {
  if (brand.value) {
    if (isExpanded.value || brand.value.Description.length <= maxLength) {
      return brand.value.Description;
    }
    return brand.value.Description.substring(0, maxLength) + '...';
  }
  return '';
});

const toggleReadMore = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div v-if="brand">
    <div class="px-5 py-4 border-b border-black">
      <LayoutBreadCrumb :items="breadcrumbItems" />
    </div>
    <div class="grid grid-cols-12 border-black">
      <div class="col-span-12 border-black border-b relative aspect-[16/5]">
        <NuxtImg
          class="absolute bottom-0 left-0 w-full h-full object-cover"
          v-if="brand?.Cover?.Src"
          :src="brand.Cover.Src"
          :alt="brand.Name"
        />
        <div class="p-5 relative z-10 bg-black/10 h-full flex items-end">
          <BaseHeadLine name="h1" size="_3xl" class="font-normal text-white">
            {{ brand.Name }}
          </BaseHeadLine>
        </div>
      </div>

      <div class="col-span-12 flex flex-col justify-center p-5">
        <NuxtImg :src="brand.Logo.Src" :alt="brand.Name" class="w-20 mb-3" />
        <div class="text-sm">
          <div v-html="displayedText"></div>
          <span @click="toggleReadMore" class="text-xs underline">
            {{ isExpanded ? $t('button.read_less') : $t('button.read_more') }}
          </span>
        </div>
      </div>
    </div>
    <ListingProducts />
  </div>
</template>

<style lang="scss"></style>
