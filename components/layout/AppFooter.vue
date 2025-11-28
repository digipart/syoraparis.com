<script setup lang="ts">
const appStore = useAppStore();
const { shopName } = toRefs(appStore);

const menuStore = useMenuStore();
const { fetchFotter } = menuStore;
const { menuFooter } = toRefs(menuStore);

// const localePath = useLocalePath();
// const { t } = useI18n();
// const runtimeConfig = useRuntimeConfig();
function checkUrlOrReturn(inputUrl: string): boolean {
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.origin; // Get the base URL of the current browser location

    return currentUrl === inputUrl;
  }
  return false; // If running outside the browser, return the input URL
}

const getRelativePath = (url: string): string => {
  try {
    const urlObject = new URL(url);
    if (checkUrlOrReturn(urlObject.origin)) {
      return urlObject.pathname;
    } else {
      return url;
    }
  } catch (error) {
    return '/';
  }
};

try {
  await fetchFotter();
} catch (error) {}
</script>

<template>
  <footer class="border-black border-b border-t appFooter">
    <div class="grid grid-cols-12">
      <div
        class="col-span-12 md:col-span-8 md:border-r border-black order-2 md:order-1"
      >
        <div class="block md:hidden">
          <template v-for="(tabBar, index) in menuFooter?.TabBarDatas">
            <BaseCollapsible :index-active="[0]">
              <template v-for="(col, index2) in tabBar.MenuColumns">
                <BaseCollapsibleItem
                  v-for="(elem, linkIndex) in col.MenuGroupElements"
                  :key="index2"
                  :index="index2"
                  :closeOthers="true"
                  :hideArrow="true"
                >
                  <template #header>
                    <div class="flex justify-between w-full items-center">
                      <BaseHeadLine>
                        {{ elem.MenuGroupElementName }}
                      </BaseHeadLine>
                    </div>
                  </template>
                  <template #content>
                    <div class="p-5">
                      <ul>
                        <template
                          v-for="(grpElemt, linkIndex) in elem.MenuElements"
                          :key="linkIndex"
                        >
                          <li v-if="grpElemt.MenuElementURL">
                            <NuxtLink
                              :to="getRelativePath(grpElemt.MenuElementURL)"
                            >
                              {{ grpElemt.MenuElementName }}
                            </NuxtLink>
                          </li>
                        </template>
                      </ul>
                    </div>
                  </template>
                </BaseCollapsibleItem>
              </template>
            </BaseCollapsible>
          </template>
        </div>

        <div class="hidden md:block py-10 px-5">
          <template v-for="(tabBar, index) in menuFooter?.TabBarDatas">
            <div class="grid grid-cols-12 gap-y-20">
              <div
                class="col-span-6"
                v-for="(col, index2) in tabBar.MenuColumns"
                :key="index2"
              >
                <div v-for="(elem, linkIndex) in col.MenuGroupElements">
                  <BaseHeadLine class="font-medium mb-2">
                    {{ elem.MenuGroupElementName }}
                  </BaseHeadLine>
                  <ul>
                    <template
                      v-for="(grpElemt, linkIndex) in elem.MenuElements"
                      :key="linkIndex"
                    >
                      <li v-if="grpElemt.MenuElementURL">
                        <NuxtLink
                          :to="getRelativePath(grpElemt.MenuElementURL)"
                        >
                          {{ grpElemt.MenuElementName }}
                        </NuxtLink>
                      </li>
                    </template>
                  </ul>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div
          class="border-t border-black py-3 px-5 text-xs flex justify-between items-center gap-3"
        >
          <ButtonLanguage class="!text-xs" />
          <p>
            {{
              $t('copyright', {
                year: new Date().getFullYear(),
                shopname: shopName,
              })
            }}
          </p>
        </div>
      </div>
      <div
        class="col-span-12 md:col-span-4 pt-10 px-5 pb-10 order-1 md:order-2"
      >
        <BaseHeadLine class="font-medium mb-2">
          {{ $t('label.newsletter') }}
        </BaseHeadLine>
        <FormNewsLetter />
        <p class="text-xs font-light mt-2">
          {{ $t('account.newsletter.discription') }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss">
$appFooter: '.appFooter';
#{$appFooter} {
  .collap-item {
    @apply border-r-0 border-l-0;
  }
}
</style>
