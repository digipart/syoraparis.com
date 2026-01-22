// https://nuxt.com/docs/api/configuration/nuxt-config

import routesI18N from './i18n/routesI18N';

export default defineNuxtConfig({
  app: {
    keepalive: true, // Enable keep-alive globally
    // Or for more specific control:
    // keepalive: {
    //   max: 10 // maximum number of components to cache
    // }
  },
  runtimeConfig: {
    mollieApiKey: process.env.MOLLIE_API_KEY,
    public: {
      strapiUrl: process.env.STRAPI_URL,
      shopname: process.env.SHOP_NAME,
      domainName: process.env.DOMAIN_NAME,
      shopEmail: process.env.SHOP_EMAIL,
      shopPhone: process.env.SHOP_PHONE,
      shopLogoDark: process.env.SHOP_LOGO_DARK,
      shopLogoLight: process.env.SHOP_LOGO_LIGHT,
      shopMapIcon: process.env.SHOP_MAP_ICON,
      defaultLanguage: process.env.DEFAULT_LANGUAGE,
      url: process.env.URL,
      apiUrl: process.env.API_URL,
      googleMapKey: process.env.GOOGLE_MAP_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
      paypalClientID: process.env.PAYPAL_CLIENT_ID,
      payzenPublicKey: process.env.PAYZEN_PUBLIC_KEY,
      almaUrl: process.env.ALMA_URL,
      almaClientId: process.env.ALMA_CLIENT_ID,
      almaToken: process.env.ALMA_TOKEN,
      gtmId: process.env.GTM_ID,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
      mollieProfileId: process.env.MOLLIE_PROFILE_ID,
      mollieTestMode: process.env.MOLLIE_TEST_MODE,

      hasCountryOut: process.env.HAS_COUNTRY_OUT,
      lockUser: process.env.LOCK_USER,
      lockPassword: process.env.LOCK_PASSWORD,

      appLoyalty: process.env.APP_LOYALTY,
      appReferral: process.env.APP_REFERRAL || 'disabled',
    },
  },
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  imports: {
    dirs: [
      'stores/api-stores/**',
      'stores/ui-stores/**',
      'stores/form-stores/**',
      'stores/cms-stores/**',
    ],
  },
  nitro: {
    routeRules: {
      // '/api/**': { proxy: process.env.API_URL + '/**' },
      '/api2/**': { proxy: process.env.API_URL + '/**' },
    },
  },
  // Updated server configuration to match Nuxt 4 types
  devServer: {
    port: parseInt(process.env.PORT || '3000', 10),
  },
  modules: [
    // ...
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxtjs/i18n',
    '@nuxt/image',
    'vue3-perfect-scrollbar/nuxt',
    '@nuxtjs/strapi',
    '@nuxtjs/apollo',
    '@nuxt/icon',
    // GTM integration handled via plugins/gtm.client.ts
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  vite: {
    vue: {
      template: {},
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/scss/_font.scss" as *;
             @use "@/assets/scss/_colors.scss" as *;
             @use "@/assets/scss/plugins/_vselect.scss" as *;`,
        },
      },
    },
  },
  css: ['~/assets/scss/global.scss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    exposeConfig: true,
    viewer: true,
    // and more...
  },
  colorMode: {
    preference: 'dark', // default value of $colorMode.preference
    fallback: 'light', // fallback value if not system preference found
    hid: 'nuxt-color-mode-script',
    globalName: '__NUXT_COLOR_MODE__',
    componentName: 'ColorScheme',
    classPrefix: '',
    classSuffix: '-mode',
    storageKey: 'nuxt-color-mode',
  },
  i18n: {
    locales: ['en', 'fr'],
    defaultLocale: 'fr',
    strategy: 'prefix_except_default',
    customRoutes: 'config',
    pages: routesI18N,
    // CRITICAL: Disable browser language detection
    detectBrowserLanguage: false,

    // Force French on root path
    differentDomains: false,
  },
  strapi: {
    url: process.env.STRAPI_URL,
    prefix: '/api',
    admin: '/admin',
    version: 'v4',
    cookie: {},
    cookieName: 'strapi_jwt',
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: `${
          process.env.STRAPI_URL
        }/graphql`,
      },
    },
  },
  image: {
    // Options
    lazy: true,
    format: ['webp'],
    quality: 80,
  },
  // hooks: {
  //   'pages:extend'(pages) {
  //     function setMiddleware(pages: NuxtPage[]) {
  //       for (const page of pages) {
  //         if (/* some condition */ true) {
  //           page.meta ||= {};
  //           // Note that this will override any middleware set in `definePageMeta` in the page
  //           page.meta.middleware = ['auth', 'lock', 'loyalty'];
  //         }
  //         if (page.children) {
  //           setMiddleware(page.children);
  //         }
  //       }
  //     }
  //     setMiddleware(pages);
  //   },
  // },

  build: {
    transpile: ['vue3-carousel'],
  },
  // GTM configuration is provided via the module options
  // This will be handled by @nuxtjs/gtm module
  // The module will read the configuration from the module array
});
