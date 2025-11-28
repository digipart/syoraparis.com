<script setup lang="ts">
import { copyTextClipBoard } from '@/utils/document';

definePageMeta({
  middleware: ['referral'],
});
const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.refer_friend.title'),
  description: () => t('pages.refer_friend.description'),
}));

const facebookSharIsLoaded = ref(false);
const loadedFacebook = () => {
  try {
    if (FB) {
      FB.init({
        appId: '1250419325746258',
        version: 'v10.0',
      });
    }
  } catch (error) {}
};

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const referralStore = useReferralStore();
const { fetchSponsorCode } = referralStore;
const { sponsorCode } = toRefs(referralStore);

const loading = ref(false);
const auth = useAuth();
const { isLoggedIn } = toRefs(auth);

const { MyNotification } = useNotification();
const { locale } = useI18n();
const config = useRuntimeConfig();
const route = useRoute();

const linkToShare = computed(() => {
  return `${config.public.url}${route.fullPath}/${sponsorCode.value?.Link}`;
});

const copyLien = () => {
  if (linkToShare.value) {
    copyTextClipBoard(linkToShare.value);
    MyNotification({
      title: t('label.copied'),
      message: h('span', linkToShare.value),
    });
  }
};

const step = ref<'start' | 'connexion' | 'share'>('start');
const goToShare = () => {
  loading.value = true;
  fetchSponsorCode()
    .then(() => {
      step.value = 'share';
    })
    .finally(() => {
      loading.value = false;
    });
};
const nextStep = () => {
  if (step.value === 'start') {
    if (isLoggedIn.value) {
      goToShare();
    } else {
      step.value = 'connexion';
    }
  }
};

const shareInFacebook = () => {
  FB.ui(
    {
      method: 'share',
      href: linkToShare.value,
      quote: t('refer_form_step_facebook_title'),
      hashtag: t('refer_form_step_facebook_title'),
      picture: `${config.public.url}/assets/images/refer2.jpg`,
    },
    function (response: any) {}
  );
};

useHead(() => ({
  script: [
    {
      src: 'https://connect.facebook.net/en_US/sdk.js',
      // async: true,
      callback: () => {
        facebookSharIsLoaded.value = true;
        loadedFacebook();
      },
    },
  ],
}));
</script>

<template>
  <div class="pageRefer">
    <LayoutContainer>
      <div class="mt-16 mb-16">
        <div class="max-w-screen-md mx-auto">
          <BaseHeadLine
            class="text-center font-normal mb-10"
            tag="h1"
            size="_2xl"
          >
            {{ $t('referral.headline') }}
          </BaseHeadLine>
        </div>

        <div
          v-if="step === 'start'"
          class="border border-black py-8 px-5 max-w-screen-md mx-auto"
        >
          <ol class="list-decimal text-base mb-5 pl-5">
            <li class="mb-3">{{ $t('referral.steps[0]') }}</li>
            <li class="mb-3">{{ $t('referral.steps[1]') }}</li>
            <li class="mb-3">{{ $t('referral.steps[2]') }}</li>
          </ol>
          <BaseButton
            type="primary"
            size="medium"
            class="w-full"
            v-loading="loading"
            @click="nextStep()"
            :title="
              !isLoggedIn
                ? $t('referral.button.start')
                : $t('referral.button.logged_start')
            "
          >
            {{
              !isLoggedIn
                ? $t('referral.button.start')
                : $t('referral.button.logged_start')
            }}
          </BaseButton>

          <div class="mt-3">
            <small class="underline">{{ $t('referral.howItWorks') }}</small>
          </div>
        </div>
        <div
          v-if="step === 'connexion' && !auth.isLoggedIn"
          class="grid grid-cols-12 gap-5"
        >
          <div class="col-span-6">
            <FormLogin :onSuccess="goToShare" />
          </div>
          <div class="col-span-6">
            <FormRegister :showSocialMedia="false" :onSuccess="goToShare" />
          </div>
        </div>
        <div
          v-if="step === 'share'"
          class="border border-black py-8 px-5 max-w-screen-md mx-auto"
        >
          <BaseHeadLine class="text-center uppercase">
            {{ $t('referral.shareHeadline') }}
          </BaseHeadLine>
          <div @click="copyLien" class="bg-yellow-50 my-5 py-3 px-5 gap-5 flex">
            <div class="flex-1">
              {{ linkToShare }}
            </div>
            <span class="cursor-pointer"> <IconCopy /> </span>
          </div>

          <div>
            <ul class="flex flex-col lg:flex-row gap-3">
              <li>
                <a
                  :href="`https://wa.me/?text=${$t('referral.textToShare', {
                    shopname: shopName,
                    link: linkToShare,
                  })}`"
                  target="_blank"
                >
                  <BaseButton
                    type="primary"
                    size="small"
                    plain
                    class="w-full"
                    :title="$t('referral.button.whatsapp')"
                  >
                    <template #iconLeft>
                      <IconWhatsapp class="text-base" />
                    </template>
                    {{ $t('referral.button.whatsapp') }}
                  </BaseButton>
                </a>
              </li>
              <li>
                <a
                  :href="`mailto:?${$t('referral.emaiToShare', {
                    shopname: shopName,
                    link: linkToShare,
                  })}`"
                >
                  <BaseButton
                    type="primary"
                    size="small"
                    plain
                    class="w-full"
                    :title="$t('referral.button.email')"
                  >
                    <template #iconLeft>
                      <IconMail class="text-base" />
                    </template>
                    {{ $t('referral.button.email') }}
                  </BaseButton>
                </a>
              </li>
              <li v-if="facebookSharIsLoaded">
                <BaseButton
                  type="primary"
                  size="small"
                  plain
                  class="w-full"
                  :title="$t('referral.button.facebook')"
                  @click="shareInFacebook"
                >
                  <template #iconLeft>
                    <IconFacebook class="text-base" />
                  </template>
                  {{ $t('referral.button.facebook') }}
                </BaseButton>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </LayoutContainer>
  </div>
</template>

<style lang="scss">
$pageRefer: '.pageRefer';

#{$pageRefer} {
}
</style>
