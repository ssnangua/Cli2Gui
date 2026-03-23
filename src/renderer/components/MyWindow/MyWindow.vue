<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, useTemplateRef, watch } from 'vue'
import store from './MyWindowStore'
import { clamp } from 'lodash-es'

const model = defineModel<boolean>({ default: false })

const {
  title = '',
  bodyClass = '',
  width = 300,
  height = 200
} = defineProps<{
  title?: string
  bodyClass?: string
  width?: number | string
  height?: number | string
}>()

const emit = defineEmits<{
  mounted: []
  resize: [{ x: number; y: number; width: number; height: number }]
}>()

const $window = useTemplateRef<HTMLDivElement>('window')

function parseSize(value: number | string, refer: number): number {
  if (typeof value === 'number') return value
  if (value.endsWith('px')) return parseInt(value, 10)
  if (value.endsWith('%')) return refer * parseFloat(value) * 0.01
  return 0
}

const state = ref({
  zIndex: ++store.zIndex,
  x: (window.innerWidth - 300) / 2,
  y: (window.innerHeight - 200) / 2,
  width: 300,
  height: 200,
  // 初始鼠标位置
  mouseX: 0,
  mouseY: 0,
  // 移动
  startX: 0,
  startY: 0,
  minX: 0,
  minY: 0,
  maxX: 0,
  maxY: 0,
  // 缩放
  direction: '',
  startWidth: 0,
  startHeight: 0,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 0,
  maxHeight: 0
})

function startMove(event: MouseEvent): void {
  const { x, y, width, height } = $window.value!.getBoundingClientRect()
  Object.assign(state.value, {
    mouseX: event.clientX,
    mouseY: event.clientY,
    startX: x,
    startY: y,
    maxX: window.innerWidth - width,
    maxY: window.innerHeight - height
  })
  window.addEventListener('mousemove', move)
  window.addEventListener('mouseup', stopMove)
}
function move(event: MouseEvent): void {
  const { mouseX, mouseY } = state.value
  const { startX, startY, minX, minY, maxX, maxY } = state.value
  const x = startX + event.clientX - mouseX
  const y = startY + event.clientY - mouseY
  Object.assign(state.value, {
    x: clamp(x, minX, maxX),
    y: clamp(y, minY, maxY)
  })
}
function stopMove(): void {
  window.removeEventListener('mousemove', move)
  window.removeEventListener('mouseup', stopMove)
}

const resizers = [
  'top-left',
  'top',
  'top-right',
  'right',
  'bottom-right',
  'bottom',
  'bottom-left',
  'left'
]

function startResize(direction: string, event: MouseEvent): void {
  const { minWidth, minHeight } = state.value
  const { x, y, width, height } = $window.value!.getBoundingClientRect()
  Object.assign(state.value, {
    mouseX: event.clientX,
    mouseY: event.clientY,
    startX: x,
    startY: y,
    maxX: direction.includes('left') ? x + width - minWidth : x,
    maxY: direction.includes('top') ? y + height - minHeight : y,
    direction,
    startWidth: width,
    startHeight: height,
    maxWidth: direction.includes('left') ? x + width : window.innerWidth - x,
    maxHeight: direction.includes('top') ? y + height : window.innerHeight - y
  })
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}
function resize(event: MouseEvent): void {
  const { mouseX, mouseY } = state.value
  const { startX, startY, minX, minY, maxX, maxY } = state.value
  const { direction, startWidth, startHeight, minWidth, minHeight, maxWidth, maxHeight } =
    state.value
  const dx = event.clientX - mouseX
  const dy = event.clientY - mouseY
  const width = startWidth + (direction.includes('left') ? -dx : dx)
  const height = startHeight + (direction.includes('top') ? -dy : dy)
  const x = startX + (direction.includes('left') ? dx : 0)
  const y = startY + (direction.includes('top') ? dy : 0)
  const isResizeX = direction.includes('left') || direction.includes('right')
  const isResizeY = direction.includes('top') || direction.includes('bottom')
  const newState = {
    x: isResizeX ? clamp(x, minX, maxX) : startX,
    y: isResizeY ? clamp(y, minY, maxY) : startY,
    width: isResizeX ? clamp(width, minWidth, maxWidth) : startWidth,
    height: isResizeY ? clamp(height, minHeight, maxHeight) : startHeight
  }
  Object.assign(state.value, newState)
  emit('resize', newState)
}
function stopResize(): void {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResize)
}

const isMount = ref(false)
watch(
  model,
  () => {
    if (!isMount.value && model.value) {
      const _width = parseSize(width, window.innerWidth)
      const _height = parseSize(height, window.innerHeight)
      Object.assign(state.value, {
        x: (window.innerWidth - _width) / 2,
        y: (window.innerHeight - _height) / 2,
        width: _width,
        height: _height
      })
      isMount.value = true
      nextTick(() => emit('mounted'))
    }
  },
  { immediate: true }
)

const isMounted = ref(false)
onMounted(() => {
  nextTick(() => (isMounted.value = true))
  window.addEventListener('resize', onResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
function onResize(): void {
  const { x, y, width, height } = state.value
  const dx = x + width - window.innerWidth
  const dy = y + height - window.innerHeight
  if (dx > 0) {
    if (x > dx) state.value.x = x - dx
    else state.value.width = width - dx
  }
  if (dy > 0) {
    if (y > dy) state.value.y = y - dy
    else state.value.height = height - dy
  }
  if (dx > 0 || dy > 0) emit('resize', state.value)
}

defineExpose({
  $window,
  focus() {
    state.value.zIndex = ++store.zIndex
  }
})
</script>

<template>
  <Teleport to="body">
    <div
      ref="window"
      class="my-window"
      :class="{ hide: !isMounted || !model }"
      :style="{
        zIndex: state.zIndex,
        left: state.x + 'px',
        top: state.y + 'px',
        width: state.width + 'px',
        height: state.height + 'px'
      }"
      @mousedown="state.zIndex = ++store.zIndex"
    >
      <div class="header">
        <div class="title" @mousedown="startMove">
          <el-text>{{ title }}</el-text>
        </div>
        <div class="controls">
          <el-button text @click="model = false">
            <i class="iconfont icon-close"></i>
          </el-button>
        </div>
      </div>
      <div class="body" :class="bodyClass">
        <slot v-if="isMount"></slot>
      </div>

      <div
        v-for="direction in resizers"
        :key="direction"
        :class="['resizer', direction]"
        @mousedown="startResize(direction, $event)"
      ></div>
    </div>
  </Teleport>
</template>

<style scoped>
.my-window {
  /* --border-radius: var(--el-border-radius-base); */
  --border-radius: 8px;
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);

  position: fixed;
  display: flex;
  flex-flow: column;
  box-shadow: var(--el-box-shadow-light);
  overflow: visible;

  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
  &.hide {
    opacity: 0;
    transform: scale(0.9);
    pointer-events: none;
  }
}
.header {
  background-color: var(--el-fill-color-light);
  border-top-left-radius: var(--border-radius);
  border-top-right-radius: var(--border-radius);
  border: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color-light);
  overflow: hidden;
  flex-shrink: 0;

  display: flex;
  .title {
    flex: auto;
    cursor: move;
    margin: 4px 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.body {
  flex: auto;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color);
  border-top: none;

  display: flex;
}

.resizer {
  position: absolute;

  &.top-left {
    top: -8px;
    left: -8px;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
  }
  &.top {
    top: -8px;
    height: 16px;
    left: 8px;
    right: 8px;
    cursor: ns-resize;
  }
  &.top-right {
    top: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    cursor: nesw-resize;
  }
  &.right {
    right: -8px;
    width: 16px;
    top: 8px;
    bottom: 8px;
    cursor: ew-resize;
  }
  &.bottom-right {
    bottom: -8px;
    right: -8px;
    width: 16px;
    height: 16px;
    cursor: nwse-resize;
  }
  &.bottom {
    bottom: -8px;
    height: 16px;
    right: 8px;
    left: 8px;
    cursor: ns-resize;
  }
  &.bottom-left {
    bottom: -8px;
    left: -8px;
    width: 16px;
    height: 16px;
    cursor: nesw-resize;
  }
  &.left {
    left: -8px;
    width: 16px;
    bottom: 8px;
    top: 8px;
    cursor: ew-resize;
  }
}
</style>
