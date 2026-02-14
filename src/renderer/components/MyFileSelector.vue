<script setup lang="ts">
import { FileFilter } from 'electron'
import { computed, ref, toRaw, useTemplateRef } from 'vue'
import { handleDropFiles } from '@utils/dropUtil'
import { getRuleFromFileFilters } from '@utils/fileFilterUtil'

const props = defineProps<{
  disabled?: boolean
  openDirectory?: boolean
  isSave?: boolean
  filters?: FileFilter[]
  exectuble?: boolean
  defaultPath?: string
  title?: string
  placeholder?: string
}>()

const model = defineModel<string>()
const emit = defineEmits<{
  change: [string]
}>()

function showOpenDialog(): void {
  window.api
    .showOpenDialog({
      title: props.title,
      defaultPath: props.defaultPath,
      filters: toRaw(props.filters),
      properties: ['showHiddenFiles', props.openDirectory ? 'openDirectory' : 'openFile']
    })
    .then(({ filePaths }) => {
      if (filePaths.length > 0 && filePaths[0] !== model.value) {
        model.value = filePaths[0]
        emit('change', model.value)
      }
    })
}

function showSaveDialog(): void {
  window.api
    .showSaveDialog({
      title: props.title,
      defaultPath: model.value,
      filters: toRaw(props.filters)
    })
    .then(({ filePath }) => {
      if (filePath && filePath !== model.value) {
        model.value = filePath
        emit('change', model.value)
      }
    })
}

const isDragover = ref(false)
const filtersRule = computed(() => props.filters && getRuleFromFileFilters(props.filters))

function onDrop(e: DragEvent): void {
  const files = handleDropFiles(e).filter((file) => {
    if (props.openDirectory) {
      if (!window.api.isDirectory(file.path)) return false
    }
    if (props.exectuble) {
      if (!window.api.isExecutable(file.path)) return false
    }
    if (filtersRule.value && !filtersRule.value.test(file.name)) {
      return false
    }
    return true
  })

  if (files.length > 0 && files[0].path !== model.value) {
    model.value = files[0].path
    emit('change', model.value)
  }
  isDragover.value = false
}

const inputRef = useTemplateRef('inputRef')
defineExpose({
  inputRef
})
</script>

<template>
  <el-input
    ref="inputRef"
    v-model="model"
    class="my-file-selector"
    :class="{ 'is-dragover': isDragover }"
    :disabled="disabled"
    :placeholder="placeholder"
    @dragenter="isDragover = true"
    @dragleave="isDragover = false"
    @drop="onDrop"
  >
    <template #append>
      <el-button @click="props.isSave ? showSaveDialog() : showOpenDialog()">
        <i class="iconfont icon-folder-open"></i>
      </el-button>
    </template>
  </el-input>
</template>

<style scoped>
.my-file-selector {
  :deep(.el-input__wrapper) {
    transition: background-color var(--el-transition-duration);
  }
  &.is-dragover :deep(.el-input__wrapper) {
    background-color: var(--el-color-primary-light-9);
    box-shadow: 0 0 0 1px var(--el-input-focus-border-color) inset;
  }
}
</style>
