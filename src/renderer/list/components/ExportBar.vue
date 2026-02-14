<script setup lang="ts">
import { watch } from 'vue'
import { exportCommands } from '@utils/commandUtil'
import useData from '@store/useData'
import useListStore from '@store/useListStore'

const data = useData()
const { isExporting, isSelectAll, selectedItems } = useListStore()

watch(isExporting, (value: boolean) => {
  if (!value) {
    isSelectAll.value = false
    selectedItems.value = []
  }
})

function onSelectAllChange(value: boolean): void {
  if (value) {
    selectedItems.value = [...data.items.value]
  } else {
    selectedItems.value = []
  }
}
</script>

<template>
  <div v-if="isExporting" class="export-bar">
    <el-checkbox
      v-model="isSelectAll"
      :label="$t('list.exportBar.selectAll')"
      @change="onSelectAllChange"
    />
    <el-link
      underline="never"
      :disabled="selectedItems.length === 0"
      @click="exportCommands(selectedItems)"
    >
      <i class="iconfont icon-export"></i>
      {{ $t('list.exportBar.export') }}
    </el-link>
    <el-link underline="never" class="cancel-export" @click="isExporting = false">
      {{ $t('list.exportBar.cancel') }}
    </el-link>
  </div>
</template>

<style scoped>
.export-bar {
  padding: 10px 20px 0 20px;
  display: flex;
  gap: 20px;

  i {
    margin-right: 2px;
  }

  .cancel-export:hover {
    color: var(--el-color-warning);
  }
}
</style>
