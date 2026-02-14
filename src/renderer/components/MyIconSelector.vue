<script setup lang="ts">
import { ref } from 'vue'
import appIcon from '@assets/icon.png'
import { drawIcon } from '@utils/iconUtil'
import { handleDropFiles } from '@utils/dropUtil'
import { commonFileFiterMap, getRuleFromFileFilters } from '@utils/fileFilterUtil'

const model = defineModel<string>()
const emit = defineEmits<{
  change: [string]
}>()

function onClick(): void {
  window.api
    .showOpenDialog({
      properties: ['openFile', 'showHiddenFiles'],
      filters: [commonFileFiterMap.image, commonFileFiterMap.all]
    })
    .then(({ filePaths }) => {
      if (filePaths[0]) {
        setIcon(filePaths[0])
      }
    })
}

const imageRule = getRuleFromFileFilters([commonFileFiterMap.image])!

async function setIcon(path: string): Promise<void> {
  let icon: string | undefined
  if (imageRule.test(path)) {
    const base64 = window.api.readImageBase64(path)
    const dataURL = `data:image/*;base64,${base64}`
    icon = await drawIcon(dataURL)
  } else {
    const file = await window.api.getFileInfo(path)
    icon = file?.icon
  }
  model.value = icon || appIcon
  emit('change', model.value)
}

const isDragover = ref(false)
function onDrop(e: DragEvent): void {
  const files = handleDropFiles(e).filter((file) => window.api.isFile(file.path))
  const imageFiles = files.filter((file) => imageRule.test(file.name))
  const file = imageFiles[0] || files[0]
  if (file) setIcon(file.path)
  isDragover.value = false
}
</script>

<template>
  <div
    class="my-icon-selector"
    :class="{ 'is-dragover': isDragover }"
    @dragenter="isDragover = true"
    @drop="onDrop"
    @click="onClick"
  >
    <el-image :src="model || appIcon" class="icon"></el-image>
    <span class="actions" @dragleave="isDragover = false">
      <i class="iconfont icon-folder-open"></i>
    </span>
  </div>
</template>

<style scoped>
.my-icon-selector {
  display: inline-flex;
  cursor: pointer;
  position: relative;
  background-color: var(--el-fill-color-blank);
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-input-border-radius, var(--el-border-radius-base));
  padding: 5px;
  overflow: hidden;

  .actions {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: var(--el-overlay-color-lighter);
    transition: all var(--el-transition-duration);
    opacity: 0;
    & * {
      pointer-events: none;
    }
  }

  &:hover,
  &.is-dragover {
    border-color: (--el-input-hover-border-color);
    .actions {
      opacity: 1;
    }
  }
}

.my-icon-selector,
.icon {
  width: 32px;
  height: 32px;
}
</style>
