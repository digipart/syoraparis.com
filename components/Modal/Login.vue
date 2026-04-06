<script setup lang="ts">
const { labelKey, linkClass } = withDefaults(
  defineProps<{
    labelKey?: string;
    linkClass?: string;
  }>(),
  {
    labelKey: 'button.log_in_to_access_your_loyalty_benefits',
    linkClass:
      'text-xxs lg:text-xs mb-0.5 underline cursor-pointer leading-tight',
  }
);

const isVisible = ref(false);
</script>

<template>
  <div class="inline">
    <span @click="isVisible = true" :class="linkClass">
      {{ $t(labelKey) }}
    </span>
    <BaseModal v-model="isVisible" size="600px" @onClose="isVisible = false">
      <FormLogin
        :goToRedirect="false"
        class="!pb-0 -m-5 loginModal"
        @onSuccess="isVisible = false"
      />
    </BaseModal>
  </div>
</template>

<style lang="scss">
.loginModal {
  .formLogin-form {
    border: none !important;
    @apply py-5;
  }
}
</style>
