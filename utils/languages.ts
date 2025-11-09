/**
 * 語言相關的常數和工具函數
 */

/**
 * 支援的語言代碼
 */
export type LanguageCode = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'ru'

/**
 * 語言代碼對應的顯示名稱
 */
export const LANGUAGE_MAP: Record<LanguageCode, string> = {
  ja: '日本語',
  zh: '中文',
  en: 'English',
  ko: '한국어',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ru: 'Русский',
}

/**
 * 所有支援的語言代碼列表
 */
export const ALL_LANGUAGES: LanguageCode[] = Object.keys(LANGUAGE_MAP) as LanguageCode[]

/**
 * 取得語言的顯示名稱
 * @param code - 語言代碼
 * @returns 語言的顯示名稱，如果找不到則返回原代碼
 */
export function getLanguageName(code: string): string {
  return LANGUAGE_MAP[code as LanguageCode] || code
}

/**
 * 檢查是否為有效的語言代碼
 * @param code - 要檢查的語言代碼
 */
export function isValidLanguageCode(code: string): code is LanguageCode {
  return code in LANGUAGE_MAP
}
