<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'

const { content } = defineProps<{
  content?: string
}>()

const parsedContent = computed(() => {
  if (!content) return content
  const parsed = marked.parse(content) as string
  const replaced = parsed.replace(/\[SPACE\]/g, '<i class="iconfont icon-space"></i>')
  return replaced
})

function handleClick(e): void {
  if (e.target.tagName === 'A') {
    e.preventDefault()
    window.api.openExternal(e.target.href)
  }
}
</script>

<template>
  <div class="my-description">
    <!-- eslint-disable vue/no-v-html vue/no-v-text-v-html-on-component -->
    <el-text
      v-if="parsedContent"
      type="info"
      size="small"
      class="my-marked"
      @click="handleClick"
      v-html="parsedContent"
    ></el-text>
    <el-text v-else type="info" size="small">
      <slot></slot>
    </el-text>
  </div>
</template>

<style scoped>
.my-description {
  display: block;
  line-height: 16px;
  margin-top: 5px;
}
:deep(.my-marked) {
  & > * {
    margin: 0;
  }
  ul,
  ol {
    padding-left: 15px;
  }
  blockquote {
    padding: 4px 8px;
    background-color: var(--el-color-info-light-9);
    border-radius: 4px;
    border-left: 4px solid var(--el-color-info);
  }
  code {
    background-color: var(--el-bg-color-page);
    color: var(--el-color-warning);
    padding: 2px 4px;
    border-radius: 4px;
    user-select: text;
    font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
  }
  pre {
    padding: 4px 8px;
    background-color: var(--el-bg-color-page);
    border-radius: 4px;
    user-select: text;
    cursor: text;
    code {
      padding: 0;
    }
  }
  p,
  pre,
  blockquote {
    margin: 4px 0;
  }
  a {
    color: var(--el-color-primary);
    text-decoration: none;
    &:hover {
      color: var(--el-color-primary-light-3);
      text-decoration: underline;
    }
  }
}
</style>
