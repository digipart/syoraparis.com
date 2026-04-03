<script setup lang="ts">
import AuthService from '~/services/AuthService';

const formDeliveryStore = useFormDeliveryFastStore();
const { state, v$ } = toRefs(formDeliveryStore);

const checkoutStore = useCheckoutStore();
const { checkoutCustomer } = storeToRefs(checkoutStore);

const newsletter = ref(false);
const emailAlreadyExists = ref(false);
const emailCheckTimer = ref<ReturnType<typeof setTimeout> | null>(null);
const emailCheckRequestId = ref(0);

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const authService = new AuthService();

const checkEmailAvailability = async (email: string) => {
  const currentRequestId = ++emailCheckRequestId.value;

  try {
    await authService.emailIsAvailble(email);
    if (currentRequestId !== emailCheckRequestId.value) {
      return;
    }
    emailAlreadyExists.value = false;
  } catch (error: any) {
    if (currentRequestId !== emailCheckRequestId.value) {
      return;
    }

    const statusCode =
      error?.statusCode || error?.response?.status || error?.status;
    emailAlreadyExists.value = statusCode === 409;
  }
};

watch(
  () => state.value.email,
  (emailValue) => {
    if (emailCheckTimer.value) {
      clearTimeout(emailCheckTimer.value);
    }

    checkoutCustomer.value.deliveryAddress.email = emailValue;

    emailAlreadyExists.value = false;

    const email = (emailValue || '').trim();
    if (!email || !EMAIL_REGEX.test(email)) {
      return;
    }

    emailCheckTimer.value = setTimeout(() => {
      checkEmailAvailability(email);
    }, 500);
  }
);

onBeforeUnmount(() => {
  if (emailCheckTimer.value) {
    clearTimeout(emailCheckTimer.value);
  }
});
</script>

<template>
  <div>
    <div class="section-header">
      <h2 class="section-title font-semibold text-sm uppercase">
        {{ $t('label.enter_your_email') }} :
      </h2>
      <ModalLogin
        link-class="text-xs underline text-zinc-500 hover:text-black transition-colors"
      />
    </div>

    <InputText
      id="email"
      v-model="state.email"
      type="email"
      :errors="v$.email?.$errors"
      :required="true"
      :label="$t('label.email')"
      border
    />

    <div class="-mt-2">
      <InputCheckBox id="newsletter" v-model="newsletter">
        <span class="text-xs text-zinc-500">{{
          $t('pages.checkout.newsletter')
        }}</span>
      </InputCheckBox>
    </div>

    <div
      v-if="emailAlreadyExists"
      class="mt-2 text-xs text-zinc-700 leading-relaxed"
    >
      <span>{{ $t('pages.checkout.email_already_registered') }}</span>
      <ModalLogin
        label-key="button.sign_in"
        link-class="inline underline cursor-pointer text-sm text-black font-medium ml-1"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-header {
  @apply flex items-center justify-between mb-2;
}
</style>
