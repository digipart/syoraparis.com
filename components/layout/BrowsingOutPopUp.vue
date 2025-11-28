<template>
  <BaseModal v-model="isVisible">
    <template #header>
      {{ $t('titles.welcome_to', { shopname: shopName }) }}
    </template>

    <div class="b_out-dialog">
      <div>
        <p
          v-html="$t('browsingOut.message', { country: 'United Kingdom' })"
        ></p>
      </div>
      <div>
        <ul>
          <li>
            <i><IconCheck :size="1.3" /></i>
            <div>
              {{ $t('browsingOut.prices') }}
              <span> {{ $t('browsingOut.noCustoms') }} </span>
            </div>
          </li>
          <li>
            <i><IconCheck :size="1.3" /></i>
            <div>
              {{ $t('browsingOut.freeShipping') }}
              <span> {{ $t('browsingOut.arrivalTime') }} </span>
            </div>
          </li>
          <li>
            <i><IconCheck :size="1.3" /></i>
            <div>{{ $t('browsingOut.freeReturns') }}</div>
          </li>
        </ul>
      </div>
      <div class="my-5">
        <ul class="payment-icons">
          <li>
            <img
              src="/assets/images/mastercard-logo.svg"
              alt="Mastercard"
              title="Mastercard"
            />
          </li>
          <li>
            <img src="/assets/images/visa-logo.svg" alt="Visa" title="Visa" />
          </li>
          <li>
            <img
              src="/assets/images/PayPal-logo.svg"
              alt="PayPal"
              title="PayPal"
            />
          </li>
          <li>
            <img
              src="/assets/images/klarna-logo.svg"
              alt="Klarna"
              title="Klarna"
            />
          </li>
          <li>
            <img
              src="/assets/images/google-pay.svg"
              alt="Google pay"
              title="Google pay"
            />
          </li>
          <li>
            <img
              src="/assets/images/apple-pay.svg"
              alt="Apple pay"
              title="Apple pay"
            />
          </li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <BaseButton size="small" @click="">
          {{ $t('browsingOut.changeCountry') }}
        </BaseButton>
        <BaseButton type="primary" size="small" @click="accept()">
          {{
            $t('button.continue', {
              shopname: shopName,
              terms_link: '/#',
            })
          }}
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
const browsingOutStore = useBrowsingOutPopUpStore();
const { acceptBrowsingOut } = browsingOutStore;
const { browsingOutVisible } = toRefs(browsingOutStore);

const appStore = useAppStore();
const { shopName } = toRefs(appStore);
const isVisible = ref(browsingOutVisible.value);

const accept = () => {
  isVisible.value = false;
  acceptBrowsingOut();
};
</script>

<style lang="scss">
.b_out-dialog {
  h2 {
    @apply text-3xl lg:text-[42px] uppercase mb-5;
  }
  p {
    @apply text-lg lg:text-[22px] mb-0 font-light;
    b {
      @apply block;
    }
  }
  .change-country {
    @apply underline cursor-pointer;
  }

  ul {
    @apply text-start font-light my-5;

    li {
      @apply text-sm lg:text-base mb-1 flex gap-x-1;
      i {
        @apply mt-[1px];
      }
      span {
        @apply block text-xs lg:text-sm;
      }
    }
  }
}
.payment-icons {
  @apply flex gap-1 flex-wrap items-start max-w-[328px];

  li {
    @apply border rounded-md p-[4px] w-[3rem] h-[2rem] mb-0;
    min-width: 3rem;

    img {
      @apply w-full h-full;
    }
  }
}
</style>
