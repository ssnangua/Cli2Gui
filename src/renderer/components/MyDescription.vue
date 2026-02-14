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
</script>

<template>
  <div class="my-description">
    <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
    <el-text v-if="parsedContent" type="info" size="small" v-html="parsedContent"></el-text>
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
:deep(.el-text) {
  & > * {
    margin: 0;
  }
  ul,
  ol {
    padding-left: 15px;
  }
}
</style>
