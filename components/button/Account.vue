<script setup lang="ts">
const auth = useAuth();
const { isLoggedIn, isGuest, customer } = toRefs(auth);
const { t } = useI18n();

const localePath = useLocalePath();
const { iconColor, onlyIcon } = defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
  onlyIcon: {
    type: Boolean,
    default: false,
  },
  showTextOnTop: {
    type: Boolean,
    default: true,
  },
});

const text = computed(() => {
  if (isLoggedIn.value) {
    return customer.value?.Firstname + ' ' + customer.value?.Lastname;
  } else {
    return t('button.account');
  }
});

const textOnTop = computed(() => {
  return isLoggedIn.value && !isGuest.value ? ' ' : '';
});
const redirectTo = computed(() => {
  return isLoggedIn.value && !isGuest.value
    ? { name: 'account-profil' }
    : { name: 'account-login' };
});
</script>

<template>
  <NuxtLink :to="localePath(redirectTo)">
    <BaseButton
      :icon="onlyIcon"
      :textOnTop="showTextOnTop ? textOnTop : ''"
      :textOnTopColor="iconColor"
      :title="text"
    >
      <span class="flex items-center">
        <IconUser :style="{ color: iconColor }" />
        <span v-if="!onlyIcon" class="text-xs mt-1 ml-1"> {{ text }}</span>
      </span>
    </BaseButton>
  </NuxtLink>
</template>

<style lang="scss"></style>
