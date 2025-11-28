<template>
  <div class="mb-20">
    <LayoutContainer small>
      <div class="pt-10 mb-3">
        <BaseHeadLine size="xl" class="font-normal">
          Avez-vous besoin d'aide concernant ce article,
        </BaseHeadLine>
      </div>
      <div class="grid grid-cols-12 justify-center gap-5 mb-10">
        <div class="col-span-4">
          <CardTicketProduct :product="product" />
        </div>
        <div class="col-span-8">
          <BaseCollapsible :index-active="[]">
            <BaseCollapsibleItem
              v-for="(faq, index) in faqHighlight"
              :key="index"
              :index="index"
              :closeOthers="true"
              :hideArrow="false"
            >
              <template #header>
                {{ faq.question }}
              </template>
              <template #content>
                <div class="px-5 py-3">
                  <CmsRichText :data="faq.answer" />
                </div>
              </template>
            </BaseCollapsibleItem>
          </BaseCollapsible>
          <div class="mt-5">
            <NuxtLink to="#">
              <BaseButton type="primary" plain class="min-w-56">
                AVEZ-VOUS BESOIN DE NOUS CONTACTER ?
              </BaseButton>
            </NuxtLink>
          </div>
        </div>
      </div>
      <div>
        <BaseHeadLine size="md" class="font-normal uppercase mb-3">
          Questions fréquentes
        </BaseHeadLine>
        <CmsFaqListing />
      </div>
    </LayoutContainer>
  </div>
</template>

<script setup lang="ts">
import type { TicketProduct } from '~/types/TicketType';
const faqStore = useFaqStore();
const { faqHighlight, termToSearch } = toRefs(faqStore);

const route = useRoute();

const product: TicketProduct = {
  IdOrder: 'JMP-84478',
  DateAdd: '2024-10-23 04:26:20',
  Reference: 'MARTY1120-CAMEL',
  Title: [
    {
      Title: 'Manteau long \u00e0 capuche avec col ch\u00e2le',
      LanguageIsoCode: 'fr',
      LanguageName: 'Fran\u00e7ais',
      IdLang: 1,
    },
    {
      Title: 'Long hooded coat with shawl collar',
      LanguageIsoCode: 'en',
      LanguageName: 'English',
      IdLang: 2,
    },
    {
      Title: 'Langer Kapuzenmantel mit Schalkragen',
      LanguageIsoCode: 'de',
      LanguageName: 'Deutsch',
      IdLang: 3,
    },
  ],
  Color: 'Camel',
  Size: '8(54/56)',
  IdProductAttribute: 27666,
  ImagesUrl: {
    product_small: [
      {
        Url: 'https://cdn.digipart.fr/upload/p/6761/89121/manteau-long-a-capuche-avec-col-chale-6761-89121-product_small.webp',
        ImagePosition: 89121,
      },
      {
        Url: 'https://cdn.digipart.fr/upload/p/6761/89122/manteau-long-a-capuche-avec-col-chale-6761-89122-product_small.webp',
        ImagePosition: 89122,
      },
      {
        Url: 'https://cdn.digipart.fr/upload/p/6761/89123/manteau-long-a-capuche-avec-col-chale-6761-89123-product_small.webp',
        ImagePosition: 89123,
      },
      {
        Url: 'https://cdn.digipart.fr/upload/p/6761/89124/manteau-long-a-capuche-avec-col-chale-6761-89124-product_small.webp',
        ImagePosition: 89124,
      },
      {
        Url: 'https://cdn.digipart.fr/upload/p/6761/89125/manteau-long-a-capuche-avec-col-chale-6761-89125-product_small.webp',
        ImagePosition: 89125,
      },
    ],
  },
};
</script>

<style scoped></style>
