<script setup lang="ts">
import { FileFilter } from 'electron'
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { commonFileFilters } from '@utils/fileFilterUtil'
import useI18n from '@store/useI18n'

const { t } = useI18n()

const dialogVisible = ref(false)

const innerData = ref<FileFilter[]>([])

function open(fileFilters: FileFilter[]): void {
  innerData.value = cloneDeep(fileFilters)
  dialogVisible.value = true
}

defineExpose({
  open
})

const emit = defineEmits<{
  confirm: [FileFilter[]]
}>()

function confirm(): void {
  innerData.value.forEach((item) => {
    item.extensions = item.extensions.map((ext) => ext.trim())
  })
  emit('confirm', innerData.value)
  dialogVisible.value = false
}

function clean(): void {
  innerData.value = []
}

function addRow(index: number): void {
  innerData.value.splice(index, 0, { name: '', extensions: [] })
}
function removeRow(index: number): void {
  innerData.value.splice(index, 1)
}
function moveUpRow(i: number): void {
  const v = innerData.value
  ;[v[i - 1], v[i]] = [v[i], v[i - 1]]
}
function moveDownRow(i: number): void {
  const v = innerData.value
  ;[v[i], v[i + 1]] = [v[i + 1], v[i]]
}

function addPresetFilter(filter): void {
  const item = cloneDeep(filter)
  item.name = t(item.name)
  innerData.value.push(item)
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    modal-class="file-filters-editor"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="clean"
  >
    <el-table
      :data="innerData"
      :empty-text="$t('editor.fileFiltersEditor.noData')"
      style="width: 100%"
    >
      <el-table-column :label="$t('editor.fileFiltersEditor.name')" width="150">
        <template #default="scope">
          <el-input v-model="scope.row.name"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('editor.fileFiltersEditor.extensions')">
        <template #default="scope">
          <el-input-tag
            v-model="scope.row.extensions"
            :placeholder="$t('editor.fileFiltersEditor.extensionsPlaceholder')"
            delimiter=","
            draggable
          />
        </template>
      </el-table-column>

      <el-table-column :label="$t('editor.fileFiltersEditor.operation')" width="120">
        <template #default="scope">
          <el-link
            class="op-btn"
            underline="never"
            :title="$t('editor.fileFiltersEditor.add')"
            @click="addRow(scope.$index)"
          >
            <i class="iconfont icon-add"></i>
          </el-link>
          <el-link
            class="op-btn"
            underline="never"
            :disabled="scope.$index === 0"
            :title="$t('editor.fileFiltersEditor.moveUp')"
            @click="moveUpRow(scope.$index)"
          >
            <i class="iconfont icon-move-up"></i>
          </el-link>
          <el-link
            class="op-btn"
            underline="never"
            :disabled="scope.$index === innerData.length - 1"
            :title="$t('editor.fileFiltersEditor.moveDown')"
            @click="moveDownRow(scope.$index)"
          >
            <i class="iconfont icon-move-down"></i>
          </el-link>
          <el-link
            class="op-btn remove-btn"
            underline="never"
            :title="$t('editor.fileFiltersEditor.remove')"
            @click="removeRow(scope.$index)"
          >
            <i class="iconfont icon-remove"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-link
      class="op-btn append-btn"
      underline="never"
      :title="$t('editor.fileFiltersEditor.add')"
      @click="addRow(innerData.length)"
    >
      <i class="iconfont icon-add"></i>
    </el-link>

    <template #footer>
      <div class="dialog-footer">
        <span class="common-filters">
          <template v-for="(filter, index) in commonFileFilters" :key="filter.name">
            <el-divider v-if="index > 0" direction="vertical" />
            <el-link underline="never" @click="addPresetFilter(filter)">
              {{ $t(filter.name) }}
            </el-link>
          </template>
        </span>
        <el-button @click="dialogVisible = false">
          {{ $t('editor.fileFiltersEditor.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('editor.fileFiltersEditor.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.file-filters-editor {
  .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell {
    background-color: transparent;
  }
  .op-btn + .op-btn {
    margin-left: 5px;
  }
  .remove-btn:hover {
    color: var(--el-color-danger);
  }
  .append-btn {
    width: 100%;
    padding: 10px 0;
    border-bottom: var(--el-table-border);
    &:hover {
      background-color: var(--el-table-row-hover-bg-color);
    }
  }

  .dialog-footer {
    display: flex;
  }
  .common-filters {
    flex: auto;
    text-align: left;
    display: flex;
    align-items: center;
  }
}
</style>
