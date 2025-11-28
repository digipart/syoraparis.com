<template>
  <div class="mb-20">
    <LayoutContainer>
      <div class="pt-10 mb-3">
        <BaseHeadLine size="xl" class="font-normal">
          Avez-vous besoin d'aide concernant ce article,
        </BaseHeadLine>
      </div>
      <div class="grid grid-cols-12 justify-center gap-5 mb-10">
        <div class="col-span-6">
          <div
            v-if="openChat"
            class="formchat flex flex-col border border-black px-5 pb-5 pt-5"
          >
            <div class="flex-1 overflow-auto flex gap-y-5 mb-5">
              <div class="flex">
                <div class="w-full max-w-[90%] h-14 bg-[#fff9e9]"></div>
              </div>

              <div class="flex justify-end">
                <div class="w-full max-w-[90%] h-14 bg-[#f0f0f0]"></div>
              </div>
              <hr />
              <div class="flex">
                <div class="max-w-[160px]">
                  <NuxtImg
                    :src="product.ImagesUrl.product_small[0].Url"
                    class="w-full"
                  />
                </div>
                <div class="pl-3">
                  <span class="text-xs block mt-1">
                    {{ product.Title[0].Title }}
                  </span>
                  <span class="text-xs block mt-1"
                    >{{ product.Size }}, {{ product.Color }}</span
                  >
                </div>
              </div>
            </div>
            <div class="">
              <FormTicketMessage />
            </div>
          </div>
          <div v-else class="formMail border border-black p-5">
            <div>
              <div class="flex">
                <div class="max-w-[160px]">
                  <NuxtImg
                    :src="product.ImagesUrl.product_small[0].Url"
                    class="w-full"
                  />
                </div>
                <div class="pl-3">
                  <span class="text-xs block mt-1">
                    {{ product.Title[0].Title }}
                  </span>
                  <span class="text-xs block mt-1"
                    >{{ product.Size }}, {{ product.Color }}</span
                  >
                </div>
              </div>
              <hr class="my-3" />
              <BaseHeadLine class="font-normal">
                Saisissez votre message ci-dessous :
              </BaseHeadLine>
              <p class="text-sm mt-1">De : {{ customer?.Email }}</p>
              <InputText
                id="emailMessageService"
                v-model="emailMessage"
                type="textarea"
                placeholder="J'ai besoin d'aide pour ..."
                border
              />
              <div>
                <BaseButton type="primary" plain class="min-w-52">
                  {{ $t('button.send') }}
                </BaseButton>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-6">
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
            <BaseButton
              @click="openChat = !openChat"
              type="primary"
              plain
              class="min-w-56"
            >
              <span v-if="openChat">Envoyer un mail </span>
              <span v-else> Démarrer une conversation</span>
            </BaseButton>
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
const auth = useAuth();
const { customer } = toRefs(auth);

const route = useRoute();

const openChat = ref(true);

const emailMessage = ref('');
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

<style lang="scss">
.formchat {
  @apply h-[600px];
  & > div {
    @apply flex-col-reverse;
  }
}
</style>
