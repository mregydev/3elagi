import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    locales: [
      { code: 'en', language: 'en-US', dir: 'ltr' },
      { code: 'ar', language: 'ar-EG', dir: 'rtl' },
    ],
    defaultLocale: 'ar',
    strategy: 'no_prefix',
    vueI18n: '~/i18n/i18n.config.ts',
    detectBrowserLanguage: false,
  },

  vite: {
    plugins: [tailwindcss()],
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Nunito:wght@700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&display=swap',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  components: [
    { path: '~/components/ui', pathPrefix: false },
    { path: '~/shared/components', pathPrefix: false },
    '~/components',
  ],
})
