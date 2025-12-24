<script setup lang="ts">
const formSearchStore = useFormSearchStore();
const { state, v$ } = toRefs(formSearchStore);

const emit = defineEmits(['onSubmit']);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    emit('onSubmit', state.value.search);
  }
};
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="bg-slate-300 relative">
      <InputText
        id="searchBoxInput"
        v-model="state.search"
        border
        :errors="v$.search?.$errors"
        :placeholder="$t('label.search')"
        :required="v$.search?.required !== undefined"
      >
        <template #icon>
          <IconSearch color="#888888" />
        </template>
      </InputText>
      <div class="absolute right-2.5 top-2.5">
        <BaseButton
          type="primary"
          size="small"
          submit
          :title="$t('button.search')"
        >
          {{ $t('button.search') }}
        </BaseButton>
      </div>
    </div>
  </form>
</template>

<style lang="scss">
input {
  &#searchBoxInput {
    padding-right: 7.5rem;
    @apply py-3.5;
  }
}
</style>
