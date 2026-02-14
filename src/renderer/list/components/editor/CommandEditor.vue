<script setup lang="ts">
import useCurCommand from '@store/useCurCommand'
import WidgetList from './WidgetList.vue'
import CommandOptions from './CommandOptions.vue'
import WidgetOptions from './WidgetOptions.vue'
import { nextTick, useTemplateRef } from 'vue'

const { curCommand, inputTableHeight } = useCurCommand()
inputTableHeight.value = 127 // 输入控件表格高度固定为 127

const commandOptions = useTemplateRef('commandOptions')
const widgetOptions = useTemplateRef('widgetOptions')
function onSelectChange(index: number): void {
  if (widgetOptions.value) {
    widgetOptions.value.$el.scrollTop = 0
  }
  nextTick(() => {
    if (commandOptions.value) {
      // 滚动容器，让选中项出现在可视区域内
      const containerEl = commandOptions.value.$el
      const { scrollTop, offsetHeight: boxHeight } = containerEl
      const optionEl = commandOptions.value.$el.children[index]
      const elTop = optionEl.offsetTop - 10
      const elBottom = optionEl.offsetTop + optionEl.offsetHeight + 10
      // 如果元素的顶部超出可视区域
      if (scrollTop > elTop) {
        containerEl.scrollTo({ top: elTop, behavior: 'smooth' })
      }
      // 如果元素的底部超出可视区域
      if (scrollTop + boxHeight < elBottom) {
        containerEl.scrollTo({ top: elBottom - boxHeight, behavior: 'smooth' })
      }
    }
  })
}
</script>

<template>
  <el-container style="overflow: hidden">
    <el-aside width="175px" style="overflow: hidden scroll">
      <!-- 控件库 -->
      <WidgetList @select-change="onSelectChange" />
    </el-aside>

    <el-main class="main">
      <!-- 命令配置项 -->
      <CommandOptions ref="commandOptions" @select-change="onSelectChange" />
    </el-main>

    <el-aside ref="widgetOptions" width="300px" style="overflow: hidden scroll">
      <!-- 控件配置项 -->
      <WidgetOptions />
    </el-aside>
  </el-container>

  <!-- 命令预览 -->
  <my-command-code :command="curCommand" class="command-code" />
</template>

<style scoped>
.main {
  border-left: 1px solid var(--el-border-color);
  border-right: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);
  display: flex;
  padding: 0;
}
.command-code {
  border-top: 1px solid var(--el-border-color);
}
</style>
