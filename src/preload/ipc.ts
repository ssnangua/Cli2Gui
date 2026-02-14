/* eslint-disable @typescript-eslint/no-explicit-any */
import { ipcRenderer } from 'electron'

type IPCListener = (event: Electron.IpcRendererEvent, ...args: any[]) => void

const IPC = {
  get(type: string, data?: any): Promise<any> {
    return ipcRenderer.invoke('get', { type, data })
  },
  getSync(type: string, data?: any): any {
    return ipcRenderer.sendSync('getSync', { type, data })
  },
  post(type: string, data?: any): void {
    ipcRenderer.send('post', { type, data })
  },
  on(channel: string, listener: IPCListener): void {
    ipcRenderer.on(channel, listener)
  },
  off(channel: string, listener: IPCListener): void {
    ipcRenderer.off(channel, listener)
  }
}

export default IPC
