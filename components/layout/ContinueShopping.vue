<template>
  <LayoutContainer class="flex justify-center">
    <div class="flex flex-col justify-center items-center">
      <BaseHeadLine class="text-center mb-4" size="_3xl">
        {{ $t('label.cart_is_empty') }}
      </BaseHeadLine>
      <NuxtLink :to="localePath({ name: 'index' })">
        <BaseButton type="primary" plain>
          {{ $t('label.continue_shopping') }}
        </BaseButton>
      </NuxtLink>
    </div>
  </LayoutContainer>
</template>

<script setup lang="ts">
const localePath = useLocalePath();
</script>

<style scoped></style>
