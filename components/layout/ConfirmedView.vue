<script setup lang="ts">
const { loading = false } = defineProps<{ loading?: boolean }>();

const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const auth = useAuth();
const { customer } = toRefs(auth);

const localePath = useLocalePath();

const config = useRuntimeConfig();
</script>

<template>
  <div v-if="!loading" class="confirmedView">
    <div class="confirmedView-container">
      <div class="confirmedView-wrapper">
        <div class="confirmedView-img">
          <BaseLogo is-svg />
        </div>

        <div
          class="confirmedView-body text-xs lg:text-xl font-light"
          v-html="
            $t('order.order_thanks', {
              name: customer?.Firstname,
              mail: config.public.shopEmail,
              tel: config.public.shopPhone,
              tel_text: config.public.shopPhone,
              order_link: localePath({ name: 'account-orders' }),
              shopname: shopName,
            })
          "
        ></div>

        <div
          class="confirmedView-footer mt-5 flex justify-center flex-col md:flex-row gap-3"
        >
          <NuxtLink :to="localePath('/content/faq')" class="w-full md:w-auto">
            <BaseButton
              type="primary"
              plain
              class="w-full text-xs lg:text-base"
              :title="$t('button.question_about_your_order')"
            >
              {{ $t('button.question_about_your_order') }}
            </BaseButton>
          </NuxtLink>
          <NuxtLink
            :to="localePath({ name: 'account-orders' })"
            class="w-full md:w-auto"
          >
            <BaseButton
              type="primary"
              plain
              class="w-full text-xs lg:text-base"
              :title="$t('button.details_my_order')"
            >
              {{ $t('button.details_my_order') }}
            </BaseButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.confirmedView {
  @apply py-8 lg:py-16 px-0 lg:px-8 text-center;

  h1 {
    @apply text-2xl text-start;
  }
  h2 {
    @apply text-2xl lg:text-3xl mb-8 lg:mb-12;
  }

  &-body {
    a {
      @apply underline;
    }
    p {
      @apply mb-4;
    }
  }

  &-wrapper {
    @apply bg-white  py-4 lg:py-16 px-0 lg:px-8;
  }
  &-container {
    @apply max-w-[1024px] mx-auto;
  }
  &-img {
    @apply flex items-center justify-center mb-8;
    img {
      @apply w-auto h-12;
      @screen mdMax {
        @apply h-8;
      }
    }
  }
  &-footer {
    @apply mt-10;
  }
}
</style>
