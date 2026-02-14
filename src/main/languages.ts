/**
 * 多语言
 * @description 其实最好是使用i18next之类的解决方案，不过这个应用的主进程部分只有托盘菜单需要做多语言，就简单处理
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { EventEmitter } from 'events'
import { LANGUAGES_DIR } from '@shared/resources'

export const languages: Record<string, any> = {}

const eventEmitter = new EventEmitter()
export function onLocale(listener: (...args: any[]) => void): void {
  eventEmitter.on('locale', listener)
}
export function offLocale(listener: (...args: any[]) => void): void {
  eventEmitter.off('locale', listener)
}
export function setLocale(locale: string): void {
  eventEmitter.emit('locale', languages[locale])
}

/**
 * 获取语言包（同步）
 * @param locale 语言
 * @returns 语言包
 */
export function getLanguageSync(locale: string): Record<string, any> {
  // 如果是开发模式，不使用缓存
  if (app.isPackaged && languages[locale]) return languages[locale]
  const messageFilePath = path.join(LANGUAGES_DIR, `${locale}.json`)
  if (fs.existsSync(messageFilePath)) {
    const message = JSON.parse(fs.readFileSync(messageFilePath, 'utf-8'))
    message.__locale__ = locale
    languages[locale] = message
    // console.log(`语言包已加载：${locale}`)
    return message
  }
  return getLanguageSync('en')
}

/**
 * 检查语言包清单
 * @param curLanguages 当前语言包清单
 * @returns 最新语言包清单
 */
export async function checkLanguages(
  curLanguages: Record<string, string>
): Promise<Record<string, string> | null> {
  const files = (await fs.promises.readdir(LANGUAGES_DIR)).filter((file) => file.endsWith('.json'))
  const locales = files.map((file) => file.replace('.json', ''))
  if (
    locales.some((locale) => !curLanguages[locale]) ||
    Object.keys(curLanguages).some((locale) => !locales.includes(locale))
  ) {
    const newLanguages: Record<string, string> = {}
    for (const file of files) {
      const message = JSON.parse(
        await fs.promises.readFile(path.join(LANGUAGES_DIR, file), 'utf-8')
      )
      newLanguages[file.replace('.json', '')] = message.language
    }
    return newLanguages
  }
  return null
}
