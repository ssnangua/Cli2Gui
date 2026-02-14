<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

const { icon, content } = defineProps<{
  icon?: string
  content?: string
}>()

const parsedContent = computed(() => {
  if (!content) return content
  const parsed = marked.parse(content) as string
  const replaced = parsed.replace(/\[SPACE\]/g, '<i class="iconfont icon-space"></i>')
  return replaced
})
</script>

<template>
  <el-tooltip placement="top" effect="light" :offset="8" popper-class="my-help-tooltip-popper">
    <template #content>
      <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
      <el-text v-if="parsedContent" v-html="parsedContent"></el-text>
      <slot></slot>
    </template>
    <el-link underline="never" class="my-help-tooltip">
      <i class="iconfont" :class="icon ? `icon-${icon}` : 'icon-help-fill'"></i>
    </el-link>
  </el-tooltip>
</template>

<style scoped>
.my-help-tooltip {
  cursor: help;
  margin-left: 5px;
}
</style>

<style>
/* popper 会被添加到 body 上 */
.my-help-tooltip-popper {
  padding: 8px;
  .el-text {
    & > * {
      margin: 0;
    }
    ul,
    ol {
      padding-left: 15px;
    }
  }
}
</style>
