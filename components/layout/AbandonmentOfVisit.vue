<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, helpers } from '@vuelidate/validators';
import ShopService from '~/services/ShopService';
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();
const { shopName, languageIsoCode } = toRefs(appStore);
const auth = useAuth();
const { isLoggedIn } = toRefs(auth);
const cartStore = useCartStore();
const { cart } = toRefs(cartStore);

const { MyNotification } = useNotification();

const ABANDONMENT_Of_VISIT = useCookie('ABANDONMENT_Of_VISIT', {
  maxAge: 60 * 60 * 27 * 7,
  default() {
    return 1;
  },
});
const loading = ref(false);
const { t } = useI18n();
const state = reactive({
  email: '',
});

const rules = {
  email: {
    required: helpers.withMessage(t('error.email_required'), required),
    email: helpers.withMessage(t('error.email_valide'), email),
  },
};

const v$ = useVuelidate(rules, state);
const isVisible = ref(false);

const abandonmentOfVisit = computed(() => {
  return (
    cart.value?.Total?.Product?.Quantity &&
    Number(ABANDONMENT_Of_VISIT.value) === 1 &&
    !isLoggedIn.value
  );
});

const close = () => {
  ABANDONMENT_Of_VISIT.value = 0;
  state.email = '';
  v$.value.$reset();
};

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();
  if (isFormCorrect) {
    const shopService = new ShopService();
    if (cart.value.IdCart) {
      loading.value = true;
      shopService
        .abandonedOfVisit({
          Email: state.email,
          IdCart: cart.value.IdCart,
        })
        .then(() => {
          MyNotification({
            title: t('label.sent'),
            message: h('span', t('abandonment_of_visit.confirmation')),
          });
          close();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  }
};

const handleMouseLeave = (event: MouseEvent) => {
  if (abandonmentOfVisit.value) {
    isVisible.value = true;
  }
};

onMounted(() => {
  document.body.addEventListener('mouseleave', handleMouseLeave);
});

onUnmounted(() => {
  document.body.removeEventListener('mouseleave', handleMouseLeave);
});
</script>

<template>
  <BaseDrawer
    v-if="abandonmentOfVisit"
    v-model="isVisible"
    size="100%"
    maxSize="600px"
    position="right"
    class="abandonmentOfVisit-drawer"
    @onClose="close()"
  >
    <template #header>
      <BaseHeadLine class="uppercase font-normal">
        {{ $t('abandonment_of_visit.title') }}
      </BaseHeadLine>
    </template>
    <div>
      <div>
        <form @submit.prevent="submitForm" v-loading="loading">
          <BaseHeadLine tag="h3" class="mb-3" size="sm">
            {{ $t('abandonment_of_visit.stitle') }}
          </BaseHeadLine>
          <div>
            <InputText
              id="email"
              v-model="state.email"
              type="email"
              :errors="v$.email?.$errors"
              :label="$t('label.email')"
            />
          </div>
          <div class="mb-5">
            <BaseButton
              type="primary"
              size="small"
              submit
              :title="$t('button.send')"
              class="w-full"
              :disabled="loading"
            >
              {{ $t('button.send') }}
            </BaseButton>
          </div>
          <div
            class="bg-gray-bbb/10 text-xs p-3"
            v-html="$t('abandonment_of_visit.cgv', { shopname: shopName })"
          ></div>
        </form>

        <BaseHr />
        <div class="mt-5">
          <BaseHeadLine class="uppercase font-normal mb-3">
            {{ $t('cart.title') }}
          </BaseHeadLine>
          <ListingCartItems :editable="false" />
        </div>
      </div>
    </div>
  </BaseDrawer>
</template>

<style scoped></style>
