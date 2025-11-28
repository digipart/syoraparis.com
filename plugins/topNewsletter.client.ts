// plugins/pageVisits.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('page:finish', () => {
    const newsletterStore = useNewsletterPopUpStore();
    newsletterStore.incrementPageVisits();
  });
});
