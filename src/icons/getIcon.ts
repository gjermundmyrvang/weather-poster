import { readFile, access } from 'fs/promises'
import { join } from 'path'

const ICON_DIR = join(process.cwd(), 'src', 'icons', 'svg')
const FALLBACK = 'cloudy'

export async function getIconBase64(symbolCode: string): Promise<string> {
  const tryLoad = async (name: string): Promise<string | null> => {
    const filePath = join(ICON_DIR, `${name}.svg`)
    try {
      await access(filePath)
      const svg = await readFile(filePath, 'utf-8')
      const base64 = Buffer.from(svg).toString('base64')
      return `data:image/svg+xml;base64,${base64}`
    } catch {
      return null
    }
  }

  return (await tryLoad(symbolCode)) ?? (await tryLoad(FALLBACK)) ?? ''
}
