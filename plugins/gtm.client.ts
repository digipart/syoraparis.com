// GTM client-side plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gtmId = config.public.gtmId;

  if (!gtmId) {
    console.warn('GTM ID is not defined in environment variables. GTM will not be initialized.');
    return;
  }

  // Add dataLayer initialization
  window.dataLayer = window.dataLayer || [];
  
  // Push initial page view event
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: window.location.pathname,
      page_title: document.title
    });
  }

  // Track route changes for SPA navigation
  const router = useRouter();
  router.afterEach((to) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: to.fullPath,
        page_title: document.title
      });
    }
  });
});
