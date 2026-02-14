<script setup lang="ts">
import { FileFilter } from 'electron'
import { computed } from 'vue'

const model = defineModel<FileFilter[]>()

const rows = computed(() => {
  return model.value?.map(
    (filter) => `${filter.name} (${filter.extensions.map((ext) => `*.${ext}`).join(';')})`
  )
})
</script>

<template>
  <div v-if="model && model.length > 0" class="my-file-filters">
    <div v-for="(row, index) in rows" :key="index" :title="row" class="file-filter">
      <el-text size="small">{{ row }}</el-text>
    </div>
  </div>
  <div v-else class="my-file-filters-empty">
    <my-empty>
      <el-text type="info">{{ $t('widgetOptions.fileFilter.noData') }}</el-text>
    </my-empty>
  </div>
</template>

<style scoped>
.my-file-filters {
  border-top: var(--el-table-border);

  .file-filter {
    border-bottom: var(--el-table-border);
    padding: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
</style>
