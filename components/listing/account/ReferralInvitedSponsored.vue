<script setup lang="ts">
const referralStore = useReferralStore();
const { sponsoreInvited } = toRefs(referralStore);
const { getSponsoreInvited } = referralStore;

const appStore = useAppStore();
const { currencySign } = toRefs(appStore);

const { MyNotification } = useNotification();
const { t } = useI18n();

const localePath = useLocalePath();

getSponsoreInvited();

const getState = (sponsor: any) => {
  if (sponsor?.State?.Label === 'pending') {
    return { value: 'pending', label: t('invitation sent') };
  }
  if (sponsor?.Promocode?.State?.Expired) {
    return { value: 'expired', label: t('guest registered') };
  }
  if (sponsor?.Promocode?.State?.Used) {
    return { value: 'used', label: t('guest registered') };
  } else {
    return { value: 'ready', label: t('guest registered') };
  }
};

const getReduction = (sponsor: any) => {
  const reduction = sponsor?.Promocode?.Reduction?.Value?.TaxIncl || 0;
  if (getState(sponsor).value === 'pending') {
    return `${reduction}${currencySign.value} ${t('waiting')}`;
  } else {
    return `${reduction}${currencySign.value} ${t('won')}`;
  }
};

const copyCode = (code: string) => {
  if (code) {
    copyTextClipBoard(code);
    MyNotification({
      title: t('label.copied'),
      message: h('span', t('messages.promocode_has_copied')),
    });
  }
};
</script>

<template>
  <div>
    <BaseHeadLine size="lg" class="uppercase font-normal mb-3">
      {{ $t('label.my_referrals') }}
    </BaseHeadLine>
    <div v-if="sponsoreInvited?.Sponsored?.length" class="referral-table">
      <ul
        v-for="sponsor in sponsoreInvited?.Sponsored"
        class="referral-table-row"
        :class="{
          'bg-yellow': getState(sponsor).value === 'ready',
          'bg-gray-eee': ['expired', 'used'].includes(getState(sponsor).value),
        }"
      >
        <li class="flex justify-between font-tenez items-center">
          <template
            v-if="['expired', 'used'].includes(getState(sponsor).value)"
          >
            <span
              class="flex justify-start w-full items-center uppercase text-sm text-[#7B7B7B]"
            >
              <span>
                {{ $t(getState(sponsor).value) }}
              </span>
              <IconInfo class="icon ml-2" />
            </span>
          </template>
          <template v-else-if="sponsor?.Promocode?.Code">
            {{ sponsor?.Promocode?.Code }}
            <span
              class="flex items-center uppercase text-sm cursor-pointer"
              @click="copyCode(sponsor?.Promocode?.Code)"
            >
              <span>
                {{ $t('button.copy') }}
              </span>
              <IconCopy class="icon ml-2" />
            </span>
          </template>
        </li>
        <li class="font-tenez text-base flex items-center">
          {{ sponsor?.Email }}
        </li>

        <li class="text-start lg:text-center text-sm">
          <span class="flex items-center justify-start xl:justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14.667"
              height="10.667"
              viewBox="0 0 14.667 10.667"
            >
              <path
                d="M8,.667c4.05,0,7.333,1.791,7.333,4V7.334c0,2.209-3.283,4-7.333,4-3.978,0-7.216-1.727-7.33-3.882l0-.118V4.667C.666,2.458,3.949.667,8,.667Zm0,8a10.091,10.091,0,0,1-6-1.7v.367C2,8.588,4.588,10,8,10c3.34,0,5.892-1.353,6-2.588l0-.079V6.967A10.1,10.1,0,0,1,8,8.667ZM8,2C4.588,2,2,3.412,2,4.667S4.588,7.334,8,7.334s6-1.412,6-2.667S11.411,2,8,2Z"
                transform="translate(-0.666 -0.667)"
              />
            </svg>
            <span class="ml-1">
              {{ getReduction(sponsor) }}
            </span>
          </span>
          <span class="text-xs font-light" v-if="sponsor?.Promocode?.EndDate">
            {{ $t('label.until') }} {{ sponsor?.Promocode?.EndDate }}
          </span>
        </li>
        <li
          class="text-start lg:text-center text-sm flex items-center justify-start xl:justify-center uppercase"
        >
          {{ getState(sponsor).label }}
        </li>
      </ul>
    </div>
    <div v-else>
      <NuxtLink
        :to="localePath({ name: 'refer-friend' })"
        class="underline text-sm"
      >
        {{ $t('link.refer_friend') }}
      </NuxtLink>
    </div>
  </div>
</template>

<style lang="scss">
.referral-table {
  @apply border border-gray-400;
  @screen mdMax {
    @apply border-0;
  }

  &-row {
    @apply flex w-full border-b border-gray-400;
    @screen mdMax {
      @apply flex-col border border-gray-400  mb-3;
    }
    &:last-child {
      @apply border-b-0;
      @screen mdMax {
        @apply border-b;
      }
    }

    li {
      @apply border-r border-r-gray-400 px-4 py-3;
      @screen mdMax {
        @apply border-0 border-b;
      }
      flex: 1 1 22.33%;
      min-width: 22.33%;
      &:nth-child(2) {
        flex: 1 1 33%;
        min-width: 33%;
        @screen mdMax {
          flex: auto;
          min-width: auto;
        }
      }
      @screen mdMax {
        flex: auto;
        min-width: auto;
      }
      // &:first-child {
      //   @apply border-r-0;
      // }
      &:last-child {
        @screen mdMax {
          @apply border-b-0;
        }
      }
    }
  }
}
</style>
