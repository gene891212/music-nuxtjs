// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // SPA 模式 - 未來要改成 SSR 只需將此行改為 true 或刪除
  ssr: false,

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/image',
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
  ],

  // Supabase 配置
  supabase: {
    redirect: false, // 禁用自動重定向（根據需求可調整）
  },

  // 組件自動導入配置
  components: [
    {
      path: '~/components',
      pathPrefix: false, // 不使用路徑作為前綴
    },
  ],

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    exposeConfig: true,
    viewer: true,
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Roboto', provider: 'google' },
    ],
  },

  image: {},

  vue: {
    compilerOptions: {
      isCustomElement: (tag) => ['rb', 'rt', 'rp', 'rtc'].includes(tag),
    },
  },
})