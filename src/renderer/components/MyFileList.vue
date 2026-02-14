<script lang="tsx" setup>
import { FileFilter } from 'electron'
import { computed, onMounted, onUnmounted, ref, toRaw, useTemplateRef } from 'vue'
import { Column, ElMessageBox, RowClassNameGetter, RowEventHandlerParams } from 'element-plus'
import { FileExtra } from '@utils/dropUtil'
import { getRuleFromFileFilters } from '@utils/fileFilterUtil'
import useCurCommand from '@store/useCurCommand'
import useI18n from '@store/useI18n'

const { inputs, inputIndex, inputTableHeight } = useCurCommand()
const { t } = useI18n()

const props = defineProps<{
  disabled?: boolean
  openDirectory?: boolean
  filters?: FileFilter[]
  defaultPath?: string
  title?: string
}>()

const model = defineModel<string[]>()

const emit = defineEmits<{
  change: [string[]]
}>()

inputs.value = model.value!.map((path) => ({
  path,
  selected: false,
  state: 'normal',
  code: undefined,
  error: undefined
}))

const loading = ref(false)

// ==========================================
//                   表格
// ==========================================
const hasSelected = computed(() => inputs.value!.some((item) => item.selected))

const columns = ref<Column<unknown>[]>([
  {
    key: 'index',
    dataKey: 'index',
    title: '#',
    width: 50,
    cellRenderer: ({ rowIndex }) => <el-text>{rowIndex + 1}</el-text>
  },
  {
    key: 'path',
    dataKey: 'path',
    width: 0,
    headerCellRenderer: () => <>{t('widgets.input.component.path')}</>,
    cellRenderer: ({ cellData }) => (
      <div class="path" title={cellData}>
        <el-text>{window.api.parsePath(cellData as string).base}</el-text>
      </div>
    )
  },
  {
    key: 'operate',
    width: 110,
    headerCellRenderer: () => <>{t('widgets.input.component.operation')}</>,
    cellRenderer: ({ rowData, rowIndex }) => (
      <div onClick={(e: MouseEvent) => e.stopPropagation()} class="operation">
        {rowData.code !== undefined && rowData.code !== 0 ? (
          <el-link
            class="op-btn"
            underline="never"
            type="danger"
            title={t('widgets.input.component.error')}
            onClick={() => {
              const title = t('widgets.input.component.error') + `：${rowData.code}`
              const message =
                rowData.code === 2
                  ? t('widgets.input.component.stoppedByUser')
                  : rowData.error || t('widgets.input.component.unknownError')
              ElMessageBox.alert(message, title, {
                type: 'error',
                confirmButtonText: t('widgets.input.component.ok'),
                closeOnClickModal: true,
                closeOnPressEscape: true
              }).catch(() => {})
            }}
          >
            <i class="iconfont icon-help-fill"></i>
          </el-link>
        ) : null}

        {rowData.state !== 'normal' && rowData.state !== 'processing' ? (
          <el-link
            class="op-btn"
            underline="never"
            title={t('widgets.input.component.reset')}
            onClick={() => {
              rowData.state = 'normal'
              rowData.code = undefined
              rowData.error = undefined
            }}
          >
            <i class="iconfont icon-reset"></i>
          </el-link>
        ) : null}

        <el-link
          class="op-btn"
          underline="never"
          title={t('widgets.input.component.open')}
          onClick={() => openPath(rowData.path)}
        >
          <i class="iconfont icon-open-file"></i>
        </el-link>
        <el-link
          class="op-btn"
          underline="never"
          title={t('widgets.input.component.showInFolder')}
          onClick={() => showItemInFolder(rowData.path)}
        >
          <i class="iconfont icon-folder-open"></i>
        </el-link>
        <el-link
          class="op-btn remove-btn"
          underline="never"
          title={t('widgets.input.component.remove')}
          onClick={() => removeItem(rowIndex)}
        >
          <i class="iconfont icon-remove"></i>
        </el-link>
      </div>
    )
  }
])

async function showItemInFolder(path: string): Promise<void> {
  const result = await window.api.showItemInFolder(path)
  if (result === '-1') alertPathNotExists(t('widgets.input.component.notExists'))
}

async function openPath(path: string): Promise<void> {
  const result = await window.api.openPath(path)
  if (result) alertPathNotExists(result === '-1' ? t('widgets.input.component.notExists') : result)
}

function removeItem(index: number): void {
  model.value!.splice(index, 1)
  const [deleted] = inputs.value.splice(index, 1)
  if (deleted.selected) {
    if (inputs.value.length > 0) {
      const selectIndex = index < inputs.value.length ? index : inputs.value.length - 1
      inputs.value[selectIndex].selected = true
      inputIndex.value = selectIndex
    } else {
      inputIndex.value = 0
    }
  }
  emit('change', model.value!)
}

function alertPathNotExists(message: string): void {
  ElMessageBox.alert(message, t('widgets.input.component.failed'), {
    type: 'error',
    confirmButtonText: t('widgets.input.component.ok'),
    closeOnClickModal: true,
    closeOnPressEscape: true,
    callback: () => {}
  })
}

function onAutoResize(size: { width: number; height: number }): void {
  const pathColumnIndex = columns.value.findIndex((column) => column.dataKey === 'path')
  const otherColumnsTotalWidth = columns.value.reduce(
    (acc, column) => acc + (column.dataKey !== 'path' ? column.width : 0),
    0
  )
  columns.value[pathColumnIndex].width = size.width - otherColumnsTotalWidth
}

// ==========================================
//                   选中
// ==========================================
function toggleAll(selected: boolean): void {
  inputs.value.forEach((item) => (item.selected = selected))
}
function selectInvert(): void {
  inputs.value.forEach((item) => (item.selected = !item.selected))
}

function onRowClick({ event, rowIndex }: RowEventHandlerParams): void {
  const { ctrlKey, shiftKey } = event as MouseEvent
  if (ctrlKey) {
    inputs.value[rowIndex].selected = !inputs.value[rowIndex].selected
    inputIndex.value = rowIndex
  } else if (shiftKey) {
    const [start, end] = [rowIndex, inputIndex.value].sort()
    toggleAll(false)
    for (let i = start; i <= end; i++) {
      inputs.value[i].selected = true
    }
  } else {
    toggleAll(false)
    inputs.value[rowIndex].selected = true
    inputIndex.value = rowIndex
  }
}

function rowClass({ rowData }: Parameters<RowClassNameGetter<unknown>>[0]): string {
  const className: string[] = [rowData.state]
  if (rowData.selected) className.push('selected')
  return className.join(' ')
}

// ==========================================
//                  右键菜单
// ==========================================
const menuItems = [
  {
    label: 'widgets.input.component.reset',
    icon: 'reset',
    click() {
      inputs.value.forEach((item) => {
        if (item.selected) {
          item.state = 'normal'
          item.code = undefined
          item.error = undefined
        }
      })
    }
  },
  {
    label: 'widgets.input.component.remove',
    icon: 'remove',
    click: removeSelected
  },
  {
    label: 'widgets.input.component.clear',
    icon: 'clear-x',
    click: clear
  },
  {
    label: 'widgets.input.component.selectAll',
    icon: 'select-all',
    divided: true,
    click() {
      toggleAll(true)
    }
  },
  {
    label: 'widgets.input.component.selectInvert',
    icon: 'select-invert',
    click: selectInvert
  }
]

const menu = useTemplateRef('menu')
function onRowContextmenu({ event, rowData, rowIndex }: RowEventHandlerParams): void {
  if (menu.value) {
    if (!rowData.selected) {
      toggleAll(false)
      rowData.selected = true
      inputIndex.value = rowIndex
    }
    menu.value.open(event)
    event.preventDefault()
    event.stopPropagation()
  }
}

// ==========================================
//                  工具栏
// ==========================================
function showOpenDialog(): void {
  window.api
    .showOpenDialog({
      title: props.title,
      defaultPath: props.defaultPath,
      filters: toRaw(props.filters),
      properties: [
        'showHiddenFiles',
        'multiSelections',
        props.openDirectory ? 'openDirectory' : 'openFile'
      ]
    })
    .then(({ filePaths }) => {
      addPaths(filePaths)
    })
}

function addPaths(paths: string[]): void {
  const newPaths = paths.filter((path) => !model.value!.includes(path))
  model.value!.push(...newPaths)
  inputs.value.push(
    ...newPaths.map((path) => ({
      path,
      selected: false,
      state: 'normal' as const,
      code: undefined,
      error: undefined
    }))
  )
  if (newPaths.length > 0) {
    emit('change', model.value!)
  }
}

function removeSelected(): void {
  const newModel: string[] = []
  const newData: typeof inputs.value = []
  inputs.value.forEach((item) => {
    if (!item.selected) {
      newModel.push(item.path)
      newData.push(item)
    }
  })
  model.value = newModel
  inputs.value = newData
  inputIndex.value = 0
  emit('change', model.value!)
}

function clear(): void {
  model.value = []
  inputs.value = []
  inputIndex.value = 0
  emit('change', model.value!)
}

// ==========================================
//                   拖放
// ==========================================
const filtersRule = computed(() => props.filters && getRuleFromFileFilters(props.filters))

async function onDrop(files: FileExtra[]): Promise<void> {
  loading.value = true

  let filePaths = files.map((file) => file.path)

  if (props.openDirectory) {
    filePaths = filePaths.filter((file) => window.api.isDirectory(file))
  } else {
    filePaths = await window.api.readdirRecursive(filePaths)
    if (filtersRule.value) {
      filePaths = filePaths.filter((path) => filtersRule.value!.test(path))
    }
  }

  addPaths(filePaths)

  loading.value = false
}

// ==========================================
//             表格高度 & 键盘事件
// ==========================================
const tableHeight = ref(inputTableHeight.value || 0)
const rootRef = useTemplateRef('root')

onMounted(() => {
  if (inputTableHeight.value === 0) {
    window.addEventListener('resize', onResize)
    setTimeout(onResize, 0)
  }
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  if (inputTableHeight.value === 0) {
    window.removeEventListener('resize', onResize)
  }
  window.removeEventListener('keydown', onKeydown)
})

function onResize(): void {
  if (rootRef.value) {
    tableHeight.value = rootRef.value.parentElement!.offsetHeight - 40
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.repeat) return
  const { ctrlKey, metaKey, code } = event
  if ((ctrlKey || metaKey) && code === 'KeyA') {
    toggleAll(true)
    event.preventDefault()
    event.stopPropagation()
  } else if (code === 'Delete') {
    removeSelected()
    event.preventDefault()
    event.stopPropagation()
    menu.value.close()
  }
}
</script>

<template>
  <div ref="root" v-loading="loading" class="my-file-list" :class="{ disabled: props.disabled }">
    <div class="toolbar">
      <div>
        <el-button text :disabled="props.disabled" @click="showOpenDialog">
          <i class="iconfont icon-add"></i>
          {{ $t('widgets.input.component.add') }}
        </el-button>
        <el-divider direction="vertical" />
        <el-button text :disabled="props.disabled || !hasSelected" @click="removeSelected">
          <i class="iconfont icon-remove"></i>
          {{ $t('widgets.input.component.remove') }}
        </el-button>
        <el-button text :disabled="props.disabled || !model || model.length === 0" @click="clear">
          <i class="iconfont icon-clear-x"></i>
          {{ $t('widgets.input.component.clear') }}
        </el-button>
      </div>
    </div>

    <div class="table" :style="{ height: tableHeight + 'px' }" @paste="console.log($event)">
      <my-drop-files @drop="onDrop" />
      <el-auto-resizer @resize="onAutoResize">
        <template #default="{ height, width }">
          <el-table-v2
            :columns="columns"
            :data="inputs"
            :width="width"
            :height="height"
            :header-height="40"
            :row-height="40"
            :row-class="rowClass"
            :row-event-handlers="{
              onClick: onRowClick,
              onContextmenu: onRowContextmenu
            }"
            fixed
          >
            <template #empty>
              <my-empty>
                <el-text type="info">
                  <i class="iconfont icon-drag-drop"></i>
                  {{
                    $t(
                      props.openDirectory
                        ? 'widgets.input.component.dropDirectory'
                        : 'widgets.input.component.dropFiles'
                    )
                  }}
                </el-text>
              </my-empty>
            </template>
          </el-table-v2>
        </template>
      </el-auto-resizer>
    </div>

    <my-popup-menu ref="menu" :items="menuItems" />
  </div>
</template>

<style scoped>
.my-file-list {
  overflow: hidden;
  .toolbar {
    height: 32px;
    text-align: right;
    margin-bottom: 5px;

    & > div {
      display: inline-block;
      background: var(--el-fill-color-blank);
      border-radius: var(--el-border-radius-base);
    }

    .el-button {
      padding: 8px;
      i {
        font-size: 14px;
        margin-right: 2px;
      }
      & + .el-button {
        margin: 0;
      }
    }
  }

  .table {
    border: 1px solid var(--el-border-color);

    :deep(.el-table-v2__header) .el-table-v2__header-cell {
      background-color: var(--el-bg-color);
    }

    :deep(.el-table-v2__row) {
      &.selected {
        background-color: var(--el-color-success-light-9);
      }
      &.processing {
        .path .el-text {
          color: var(--el-color-primary);
        }
      }
      &.success {
        opacity: 0.5;
        font-style: italic;
        &:hover,
        &.selected {
          opacity: 1;
          .path .el-text {
            color: var(--el-color-success);
          }
        }
      }
      &.error {
        font-style: italic;
        .path .el-text {
          color: var(--el-color-danger);
        }
      }

      /* .path start */
      .path {
        overflow: hidden;
        display: flex;
        width: 100%;

        .el-text {
          flex: auto;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      /* .path end */

      .operation {
        width: 100%;
        text-align: right;

        .op-btn {
          .iconfont {
            font-size: 14px;
          }
          & + .op-btn {
            margin-left: 5px;
          }
        }
        .remove-btn:hover {
          color: var(--el-color-danger);
        }
      }
    }

    :deep(.el-table-v2__empty) {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  &.disabled {
    .table {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>
