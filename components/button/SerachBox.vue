<script setup lang="ts">
import type { ProductType } from '~/types/ProductType';

const appStore = useAppStore();
const { setLoadingPage } = appStore;

const router = useRouter();

const { iconColor } = defineProps({
  iconColor: {
    type: String,
    default: 'black',
  },
});

const categoryStore = useCategoryStore();
const { categories } = toRefs(categoryStore);

const searchStore = useSearchStore();
const { fetchSearch } = searchStore;

const localePath = useLocalePath();

const isVisible = ref(false);
const loading = ref(false);
const term = ref('');

const searchProducts = ref<ProductType[]>([]);

const search = async () => {
  fetchSearch({
    Term: term.value,
    Offset: 0,
    Limit: 20,
  })
    .then((data) => {
      searchProducts.value = data.Products || [];
    })
    .finally(() => {
      loading.value = false;
    });
};

let timerUpdateQuantity: any;
const handleChange = () => {
  clearTimeout(timerUpdateQuantity);
  timerUpdateQuantity = setTimeout(async () => {
    loading.value = true;

    search();
  }, 500);
};

const submitSearch = () => {
  isVisible.value = false;
  router.push(
    localePath({
      name: 'search',
      query: {
        term: term.value,
      },
    })
  );
};
</script>

<template>
  <div class="searchModal">
    <BaseButton
      icon
      :title="$t('button.search')"
      @click="isVisible = true"
      class="searchModal-btn"
    >
      <IconSearch :style="{ color: iconColor }" />
    </BaseButton>

    <BaseModal
      class="searchModal-Modal"
      v-model="isVisible"
      position="top"
      size="auto"
    >
      <div>
        <div class="mt-0 mx-auto">
          <!-- <div class="hidden lg:block text-center mb-5">
            <label for="searchBoxInput" class="text-3xl font-light uppercase">
              {{ $t('label.looking_for') }}
            </label>
          </div> -->
          <div class="searchModal-Modal-input">
            <form @submit.prevent="submitSearch">
              <InputText
                id="searchBoxInputModal"
                border
                :placeholder="$t('label.looking_for')"
                v-model="term"
                @input="handleChange"
              >
                <template #icon>
                  <IconSearch color="#888888" />
                </template>
              </InputText>
            </form>
          </div>
          <!-- <div class="hidden lg:flex flex-wrap gap-2 justify-center pb-5">
            <NuxtLink
              v-for="category in categories"
              :key="category.IdCategory"
              :to="localePath(`/${category.CategoryDescriptionFriendlyURL}`)"
            >
              <BaseButton
                type="primary"
                size="small"
                plain
                :title="category.CategoryName"
              >
                {{ category.CategoryName }}
              </BaseButton>
            </NuxtLink>
          </div> -->

          <div class="searchModal-products">
            <div
              v-if="loading"
              v-loading="loading"
              class="h-10 !absolute top-0 left-1/2"
            ></div>

            <div v-if="searchProducts.length">
              <div class="overflow-hidden mt-[-1px]">
                <ListingProductsList
                  :products="searchProducts"
                  border
                  class="overflow-hidden mx-[-1px]"
                />
              </div>

              <BaseButton type="primary" class="w-full" @click="submitSearch">
                {{ $t('button.see_all') }}
              </BaseButton>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style lang="scss">
$searchModal: '.searchModal';

#{$searchModal} {
  &-btn {
    @apply text-base font-thin pb-[5px] pt-[6px] px-1 cursor-pointer
    uppercase  flex items-center gap-1;
  }

  &-cta {
    @apply flex gap-5;
  }
  &-Modal {
    .modal-content {
      overflow: visible;
      // @apply p-0;
      // @screen mdMax {
      @apply p-0;
      // }
    }
    &-input {
      // width: calc(100% - 60px);
      @screen mdMax {
        @apply border-0;
      }
      .inputText {
        // @screen mdMax {
        @apply mb-0 h-14;
        // }
      }
      input {
        // @screen mdMax {
        @apply h-14 !border-black border-t-0 border-b !border-r-0 !border-l-0;
        // }
      }
    }
    .modal-closebtn {
      @apply top-0 right-0 h-14 w-14 border-l border-black;
    }
    .modal-body {
      // --tw-bg-opacity: 0.8;
      @apply border-0;
    }
  }
  &-products {
    @apply relative overflow-auto mt-[-1px] border-t border-black;
    // @screen mdMax {
    @apply pb-[0px];
    max-height: calc(100dvh - 3.5rem);
    // }
  }
}
</style>
