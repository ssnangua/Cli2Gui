import { toRaw, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { createI18n } from 'vue-i18n'

// 语言包清单
const languages = useStorage<Record<string, string>>('languages', {
  en: 'English',
  'zh-CN': '简体中文'
})

// 当前语言
const locale = useStorage<string>('locale', navigator.language)

// 获取语言包
const message = window.api.getLanguageSync(locale.value)

// 如果没有对应的语言包，默认会返回英文包，更新当前语言
if (message.__locale__ !== locale.value) locale.value = message.__locale__
// 设置主进程的当前语言
window.api.setLocale(locale.value)

// 如果语言包清单中没有该语言，添加进去
if (!languages.value[message.__locale__]) languages.value[message.__locale__] = message.language

// 延迟检查语言包目录，如果有变更，更新语言包清单
setTimeout(async () => {
  const changed = await window.api.checkLanguages(toRaw(languages.value))
  if (changed) languages.value = changed
}, 100)

const messages = {
  [locale.value]: message
}

const i18n = createI18n({
  messages,
  locale: locale.value,
  fallbackLocale: 'en'
})

// 监听语言变化
watch(locale, (value) => {
  // 加载相应的语言包
  if (!messages[value]) {
    messages[value] = window.api.getLanguageSync(value)
  }
  // 更新 i18n 插件的当前语言
  i18n.global.locale = value as typeof i18n.global.locale
  // 设置主进程的当前语言
  window.api.setLocale(locale.value)
})

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useI18n() {
  return {
    i18n,
    languages,
    locale,
    t: i18n.global.t.bind(i18n.global) as typeof i18n.global.t
  }
}

export default useI18n
