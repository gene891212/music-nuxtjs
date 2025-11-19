/**
 * 歌詞解析工具函數
 * 支援 SRT、LRC 和純文字格式
 */

import type { LyricsLine, LyricsPayload } from '~/types'

/**
 * 解析 SRT 字幕格式
 *
 * SRT 格式範例:
 * ```
 * 1
 * 00:00:24,200 --> 00:00:36,900
 * 歌詞內容
 * ```
 *
 * @param content - SRT 格式的歌詞內容
 * @returns 包含時間軸的歌詞資料
 */
export function parseSRT(content: string): LyricsPayload {
  const lines: LyricsLine[] = []
  const blocks = content.trim().split('\n\n')

  for (const block of blocks) {
    const lines_array = block.split('\n')
    if (lines_array.length >= 3) {
      const timecode = lines_array[1] // "00:00:24,200 --> 00:00:36,900"
      if (!timecode) continue

      const text = lines_array.slice(2).join('\n')

      const timeMatch = timecode.match(
        /(\d{2}):(\d{2}):(\d{2}),(\d{3})\s+-->\s+(\d{2}):(\d{2}):(\d{2}),(\d{3})/
      )
      if (
        timeMatch &&
        timeMatch[1] &&
        timeMatch[2] &&
        timeMatch[3] &&
        timeMatch[4] &&
        timeMatch[5] &&
        timeMatch[6] &&
        timeMatch[7] &&
        timeMatch[8]
      ) {
        const startMs =
          parseInt(timeMatch[1]) * 3600000 +
          parseInt(timeMatch[2]) * 60000 +
          parseInt(timeMatch[3]) * 1000 +
          parseInt(timeMatch[4])
        const endMs =
          parseInt(timeMatch[5]) * 3600000 +
          parseInt(timeMatch[6]) * 60000 +
          parseInt(timeMatch[7]) * 1000 +
          parseInt(timeMatch[8])

        lines.push({ start_ms: startMs, end_ms: endMs, text })
      }
    }
  }

  return { lines }
}

/**
 * 解析 LRC 歌詞格式
 *
 * LRC 格式範例:
 * ```
 * [00:24.20]開いたノートに綴った青さは
 * [00:36.90]次の歌詞
 * ```
 *
 * @param content - LRC 格式的歌詞內容
 * @returns 包含時間軸的歌詞資料（end_ms 會自動計算為下一行的 start_ms）
 */
export function parseLRC(content: string): LyricsPayload {
  const lines: LyricsLine[] = []
  const lrcLines = content.split('\n')
  const timestamps: Array<{ start_ms: number; text: string }> = []

  // 第一遍：收集所有時間戳和文本
  for (const line of lrcLines) {
    // LRC 格式: [mm:ss.ms]text 或 [mm:ss]text
    const match = line.match(/\[(\d{2}):(\d{2})(?:\.(\d{2,3}))?\](.*)/)
    if (match && match[1] && match[2] && match[4] !== undefined) {
      const minutes = parseInt(match[1]!)
      const seconds = parseInt(match[2]!)
      const milliseconds = match[3] ? parseInt(match[3].padEnd(3, '0')) : 0
      const text = match[4]!.trim()

      const start_ms = minutes * 60000 + seconds * 1000 + milliseconds

      timestamps.push({ start_ms, text })
    }
  }

  // 第二遍：計算 end_ms（下一行的 start_ms，最後一行為 null）
  for (let i = 0; i < timestamps.length; i++) {
    const current = timestamps[i]!
    const next = timestamps[i + 1]

    const end_ms = next ? next.start_ms : null

    lines.push({
      start_ms: current.start_ms,
      end_ms: end_ms,
      text: current.text,
    })
  }

  return { lines }
}

/**
 * 自動檢測並解析歌詞格式
 *
 * 支援的格式：
 * - SRT: 包含 `-->` 時間碼
 * - LRC: 包含 `[mm:ss]` 時間碼
 * - 純文字: 其他情況，每行一句歌詞
 *
 * @param content - 歌詞內容
 * @returns 解析後的歌詞資料
 */
export function parseAuto(content: string): LyricsPayload {
  const trimmed = content.trim()

  // 檢測 SRT 格式（包含 --> 時間碼）
  if (trimmed.includes('-->')) {
    return parseSRT(trimmed)
  }

  // 檢測 LRC 格式（包含 [mm:ss] 時間碼）
  if (trimmed.includes('[') && trimmed.includes(']')) {
    return parseLRC(trimmed)
  }

  // 預設為純文字（無時間軸）
  const lines: LyricsLine[] = trimmed
    .split('\n')
    .filter(line => line.trim())
    .map(text => ({ text }))

  return { lines }
}
