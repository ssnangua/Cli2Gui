/**
 * @see https://github.com/xtermjs/xterm.js
 */

import '@xterm/xterm/css/xterm.css'
import { Terminal } from '@xterm/xterm'
import { FitAddon } from '@xterm/addon-fit'
import { ClipboardAddon } from '@xterm/addon-clipboard'
import { SearchAddon } from '@xterm/addon-search'
import { WebLinksAddon } from '@xterm/addon-web-links'

export const xterm = new Terminal({
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

export const fitAddon = new FitAddon()
export const clipboardAddon = new ClipboardAddon()
export const searchAddon = new SearchAddon()
export const webLinksAddon = new WebLinksAddon((event: MouseEvent, text: string) => {
  if (event.button === 0) {
    window.api.openExternal(text)
  }
})

xterm.loadAddon(fitAddon)
xterm.loadAddon(clipboardAddon)
xterm.loadAddon(searchAddon)
xterm.loadAddon(webLinksAddon)
