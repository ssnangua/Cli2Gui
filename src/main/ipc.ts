import { app, BrowserWindow, dialog, ipcMain, nativeTheme, shell } from 'electron'
import { openCommandWindow, quitApp, showMainWindow } from './window'
import { getLanguageSync, checkLanguages, setLocale } from './languages'

ipcMain.handle('get', async (event, { type, data }) => {
  const window = BrowserWindow.fromWebContents(event.sender)!
  switch (type) {
    case 'isDev':
      return !app.isPackaged
    // 应用版本号
    case 'appVersion':
      return app.getVersion()
    // 获取应用路径（用于生成桌面快捷方式）
    case 'appPath':
      return app.getAppPath()
    // 获取路径
    case 'path':
      return app.getPath(data)
    // 获取文件图标
    case 'fileIcon':
      return await app.getFileIcon(data, { size: 'large' })
    // 打开文件选择对话框
    case 'showOpenDialog':
      return dialog.showOpenDialog(window, data)
    // 打开文件保存对话框
    case 'showSaveDialog':
      return dialog.showSaveDialog(window, data)
    // 打开信息对话框
    case 'showMessageBox':
      return dialog.showMessageBox(window, data)
    // 检查语言包清单
    case 'checkLanguages':
      return checkLanguages(data)
    default:
      throw new Error(`Unknown type: ${type}`)
  }
})

ipcMain.on('getSync', async (event, { type, data }) => {
  switch (type) {
    // 获取语言包
    case 'getLanguageSync':
      event.returnValue = getLanguageSync(data)
      break
    default:
      throw new Error(`Unknown type: ${type}`)
  }
})

ipcMain.on('post', async (_, { type, data }) => {
  switch (type) {
    // 设置当前语言
    case 'setLocale':
      setLocale(data)
      break
    // 打开命令窗口
    case 'openCommandWindow':
      openCommandWindow(data)
      break
    // 主题变更，给所有窗口发送消息
    case 'toggleTheme':
      nativeTheme.themeSource = data
      break
    // 移除文件到回收站
    case 'trashItem':
      shell.trashItem(data)
      break
    // 显示主界面
    case 'displayMainInterface':
      showMainWindow()
      break
    // 退出应用
    case 'quitApp':
      quitApp()
      break
    default:
      throw new Error(`Unknown type: ${type}`)
  }
  return
})
