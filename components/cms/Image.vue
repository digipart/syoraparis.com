<template>
  <div v-if="image?.desktop?.url">
    <NuxtImg
      v-if="image?.desktop"
      class="hidden lg:block w-full"
      :src="getImage(image?.desktop.url)"
    />
    <NuxtImg
      class="block lg:hidden w-full"
      :src="getImage(image?.mobile?.url || image?.desktop.url)"
    />
  </div>
</template>

<script setup lang="ts">
import type { CmsImageType } from '~/types/cms/CmsImageType';

const { image, alt } = defineProps<{
  image?: CmsImageType;
  alt?: string;
}>();
const config = useRuntimeConfig();

const getImage = (url: string) => {
  return config.public.strapiUrl + url;
};
</script>

<style scoped></style>
