import { app } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import { createMainWindow, showMainWindow, mainWindow } from './window'
import { initExtensions } from './extensions'
import { initTray } from './tray'
import './ipc'

const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_, argv) => {
    const [sourceShortcut, openCommand] = getArgs(argv, ['--source-shortcut', '--open-command'])
    // 如果是从命令快捷方式启动
    if (sourceShortcut && openCommand) {
      mainWindow!.webContents.send('open-command', {
        sourceShortcut,
        commandId: +openCommand
      })
    } else {
      // 如果是从其他途径启动（如再次点击应用图标），则显示主窗口
      showMainWindow()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // 初始化扩展（如 Vue DevTools）
    initExtensions()

    // 初始化系统托盘
    initTray()

    // 创建主窗口
    createMainWindow()

    // 如果是从命令快捷方式启动，隐藏主窗口，直接打开对应的命令窗口
    const openCommand = app.commandLine.getSwitchValue('open-command')
    if (openCommand) {
      mainWindow!.hide()
      mainWindow!.webContents.once('did-finish-load', () => {
        mainWindow!.webContents.send('open-command', {
          commandId: +openCommand
        })
      })
    }

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      // if (BrowserWindow.getAllWindows().length === 0) openListWindow()
      showMainWindow()
    })
  })

  // Quit when all windows are closed, except on macOS. There, it's common
  // for applications and their menu bar to stay active until the user quits
  // explicitly with Cmd + Q.
  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
}

function getArgs(argv: string[], args: string[]): Array<string | undefined> {
  return args.map((argName) => {
    const arg = argv.find((a) => a.startsWith(`${argName}=`))
    return arg && arg.split('=')[1]
  })
}
