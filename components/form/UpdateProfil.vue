<script setup lang="ts">
const formValidate = useFormValidateStore();
const { state, v$, fields } = toRefs(formValidate);
fields.value = ['firstname', 'lastname', 'birthdate'];

const router = useRouter();
const route = useRoute();

const auth = useAuth();
const { customer } = toRefs(auth);
const { updateProfil } = auth;

const loading = ref(false);
state.value.firstname = customer.value?.Firstname || '';
state.value.lastname = customer.value?.Lastname || '';
state.value.birthdate = customer.value?.Birthday || '';

const emit = defineEmits(['onSuccess', 'cancelClick']);

const submitForm = async () => {
  const isFormCorrect = await v$.value.$validate();

  if (isFormCorrect) {
    loading.value = true;


    updateProfil({
      Firstname: state.value.firstname,
      Lastname: state.value.lastname,
      Birthday: state.value.birthdate,
    })
      .then((data) => {
        emit('onSuccess');
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        loading.value = false;
      });
  } else {
  }
};
</script>

<template>
  <div class="formProfil">
    <div class="formProfil-form">
      <form @submit.prevent="submitForm">
        <div class="w-full mb-16 md:mb-5">
          <BaseHeadLine name="h1" size="sm" class="uppercase font-normal mb-5">
            {{ $t('titles.my_informations') }}
          </BaseHeadLine>
          <div class="grid grid-cols-12 gap-x-5">
            <div class="col-span-6">
              <InputText
                id="firstname"
                v-model="state.firstname"
                type="text"
                :errors="v$.firstname?.$errors"
                :label="$t('label.firstname')"
                :required="v$.firstname?.required !== undefined"
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="lastname"
                v-model="state.lastname"
                type="text"
                :errors="v$.lastname?.$errors"
                :label="$t('label.lastname')"
                :required="v$.lastname?.required !== undefined"
              />
            </div>
            <div class="col-span-6">
              <InputText
                id="birthdate"
                v-model="state.birthdate"
                type="date"
                :errors="v$.birthdate?.$errors"
                :label="$t('label.birthdate')"
              />
            </div>
          </div>
        </div>
        <div class="formProfil-cta flex gap-3">
          <BaseButton
            type="primary"
            class="w-full"
            size="medium"
            @click="emit('cancelClick', $event)"
            plain
          >
            {{ $t('button.cancel') }}
          </BaseButton>
          <BaseButton
            type="primary"
            class="w-full"
            v-loading="loading"
            submit
            size="medium"
          >
            {{ $t('button.save') }}
          </BaseButton>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss">
$formProfil: '.formProfil';

#{$formProfil} {
  @apply flex items-center pb-[54px] relative;

  &-form {
    @apply flex  w-full flex-col;

    @screen md {
      // @apply border border-black py-10;
    }
  }
  &-cta {
    // @apply absolute bottom-0 w-full;
    // @screen md {
    //   @apply static px-10;
    // }
    // button {
    //   @apply h-[54px];
    // }
  }
}
</style>
