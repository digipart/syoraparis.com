// plugins/v-loading.ts
import { defineNuxtPlugin } from '#app';
import vLoading from '~/directives/v-loading';

export default defineNuxtPlugin(async (nuxtApp) => {
  nuxtApp.vueApp.directive('loading', vLoading);
});
