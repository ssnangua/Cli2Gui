<script setup lang="ts">
import { computed, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import useData from '@store/useData'
import useCurCommand from '@store/useCurCommand'
import { generateWindowIcon } from '@utils/iconUtil'
import CommandEditor from './CommandEditor.vue'
import WindowEditor from './WindowEditor.vue'

const data = useData()
const { curCommand } = useCurCommand()

const dialogVisible = ref(false)
const commandId = ref<number | undefined>()
const activeTab = ref('command')

interface OpenOptions {
  commandId?: number
  filePath?: string
}

async function open(options: OpenOptions): Promise<void> {
  const command = options.commandId
    ? cloneDeep(data.getItem(options.commandId)!)
    : data.createItem()

  // 将命令的基本信息作为第一个配置项，以便在编辑器中显示
  command.options.unshift({
    widget: 'base',
    value: command.base
  })

  curCommand.value = command
  commandId.value = options.commandId
  activeTab.value = 'command'
  dialogVisible.value = true

  if (options.filePath) {
    // 获取命令真实路径和图标
    const file = await window.api.getFileInfo(options.filePath)
    if (file) {
      Object.assign(curCommand.value.base, {
        name: window.api.parsePath(file.realPath).name,
        icon: file.icon,
        realPath: file.realPath
      })
    }
  }
}

defineExpose({
  open
})

const canConfirm = computed(() => {
  return curCommand.value?.base.command || curCommand.value?.base.realPath
})

async function confirm(): Promise<void> {
  if (curCommand.value) {
    // 移除第一个配置项（即命令基本信息）
    curCommand.value.options.shift()
    // 生成窗口图标
    if (curCommand.value.base.icon) {
      curCommand.value.window.icon = await generateWindowIcon(curCommand.value.base.icon)
    }
    // 清理临时属性
    curCommand.value.options.forEach((widget) => {
      delete widget._key
      delete widget._selected
    })
    const item = curCommand.value
    data.setItem(item._id, item)
  }
  dialogVisible.value = false
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    :title="$t(commandId ? 'editor.editCommand' : 'editor.newCommand')"
    :fullscreen="true"
    modal-class="editor"
    @closed="curCommand = undefined"
  >
    <el-tabs v-if="curCommand" v-model="activeTab" type="border-card">
      <el-tab-pane :label="$t('editor.command')" name="command">
        <CommandEditor />
      </el-tab-pane>

      <el-tab-pane :label="$t('editor.window')" name="window">
        <WindowEditor />
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('editor.cancel') }}</el-button>
        <el-button :disabled="!canConfirm" type="primary" @click="confirm">
          {{ $t('editor.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.editor {
  .el-dialog {
    display: flex;
    flex-flow: column;
    overflow: hidden;

    .el-dialog__header,
    .el-dialog__footer {
      flex-shrink: 0;
    }

    .el-dialog__body {
      flex: auto;
      display: flex;
      overflow: hidden;
    }

    .el-tabs {
      flex: auto;
    }
    .el-tabs__content {
      padding: 0;
      display: flex;

      & .el-tab-pane {
        flex: auto;
        display: flex;
        flex-flow: column;
        overflow: hidden;
        width: 0;
      }
    }
  }
}
</style>
