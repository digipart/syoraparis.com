<script setup lang="ts">
const isVisible = ref(false);
</script>

<template>
  <div>
    <span
      @click="isVisible = true"
      class="text-xs mb-0.5 underline cursor-pointer"
    >
      {{ $t('button.log_in_to_access_your_loyalty_benefits') }}
    </span>
    <BaseModal v-model="isVisible" size="600px" @onClose="isVisible = false">
      <FormLogin
        :goToRedirect="false"
        class="!pb-10 -m-5 !border-0"
        @onSuccess="isVisible = false"
      />
    </BaseModal>
  </div>
</template>

<style lang="scss" scoped></style>
