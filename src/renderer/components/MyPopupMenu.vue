<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { type DropdownInstance } from 'element-plus'
import { MenuItem } from '@shared/typings'

const { items } = defineProps<{
  items: MenuItem[]
}>()

const dropdownRef = ref<DropdownInstance>()
const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0
} as DOMRect)

const triggerRef = ref({
  getBoundingClientRect: () => position.value
})

let dataCache: unknown = null
function open(event: MouseEvent, data?: unknown): void {
  const { clientX, clientY } = event
  position.value = DOMRect.fromRect({
    x: clientX,
    y: clientY
  })
  event.preventDefault()
  dataCache = data
  dropdownRef.value?.handleOpen()
}

function onItemClick(item: MenuItem): void {
  item.click?.(dataCache)
  emit('itemClick', item, dataCache)
}

function close(): void {
  dropdownRef.value?.handleClose()
  dataCache = null
  emit('close')
}
onMounted(() => {
  window.addEventListener('click', close)
})
onUnmounted(() => {
  window.removeEventListener('click', close)
})

defineExpose({
  open,
  close
})

const emit = defineEmits<{
  close: []
  itemClick: [MenuItem, unknown]
}>()
</script>

<template>
  <el-dropdown
    ref="dropdownRef"
    :virtual-ref="triggerRef"
    :show-arrow="false"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 0] } }]
    }"
    virtual-triggering
    trigger="contextmenu"
    placement="bottom-start"
    class="my-popup-menu"
  >
    <template #dropdown>
      <el-dropdown-menu>
        <template v-for="(item, index) in items">
          <el-dropdown-item
            v-if="!item.hidden"
            :key="index"
            :divided="item.divided"
            @click.stop="onItemClick(item)"
          >
            <el-link :type="item.type" underline="never">
              <i v-if="item.icon" class="iconfont" :class="[`icon-${item.icon}`]"></i>
              {{ $t(item.label) }}
            </el-link>
          </el-dropdown-item>
        </template>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<style scoped>
:deep(.el-dropdown-menu__item) {
  padding: 0;

  .el-link {
    padding: 5px 16px;
    font-weight: normal;
    flex: auto;
    justify-content: flex-start;
  }
}
</style>
