<script setup lang="ts">
definePageMeta({
  guestOnly: true,
  middleware: ['referral'],
});

const { t } = useI18n();
useHead(() => ({
  title: () => t('pages.refer_friend.title'),
  description: () => t('pages.refer_friend.description'),
}));


import { useVuelidate } from '@vuelidate/core';
import { required, email, helpers } from '@vuelidate/validators';

const referralStore = useReferralStore();
const { getSponsoredPromoCode } = referralStore;
const { sponsoredPromoCode } = toRefs(referralStore);
const { MyNotification } = useNotification();

const route = useRoute();
const loading = ref(false);
const errors = ref<string>();

// const code = route.params.code as string;

const code = computed(() => {
  const codeParams = route.params.code as string;
  if (codeParams) {
    const codepromo = codeParams?.split('-');
    return codepromo[0];
  }
  return null;
});

const state = reactive({
  email: '',
  newsletter: false,
  referral: false,
});

const isTrue = helpers.withMessage(
  t('error.field_required'),
  (value) => !!value
);
const rules = {
  email: {
    required: helpers.withMessage(t('error.email_required'), required),
    email: helpers.withMessage(t('error.email_valide'), email),
  },
  referral: {
    isTrue,
  },
};
const v$ = useVuelidate(rules, state);

const copyCode = () => {
  const code = sponsoredPromoCode.value?.Promocode?.Code;

  if (code) {
    copyTextClipBoard(code);
    MyNotification({
      title: t('label.copied'),
      message: h('span', t('messages.promocode_has_copied')),
    });
  }
};

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    if (code.value) {
      loading.value = true;
      getSponsoredPromoCode({
        Email: state.email,
        Newsletter: state.newsletter,
        ReferralCode: code.value,
      })
        .catch((error) => {
          errors.value = error?.response._data?.message;
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};
</script>
<template>
  <div>
    <div class="pageRefer">
      <LayoutContainer>
        <div class="mt-16 mb-16">
          <div class="max-w-screen-md mx-auto">
            <BaseHeadLine
              class="text-center font-normal mb-10 uppercase"
              tag="h1"
              size="_2xl"
            >
              {{ $t('referral.inviteHeadline') }} <br />
              <small class="block font-light text-sm">
                {{ $t('referral.inviteDescription') }}
              </small>
            </BaseHeadLine>
          </div>
          <div class="border border-black py-8 px-5 max-w-screen-md mx-auto">
            <BaseHeadLine size="xl">
              <b> {{ $t('referral.benefitHeadline') }} </b>
              {{ $t('referral.benefitDescription') }}
            </BaseHeadLine>

            <div v-if="!sponsoredPromoCode">
              <form @submit.prevent="submitForm" v-loading="loading">
                <p class="mb-5 text-sm">
                  {{ $t('referral.formPrompt') }}
                </p>
                <div>
                  <InputText
                    id="email"
                    v-model="state.email"
                    type="email"
                    :errors="v$.email.$errors"
                    :label="$t('label.email')"
                  />
                </div>
                <div>
                  <InputCheckBox
                    id="referrel-newsletter"
                    v-model="state.referral"
                    class="mb-3"
                    :errors="v$.referral.$errors"
                  >
                    {{ $t('referral.checkboxReferral') }}
                    <a href="#" target="_blank" class="underline">
                      {{ $t('referral.learnMore') }}
                    </a>
                  </InputCheckBox>
                  <InputCheckBox
                    id="referrel-referral"
                    v-model="state.newsletter"
                  >
                    {{ $t('referral.checkboxNewsletter') }}
                  </InputCheckBox>
                </div>
                <div class="mt-5">
                  <BaseButton
                    type="primary"
                    class="w-full mb-3"
                    submit
                    size="medium"
                    :title="$t('referral.button.getDiscount')"
                    :disabled="loading"
                  >
                    {{ $t('referral.button.getDiscount') }}
                  </BaseButton>
                </div>
              </form>

              <BaseAlert v-if="errors" type="danger">
                {{ errors }}
              </BaseAlert>

              <div class="mt-5">
                <small class="underline">{{ $t('referral.howItWorks') }}</small>
              </div>
            </div>
            <div v-else>
              <div class="text-sm">
                {{
                  $t('referral.discountCodeDescription', {
                    date: '2024-12-06',
                  })
                }}
              </div>
              <div
                @click="copyCode"
                class="bg-yellow-50/50 p-5 py-3 border border-yellow-200 mt-5 flex justify-between cursor-pointer mb-5"
              >
                <span class="text-black/80 font-medium">
                  {{ sponsoredPromoCode?.Promocode?.Code }}
                </span>

                <span class="cursor-pointer"> <IconCopy /> </span>
              </div>

              <NuxtLink to="/">
                <BaseButton
                  type="primary"
                  class="w-full"
                  size="medium"
                  :title="$t('label.continue_shopping')"
                  :disabled="loading"
                >
                  {{ $t('label.continue_shopping') }}
                </BaseButton>
              </NuxtLink>
            </div>
          </div>
        </div>
      </LayoutContainer>
    </div>
  </div>
</template>

<style scoped></style>
