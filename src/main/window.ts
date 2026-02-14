import { app, BrowserWindow, nativeImage, shell } from 'electron'
import { is } from '@electron-toolkit/utils'
import { join } from 'path'
import { merge } from 'lodash-es'
import { Command } from '@shared/typings'
import { RESOURCES_DIR } from '@shared/resources'

const APP_ICON = join(RESOURCES_DIR, 'icon.png')

function createWindow(
  pathname: string,
  options: Electron.BrowserWindowConstructorOptions = {},
  query?: Record<string, string>
): BrowserWindow {
  // Create the browser window.
  const browserWindow = new BrowserWindow(
    merge(
      {
        show: false,
        autoHideMenuBar: true,
        ...(process.platform === 'linux' ? { appIcon: APP_ICON } : {}),
        webPreferences: {
          // webSecurity: !is.dev,
          preload: join(__dirname, '../preload/index.js'),
          sandbox: false
        }
      },
      options
    )
  )

  browserWindow.on('ready-to-show', () => {
    browserWindow.show()
    if (is.dev) browserWindow.webContents.openDevTools()
  })

  browserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    const search = query ? `?${new URLSearchParams(query).toString()}` : ''
    browserWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/${pathname}${search}`)
  } else {
    browserWindow.loadFile(join(__dirname, `../renderer/${pathname}`), { query })
  }

  return browserWindow
}

let isQuit = false
export let mainWindow: BrowserWindow | null = null

export function createMainWindow(): void {
  mainWindow = createWindow('list/index.html', {
    icon: APP_ICON,
    minWidth: 920,
    minHeight: 600
  })

  // 关闭主窗口时，隐藏窗口而不是关闭，以保持应用在后台运行
  mainWindow.on('close', (event) => {
    if (!isQuit) {
      event.preventDefault()
      mainWindow!.hide()
    }
  })
}

export function showMainWindow(): void {
  if (mainWindow) {
    mainWindow.show()
    mainWindow.focus()
  }
}

export function quitApp(): void {
  isQuit = true
  app.quit()
}

export function openCommandWindow(command: Command): void {
  const { _id, base, window } = command
  createWindow(
    'item/index.html',
    {
      title: base.name,
      ...window,
      icon: window.icon ? nativeImage.createFromDataURL(window.icon) : APP_ICON
    },
    {
      id: String(_id)
    }
  )
}
