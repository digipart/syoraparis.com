// GTM client-side plugin
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const gtmId = config.public.gtmId;

  if (!gtmId) {
    console.warn(
      'GTM ID is not defined in environment variables. GTM will not be initialized.'
    );
    return;
  }

  // Inject GTM script
  if (process.client && gtmId) {
    (function (w: any, d: Document, s: string, l: string, i: string) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s) as HTMLScriptElement,
        dl = l != 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      if (f && f.parentNode) {
        f.parentNode.insertBefore(j, f);
      }
    })(window, document, 'script', 'dataLayer', gtmId);
  }

  // Add dataLayer initialization
  window.dataLayer = window.dataLayer || [];

  // Push initial page view event
  if (window.dataLayer) {
    window.dataLayer.push({
      event: 'page_view',
      page_path: window.location.pathname,
      page_title: document.title,
    });
  }

  // Track route changes for SPA navigation
  const router = useRouter();
  router.afterEach((to) => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: to.fullPath,
        page_title: document.title,
      });
    }
  });
});
