import { shell } from 'electron'
import path from 'path'
import fs from 'fs'
import icoEndec from 'ico-endec'
import { RESOURCES_DIR } from '@shared/resources'
import { Command } from '@shared/typings'
import IPC from './ipc'

const APP_ICO = path.join(RESOURCES_DIR, 'icon.ico')

// 生成快捷方式图标文件
async function generateIco(base64: string, file: string): Promise<string> {
  const buffer = Buffer.from(base64.replace(/^data:image\/png;base64,/, ''), 'base64')
  const icoBuffer = icoEndec.encode([buffer])
  fs.mkdirSync(path.dirname(file), { recursive: true })
  await fs.promises.writeFile(file, icoBuffer)
  return file
}

interface FromMain {
  isDev: boolean
  appPath: string
  desktopDir: string
  iconDir: string
}
let paths: FromMain | null = null
async function fromMain(): Promise<FromMain> {
  if (!paths) {
    const isDev = await IPC.get('isDev')
    const appPath = await IPC.get('appPath')
    const desktopDir = await IPC.get('path', 'desktop')
    const userDataDir = await IPC.get('path', 'userData')
    const iconDir = path.join(userDataDir, 'icons')
    paths = { isDev, appPath, desktopDir, iconDir }
  }
  return paths
}

/**
 * [Windows] 创建桌面快捷方式
 * @param command 快捷方式要运行的命令
 * @param icon 快捷方式图标Base64数据
 * @param description 快捷方式描述
 */
export async function createDesktopShortcut(
  command: Command,
  icon: string,
  description: string
): Promise<void> {
  const { isDev, appPath, desktopDir, iconDir } = await fromMain()
  const shortcutPath = path.join(desktopDir, `${command.base.name}.lnk`)
  let iconPath = APP_ICO
  if (icon) {
    iconPath = path.join(iconDir, `${command._id}.ico`)
    await generateIco(icon, iconPath)
  }
  shell.writeShortcutLink(shortcutPath, {
    target: process.execPath,
    args: isDev ? `${appPath} --open-command=${command._id}` : `--open-command=${command._id}`,
    description,
    icon: iconPath,
    iconIndex: 0
  })
}

/**
 * [Windows] 移除桌面快捷方式和快捷方式的图标文件
 * @param commands 命令列表
 */
export async function removeDesktopShortcuts(commands: Command[]): Promise<void> {
  const { desktopDir, iconDir } = await fromMain()
  for (const command of commands) {
    const shortcutPath = path.join(desktopDir, `${command.base.name}.lnk`)
    if (fs.existsSync(shortcutPath)) {
      fs.promises.unlink(shortcutPath)
    }
    const iconPath = path.join(iconDir, `${command._id}.ico`)
    if (fs.existsSync(iconPath)) {
      fs.promises.unlink(iconPath)
    }
  }
}

/**
 * [Windows] 移除桌面快捷方式
 * @param shortcutPath 快捷方式路径
 */
export async function removeDesktopShortcutByPath(shortcutPath: string): Promise<void> {
  const shortcut = shell.readShortcutLink(shortcutPath)
  if (shortcut.icon && fs.existsSync(shortcut.icon)) {
    const { iconDir } = await fromMain()
    const icon = path.resolve(shortcut.icon)
    if (icon.startsWith(iconDir)) {
      await fs.promises.unlink(icon)
    }
  }
  await fs.promises.unlink(shortcutPath)
}

/**
 * [Windows] 尝试通过命令ID移除桌面快捷方式
 * @param commandId 命令ID
 * @returns 是否成功移除
 */
export async function tryRemoveDesktopShortcutByCommandId(commandId: number): Promise<boolean> {
  const { desktopDir, iconDir } = await fromMain()
  // 移除图标文件
  const iconPath = path.join(iconDir, `${commandId}.ico`)
  if (fs.existsSync(iconPath)) {
    fs.promises.unlink(iconPath)
  }
  // 遍历桌面快捷方式，找到对应的快捷方式并移除
  const files = await fs.promises.readdir(desktopDir)
  for (const file of files) {
    if (/.lnk$/i.test(file)) {
      const shortcut = shell.readShortcutLink(path.join(desktopDir, file))
      if (shortcut.args && shortcut.args.includes(`--open-command=${commandId}`)) {
        const shortcutPath = path.join(desktopDir, file)
        await fs.promises.unlink(shortcutPath)
        return true
      }
    }
  }
  return false
}
