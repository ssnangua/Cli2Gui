<script setup lang="ts">
import { onUnmounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { cloneDeep } from 'lodash-es'
import { CommandOption, Widget } from '@shared/typings'
import { widgets } from '@widgets/widgets'
import useCurCommand from '@store/useCurCommand'
import useI18n from '@store/useI18n'

const { t } = useI18n()
const { curCommand, curOption, cwdOption, inputOption, outputOption } = useCurCommand()

let __key__ = 0
curCommand.value?.options.forEach((option) => {
  option._key = 'widget_' + __key__++
  option._selected = false
})

function widgetClone(widget: Widget): CommandOption {
  const data = cloneDeep(widget.data)
  if (data.options) {
    data.options.forEach((option) => {
      if (option.labelKey) {
        option.label = t(option.labelKey)
        delete option.labelKey
      }
    })
  }
  return {
    ...data,
    _key: 'widget_' + __key__++,
    _selected: false
  }
}

function addWidget(widget: Widget): void {
  if (curCommand.value) {
    const option = widgetClone(widget)
    curCommand.value.options.forEach((widget) => (widget._selected = false))
    curCommand.value.options.push(option)
    curOption.value = option
    curOption.value._selected = true
    emit('selectChange', curCommand.value.options.length - 1)
  }
}

const emit = defineEmits<{
  selectChange: [number]
}>()

onUnmounted(() => {
  __key__ = 0
})
</script>

<template>
  <VueDraggable
    v-model="widgets"
    class="widget-list"
    :group="{ name: 'options', pull: 'clone', put: false }"
    :animation="150"
    :clone="widgetClone"
    :sort="false"
  >
    <div
      v-for="widget in widgets"
      v-show="!widget.hideInLib"
      :key="widget.name"
      class="widget-item"
      :class="{
        disabled:
          (widget.name === 'cwd' && cwdOption) ||
          (widget.name === 'input' && inputOption) ||
          (widget.name === 'output' && outputOption)
      }"
      @click="addWidget(widget)"
    >
      <div class="widget-icon">
        <i class="iconfont" :class="['icon-' + widget.icon]"></i>
      </div>
      <div class="widget-label">{{ $t(widget.label) }}</div>
    </div>
  </VueDraggable>
</template>

<style scoped>
.widget-list {
  display: flex;
  flex-flow: row wrap;
}

.widget-item {
  -webkit-user-drag: element;
  width: 80px;
  height: 80px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  transition: all 0.1s;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }

  &:hover {
    background: #4b72f8;
    color: #fff;
  }

  cursor: pointer;

  .widget-label {
    margin-top: 10px;
  }
}
</style>
