<script setup lang="ts">
const isVisisble = ref(false);
</script>

<template>
  <div>
    <span @click="isVisisble = true" class="cursor-pointer text-sm underline">
      {{ $t('label.contact_us') }}
    </span>

    <BaseModal v-model="isVisisble" size="692px" class="contactUs">
      <template #header>
        <span class="uppercase font-normal">
          {{ $t('label.contact_us') }}
        </span>
      </template>
      <div class="p-10">
        <FormContactUs />
      </div>
    </BaseModal>
  </div>
</template>
