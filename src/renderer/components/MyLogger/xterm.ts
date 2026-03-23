/**
 * @see https://github.com/xtermjs/xterm.js
 */

import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function newXterm() {
  const xterm = new Terminal({
    allowProposedApi: true,
    convertEol: true
  })

  xterm.attachCustomKeyEventHandler((event) => {
    if ((event.ctrlKey || event.metaKey) && event.code === 'KeyC' && event.type === 'keydown') {
      const selection = xterm.getSelection()
      if (selection) {
        navigator.clipboard.writeText(selection)
        return false
      }
    }
    return true
  })

  const fitAddon = new FitAddon()
  const clipboardAddon = new ClipboardAddon()
  const searchAddon = new SearchAddon()
  const webLinksAddon = new WebLinksAddon((event: MouseEvent, text: string) => {
    if (event.button === 0) {
      window.api.openExternal(text)
    }
  })

  xterm.loadAddon(fitAddon)
  xterm.loadAddon(clipboardAddon)
  xterm.loadAddon(searchAddon)
  xterm.loadAddon(webLinksAddon)

  return {
    xterm,
    fitAddon,
    clipboardAddon,
    searchAddon,
    webLinksAddon
  }
}
