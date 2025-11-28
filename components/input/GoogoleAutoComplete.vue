<template>
  <div
    class="googleAutoComplete"
    :class="{
      'googleAutoComplete--focused': isFocused || modelValue,
      error: errors?.length,
      'googleAutoComplete--border': border,
      'googleAutoComplete--icon': $slots.icon,
      required: required,
    }"
  >
    <span class="googleAutoComplete--icon-icon" v-if="$slots.icon">
      <slot name="icon" />
    </span>
    <label v-if="label" :for="id" class="googleAutoComplete-label">
      {{ label }}
    </label>
    <input
      ref="autocompleteInput"
      :id="id"
      :type="type"
      :value="modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      :placeholder="!label ? placeholder : ''"
      :disabled="disabled"
    />
    <div class="googleAutoComplete-error" v-if="errors">
      <span v-for="error in errors" :key="error.$uid">
        {{ error.$message }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ErrorObject } from '@vuelidate/core';

const appStore = useAppStore();
const { countryIsoCode, languageIsoCode } = toRefs(appStore);

interface Props {
  id: string;
  modelValue: string;
  type?: 'text' | 'password' | 'email' | 'tel';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  errors?: ErrorObject[];
  border?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue', 'onSelect']);

const isFocused = ref(false);
const autocompleteInput = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const onFocus = () => {
  isFocused.value = true;
};

const onBlur = () => {
  isFocused.value = false;
};

// onMounted(() => {
//   if (autocompleteInput.value) {
//     const initAutocomplete = () => {
//       const options: google.maps.places.AutocompleteOptions = {
//         componentRestrictions: { country: countryIsoCode.value }, // Restrict to France
//         types: ['address'],
//       };

//       const autocomplete = new google.maps.places.Autocomplete(
//         autocompleteInput.value!,
//         options
//       );
//       autocomplete.addListener('place_changed', () => {
//         const place = autocomplete.getPlace();
//         const address = place.formatted_address || '';
//         const postalCode =
//           place.address_components?.find((ac) =>
//             ac.types.includes('postal_code')
//           )?.long_name || '';
//         const country =
//           place.address_components?.find((ac) => ac.types.includes('country'))
//             ?.long_name || '';
//         const city =
//           place.address_components?.find((ac) => ac.types.includes('locality'))
//             ?.long_name || '';
//         const countryIso =
//           place.address_components?.find((ac) => ac.types.includes('country'))
//             ?.short_name || '';

//         emit('update:modelValue', address);
//         emit('onSelect', {
//           address,
//           postalCode,
//           country,
//           city,
//           countryIso
//         });
//       });
//     };

//     if (typeof google !== 'undefined') {
//       initAutocomplete();
//     } else {
//       window.addEventListener('load', initAutocomplete);
//     }
//   }
// });

onMounted(() => {
  if (autocompleteInput.value) {
    const initAutocomplete = () => {
      const options: google.maps.places.AutocompleteOptions = {
        componentRestrictions: { country: countryIsoCode.value || '' }, // Restrict to specified country
        types: ['address'],
      };

      const autocomplete = new google.maps.places.Autocomplete(
        autocompleteInput.value!,
        options
      );

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();

        const address = place.formatted_address || '';
        const addressComponents = place.address_components || [];

        // Extract street number
        const streetNumber =
          addressComponents.find((ac) => ac.types.includes('street_number'))
            ?.long_name || '';

        // Extract route (street name)
        const route =
          addressComponents.find((ac) => ac.types.includes('route'))
            ?.long_name || '';

        // Extract postal code
        const postalCode =
          addressComponents.find((ac) => ac.types.includes('postal_code'))
            ?.long_name || '';

        // Extract country
        const country =
          addressComponents.find((ac) => ac.types.includes('country'))
            ?.long_name || '';

        // Extract city (locality)
        const city =
          addressComponents.find((ac) => ac.types.includes('locality'))
            ?.long_name || '';

        // Extract country ISO code
        const countryIso =
          addressComponents.find((ac) => ac.types.includes('country'))
            ?.short_name || '';

        // Extract latitude and longitude
        const latitude = place.geometry?.location?.lat() || null;
        const longitude = place.geometry?.location?.lng() || null;

        // Emit the full data, including street number, route, and coordinates
        emit('update:modelValue', address);
        emit('onSelect', {
          address,
          courtAddress: `${streetNumber}, ${route}`,
          streetNumber, // Include street number
          route, // Include route (street name)
          postalCode,
          country,
          city,
          countryIso,
          latitude, // Include latitude
          longitude, // Include longitude
        });
      });
    };

    if (typeof google !== 'undefined') {
      initAutocomplete();
    } else {
      window.addEventListener('load', initAutocomplete);
    }
  }
});
</script>

<style scoped lang="scss">
$googleAutoComplete: '.googleAutoComplete';

#{$googleAutoComplete} {
  @apply w-full relative mb-5 font-light uppercase;

  input {
    @apply border-b border-gray-bbb w-full text-xs pt-3 pb-1.5;

    &:focus {
      outline: none;
      @apply border-primary;
    }
  }

  &.error {
    input {
      @apply border-red-500;
    }
  }

  &-label {
    @apply absolute top-1/2 left-0 -translate-y-1/2 
      duration-200 ease-linear transition-all 
      pointer-events-none text-xs text-gray-777 font-light;
  }

  &--focused {
    #{$googleAutoComplete}-label,
    & input:not(:placeholder-shown) + #{$googleAutoComplete}-label {
      @apply top-0 text-xxs left-0 text-primary;
    }

    input {
      @apply border-primary;
    }
  }
  &--border {
    input {
      @apply border border-gray-888
      px-5 py-3 text-base;
    }
  }
  &--icon {
    input {
      @apply pl-10;
    }
    &-icon {
      @apply absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none;
    }
  }
  &-error {
    @apply absolute bottom-0 translate-y-full normal-case;
    span {
      @apply text-red-500 text-xxs flex flex-col;
    }
  }
  &.required {
    label::after {
      content: ' * ';
    }
  }
}
</style>
