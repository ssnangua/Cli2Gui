import { NativeImage, shell } from 'electron'
import fs from 'fs'
import path from 'path'
import os from 'os'
import which from 'which'
import { AppInfo, Cli2GuiData, Command, FileInfo, PathName } from '@shared/typings'
import { APP_NAME } from '@shared/constants'
import IPC from './ipc'
import { execCommand, stopCommand } from './execCommand'
import {
  createDesktopShortcut,
  removeDesktopShortcuts,
  removeDesktopShortcutByPath,
  tryRemoveDesktopShortcutByCommandId
} from './desktopShortcut'

// Custom APIs for renderer
const api = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getLanguageSync(locale: string): Record<string, any> {
    return IPC.getSync('getLanguageSync', locale)
  },
  setLocale(locale: string): void {
    IPC.post('setLocale', locale)
  },
  checkLanguages(curLanguages: Record<string, string>): Promise<Record<string, string> | null> {
    return IPC.get('checkLanguages', curLanguages)
  },

  ...IPC,

  getVersion(): Promise<string> {
    return IPC.get('appVersion')
  },

  /**
   * 获取应用基本信息（关于）
   * @returns 应用基本信息
   */
  async getAppInfo(): Promise<AppInfo> {
    const { electron, chrome, node, v8 } = process.versions
    return {
      name: APP_NAME,
      version: await this.getVersion(),
      electron,
      chrome,
      node,
      v8,
      os: [os.type(), os.arch(), os.release()].join(' ')
    }
  },

  parsePath: path.parse.bind(path),
  joinPath: path.join.bind(path),
  resolvePath: path.resolve.bind(path),

  /**
   * 确保路径不重复
   * @param filePath 路径
   * @returns 不重复的路径
   */
  uniquePath(filePath: string): string {
    let uniquePath = filePath
    const { dir, name, ext } = path.parse(filePath)
    let i = 1
    while (fs.existsSync(uniquePath)) {
      uniquePath = path.join(dir, `${name} (${i++})${ext}`)
    }
    return uniquePath
  },

  /**
   * 根据名称获取路径
   * @param name 名称
   * @returns 路径
   */
  getPath(name: PathName): Promise<string> {
    return IPC.get('path', name)
  },

  isExists: fs.existsSync.bind(fs),
  isFile: (path: string): boolean => fs.existsSync(path) && fs.statSync(path).isFile(),
  isDirectory: (path: string): boolean => fs.existsSync(path) && fs.statSync(path).isDirectory(),
  ensureDir: (path: string): void => {
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path, { recursive: true })
    }
  },

  /**
   * 递归读取文件夹
   */
  async readdirRecursive(paths: string[]): Promise<string[]> {
    const files: string[] = []
    for (const dir of paths) {
      if (fs.statSync(dir).isDirectory()) {
        const filesInDir = await fs.promises.readdir(dir, { recursive: true, withFileTypes: true })
        const filePaths = filesInDir
          .filter((file) => file.isFile())
          .map((file) => path.join(file.parentPath, file.name))
        files.push(...filePaths)
      } else {
        files.push(dir)
      }
    }
    return files
  },

  /**
   * 是否是可执行文件
   * @param path 文件路径
   * @returns 是否是可执行文件
   */
  isExecutable: (path: string): boolean => {
    // 如果是 Windows 快捷方式，获取目标文件路径
    if (/.lnk$/i.test(path)) {
      path = shell.readShortcutLink(path).target
    }
    if (!fs.existsSync(path)) return false
    // 如果是 Windows 系统，判断扩展名是否为可执行文件
    if (process.platform === 'win32') {
      return /\.(exe|bat|cmd|vbs|ps1)$/i.test(path)
    }
    // 其他 Posix 系统，检查是否具有执行权限
    try {
      fs.accessSync(path, fs.constants.X_OK)
      return true
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      return false
    }
  },

  /**
   * 打开命令窗口
   * @param command 命令配置
   */
  openCommandWindow(command: Command): void {
    IPC.post('openCommandWindow', command)
  },

  execCommand,
  stopCommand,

  /**
   * 导入数据
   * @param file 数据文件
   * @returns 数据
   */
  async importData(file: string): Promise<Cli2GuiData | undefined> {
    if (!/\.json/i.test(file)) return
    const data = await fs.promises.readFile(file, 'utf8')
    const json = JSON.parse(data)
    return json.cli2gui && json.data && json
  },

  /**
   * 导出数据
   * @param file 保存路径
   * @param json 数据
   * @returns
   */
  async exportData(file: string, json: Cli2GuiData): Promise<void> {
    if (!/\.json/i.test(file) || !json.cli2gui || !json.data) return
    return fs.promises.writeFile(file, JSON.stringify(json, null, 2))
  },

  /**
   * 获取可执行文件信息（真实路径和图标）
   * @param filePath 可执行文件路径
   * @returns 可执行文件信息
   */
  async getFileInfo(filePath: string): Promise<FileInfo | null> {
    // 如果是 Windows 快捷方式，获取目标文件路径
    if (/.lnk$/i.test(filePath)) {
      filePath = shell.readShortcutLink(filePath).target
    }
    if (!fs.existsSync(filePath)) return null
    // 调用主进程获取文件图标
    const icon: NativeImage = await IPC.get('fileIcon', filePath)
    return {
      realPath: filePath,
      icon: icon.toDataURL()
    }
  },

  /**
   * 获取命令对应的可执行文件信息
   * @param command 命令
   * @returns 可执行文件信息
   */
  async getCommandInfo(command: string): Promise<FileInfo | null> {
    const filePath = await which(command, { nothrow: true })
    if (!filePath || !fs.existsSync(filePath)) return null
    const file = await api.getFileInfo(filePath)
    return file ? { ...file, command } : null
  },

  /**
   * 打开文件选择对话框
   * @param options 对话框选项
   * @returns 对话框返回值
   */
  showOpenDialog(options: Electron.OpenDialogOptions): Promise<Electron.OpenDialogReturnValue> {
    return IPC.get('showOpenDialog', options)
  },

  /**
   * 打开文件保存对话框
   * @param options 对话框选项
   * @returns 对话框返回值
   */
  showSaveDialog(options: Electron.SaveDialogOptions): Promise<Electron.SaveDialogReturnValue> {
    return IPC.get('showSaveDialog', options)
  },

  /**
   * 打开消息框
   * @param options 消息框选项
   * @returns 消息框返回值
   */
  showMessageBox(options: Electron.MessageBoxOptions): Promise<Electron.MessageBoxReturnValue> {
    return IPC.get('showMessageBox', options)
  },

  /**
   * 获取图片文件 Base64 数据
   * @param path 图片文件路径
   * @returns 图片 Base64 数据
   */
  readImageBase64(path: string): string {
    return fs.readFileSync(path, 'base64')
  },

  /**
   * 在文件管理器中显示指定的文件
   * @param path 文件路径
   * @returns 如果文件存在，返回空字符串，否则返回 "-1"
   */
  async showItemInFolder(path: string): Promise<string> {
    if (fs.existsSync(path)) {
      try {
        shell.showItemInFolder(path)
        return ''
      } catch (error) {
        return error as string
      }
    }
    return '-1'
  },

  /**
   * 以桌面的默认方式打开给定的 URL
   * @param url URL
   * @returns
   */
  async openExternal(url: string): Promise<string> {
    try {
      await shell.openExternal(url)
      return ''
    } catch (error) {
      return error as string
    }
  },

  /**
   * 以桌面的默认方式打开给定的文件
   * @param path 文件路径
   * @returns 如果执行成功，返回空字符串，否则返回一个带有错误信息的字符串
   */
  async openPath(path: string): Promise<string> {
    if (fs.existsSync(path)) {
      return shell.openPath(path)
    }
    return '-1'
  },

  /**
   * 设置 Chromium 本地色彩主题
   * @param themeSource 主题
   */
  toggleTheme(themeSource: string): void {
    IPC.post('toggleTheme', themeSource)
  },

  // [Windows] 桌面快捷方式相关
  createDesktopShortcut,
  removeDesktopShortcuts,
  removeDesktopShortcutByPath,
  tryRemoveDesktopShortcutByCommandId,

  /**
   * 显示主界面
   */
  displayMainInterface(): void {
    IPC.post('displayMainInterface')
  },

  /**
   * 退出应用
   */
  quitApp(): void {
    IPC.post('quitApp')
  }
}

export default api
