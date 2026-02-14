import { Menu, nativeImage, Tray } from 'electron'
import { APP_NAME } from '@shared/constants'
import { RESOURCES_DIR } from '@shared/resources'
import { quitApp, showMainWindow } from './window'
import { onLocale } from './languages'
import path from 'path'

function getIcon(iconName: string): Electron.NativeImage {
  const icon = path.join(RESOURCES_DIR, iconName)
  return nativeImage.createFromPath(icon).resize({ width: 16, height: 16 })
}

let tray: Tray | undefined

const menuItems = [
  {
    id: 'displayMainInterface',
    icon: getIcon('main.png'),
    label: '显示主界面',
    click: showMainWindow
  },
  {
    id: 'quit',
    icon: getIcon('quit.png'),
    label: '退出',
    click: quitApp
  }
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
onLocale((language: Record<string, any>): void => {
  menuItems.forEach((item) => {
    item.label = language.app.trayMenu[item.id]
  })
  tray?.setContextMenu(Menu.buildFromTemplate(menuItems))
})

export function initTray(): void {
  const APP_ICON = path.join(RESOURCES_DIR, 'icon.png')
  tray = new Tray(APP_ICON)
  tray.setToolTip(APP_NAME)
  tray.setContextMenu(Menu.buildFromTemplate(menuItems))
  tray.on('click', showMainWindow)
}
