<template>
  <div class="">
    <div
      v-if="addressDelivery"
      class="text-xs text-gray-888 flex gap-3 justify-between items-end"
    >
      <div class="flex-1">
        <span>
          {{ addressDelivery?.Address1 }} <br />
          {{ addressDelivery?.Postcode }}
        </span>
        <span>, {{ addressDelivery?.Country }} </span>
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
          v-if="addressDelivery"
          :address="addressDelivery"
          @cancel="isEditing = !isEditing"
          @onAddressCreated="$emit('onAddressSubmited')"
          @onAddressEdited="$emit('onAddressSubmited')"
        />
      </div>
    </transition>

    <div v-if="carrier && !hideShipping">
      <div class="text-xs font-normal uppercase mb-1">{{ carrier.Name }}</div>
      <div class="text-xs text-gray-888 flex justify-between items-end">
        <div>
          {{ carrier.Price?.TaxIncl }} Shipping <br />
          ## Arrives by Fri, Aug 9
        </div>
        <NuxtLink
          :to="
            localePath({
              name: 'checkout',
              query: {
                step: 2,
              },
            })
          "
        >
          <span class="underline">{{ $t('button.modify') }}</span>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { hideShipping } = defineProps({
  hideShipping: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();

const addressStore = useAddressStore();
const { addressDelivery } = toRefs(addressStore);

const cartStore = useCartStore();
const { carrier } = toRefs(cartStore);

const router = useRouter();
const localePath = useLocalePath();

const isEditing = ref(false);
</script>

<style scoped></style>
