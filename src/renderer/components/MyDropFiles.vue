<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import { FileExtra, handleDropFiles } from '@utils/dropUtil'

const isDragover = ref(false)
const emit = defineEmits<{
  drop: [FileExtra[]]
}>()

const $el = useTemplateRef<HTMLDivElement>('root')
const parent = computed(() => $el.value?.parentElement)

function onDragover(): void {
  isDragover.value = true
}

function onDrop(e: DragEvent): void {
  const files = handleDropFiles(e)
  emit('drop', files)
  isDragover.value = false
  e.stopPropagation()
  e.preventDefault()
}

onMounted(() => {
  if (parent.value) {
    if (getComputedStyle(parent.value).position === 'static') {
      parent.value.style.position = 'relative'
    }
    parent.value.addEventListener('dragover', onDragover)
  }
})

onUnmounted(() => {
  if (parent.value) {
    parent.value.removeEventListener('dragover', onDragover)
  }
})
</script>

<template>
  <div
    ref="root"
    class="my-drop-files"
    :class="{ 'is-dragover': isDragover }"
    @dragleave="isDragover = false"
    @drop="onDrop"
  >
    <div class="box">
      <i class="iconfont icon-drag-drop"></i>
    </div>
  </div>
</template>

<style scoped>
.my-drop-files {
  z-index: 1000;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: none;

  &.is-dragover {
    display: flex;
  }

  & * {
    pointer-events: none;
  }

  .box {
    flex: auto;
    margin: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 4px dashed #ffffff;

    .icon-drag-drop {
      color: #ffffff;
      font-size: 50px;
    }
  }
}
</style>
