<template>
  <div class="">
    <div
      v-if="addressInvoice"
      class="text-xs text-gray-888 flex gap-3 justify-between items-end"
    >
      <div class="flex-1">
        <span>
          {{ addressInvoice?.Address1 }} <br />
          {{ addressInvoice?.Postcode }}
        </span>
        <span>, {{ addressInvoice?.Country }} </span>
        <br />
        <span
          class="underline cursor-pointer text-black mt-1 inline-block"
          @click="isEditing = !isEditing"
        >
          {{ t('button.modify') }}
        </span>
      </div>
    </div>
    <transition name="slide">
      <div
        v-show="isEditing"
        ref="addressFormAdd"
        class="border border-black p-5 mt-3"
      >
        <FormAddress
          v-if="addressInvoice"
          :address="addressInvoice"
          @cancel="isEditing = !isEditing"
        />
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const addressStore = useAddressStore();
const { addressInvoice } = toRefs(addressStore);

const isEditing = ref(false);
</script>

<style scoped></style>
