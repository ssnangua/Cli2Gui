import { session } from 'electron'
import { is } from '@electron-toolkit/utils'
import path from 'path'
import fs from 'fs'

export function initExtensions(): void {
  // 只在开发模式下加载 Vue Devtools
  if (is.dev) {
    const vueDevToolsPath = path.join(
      __dirname,
      '../../extensions/nhdogjmejiglipccpnnnanhbledajbpd/7.7.7_0'
    )
    if (fs.existsSync(vueDevToolsPath)) {
      session.defaultSession.extensions.loadExtension(vueDevToolsPath).catch((e) => {
        console.error('Vue Devtools failed to install:', e?.toString())
      })
    }
  }
}
