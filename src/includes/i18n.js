import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import bi from '../locales/bi.json'

export default createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  legacy: false,
  messages: {
    en,
    bi
  },
  numberFormats: {
    en: {
      currency: {
        style: 'currency',
        currency: 'USD'
      }
    },
    ja: {
      currency: {
        style: 'currency',
        currency: 'JPY'
      }
    },
    ph: {
      currency: {
        style: 'currency',
        currency: 'PHP'
      }
    }
  }
})
