<script setup lang="ts">
import { onMounted, onUnmounted, toRaw, useTemplateRef } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Command } from '@shared/typings'
import { FileExtra } from '@utils/dropUtil'
import useData from '@store/useData'
import Header from './components/Header.vue'
import ExportBar from './components/ExportBar.vue'
import List from './components/List.vue'
import ItemMenu from './components/ItemMenu.vue'
import Editor from './components/editor/Editor.vue'
import '@utils/defaultCommandItems'
import { importCommands } from '@utils/commandUtil'
import useI18n from '@store/useI18n'

const { t } = useI18n()
const { getItem } = useData()

function openCommandWindow(command: Command): void {
  const clone = cloneDeep(toRaw(command))
  const input = clone.options.find((option) => option.widget === 'input')
  const hasInput = input && !input.hidden
  clone.window.width ||= hasInput ? 800 : 400
  clone.window.height ||= hasInput ? 600 : 400
  window.api.openCommandWindow(clone)
}

// 通过快捷方式打开命令
function openCommandByShortcut(_, { commandId, sourceShortcut }): void {
  const command = getItem(commandId)
  if (command) {
    // 如果命令存在，打开命令窗口
    openCommandWindow(command)
  } else {
    // 如果命令不存在，显示主界面
    window.api.displayMainInterface()

    // 提示用户移除快捷方式
    window.api
      .showMessageBox({
        type: 'info',
        buttons: ['Yes', 'No'],
        defaultId: 0,
        title: t('list.itemMenu.warning'),
        message: t('list.itemMenu.commandRemoved')
      })
      .then(({ response }) => {
        if (response === 0) {
          if (sourceShortcut) {
            // 如果应用已经打开，可以在 second-instance 事件的命令行参数里找到快捷方式的路径
            window.api.removeDesktopShortcutByPath(sourceShortcut)
          } else {
            // TODO：如果应用未打开，不知怎么获取快捷方式的路径，目前是通过遍历桌面，查找有对应 commandId 的快捷方式
            window.api.tryRemoveDesktopShortcutByCommandId(commandId)
          }
        }
      })
      .catch(() => {})
  }
}
onMounted(() => {
  window.api.on('open-command', openCommandByShortcut)
})
onUnmounted(() => {
  window.api.off('open-command', openCommandByShortcut)
})

const editor = useTemplateRef('editor')
function openEditor(command?: Command): void {
  editor.value?.open({ commandId: command?._id })
}

const itemMenu = useTemplateRef('itemMenu')
function popupItemMenu(event: MouseEvent, command: Command): void {
  itemMenu.value?.open(event, command)
}

function onDrop(files: FileExtra[]): void {
  const filePaths = files.map((file) => file.path)

  // 如果是数据文件
  const jsonFiles = filePaths.filter((file) => /\.json/i.test(file))
  importCommands(jsonFiles)

  // 如果是可执行文件
  const [executableFile] = filePaths.filter((file) => window.api.isExecutable(file))
  if (executableFile) {
    editor.value?.open({ filePath: executableFile })
  }
}
</script>

<template>
  <el-container>
    <my-drop-files @drop="onDrop" />

    <el-header class="my-container-header">
      <Header @open-editor="openEditor" />
    </el-header>

    <ExportBar />

    <el-main class="my-container-main">
      <List @item-click="openCommandWindow" @item-menu="popupItemMenu" />
    </el-main>
  </el-container>

  <ItemMenu ref="itemMenu" @open-editor="openEditor" />
  <Editor ref="editor" />
</template>

<style scoped>
.my-container-header {
  height: 52px;
}
.my-container-header,
.my-container-main {
  padding: 0;
  position: relative;
}
</style>
