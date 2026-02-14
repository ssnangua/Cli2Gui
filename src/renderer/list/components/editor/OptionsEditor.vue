<script setup lang="ts">
import { ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ComponentOption } from '@shared/typings'

const dialogVisible = ref(false)

const innerOptions = ref<ComponentOption[]>([])

function open(options: ComponentOption[]): void {
  innerOptions.value = cloneDeep(options)
  dialogVisible.value = true
}

defineExpose({
  open
})

const emit = defineEmits<{
  confirm: [ComponentOption[]]
}>()

function confirm(): void {
  emit('confirm', innerOptions.value)
  dialogVisible.value = false
}

function clean(): void {
  innerOptions.value = []
}

function addRow(index: number): void {
  innerOptions.value.splice(index, 0, { label: '', value: '' })
}
function removeRow(index: number): void {
  innerOptions.value.splice(index, 1)
}
function moveUpRow(i: number): void {
  const v = innerOptions.value
  ;[v[i - 1], v[i]] = [v[i], v[i - 1]]
}
function moveDownRow(i: number): void {
  const v = innerOptions.value
  ;[v[i], v[i + 1]] = [v[i + 1], v[i]]
}
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    modal-class="options-editor"
    append-to-body
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @closed="clean"
  >
    <el-table
      :data="innerOptions"
      :empty-text="$t('editor.fileFiltersEditor.noData')"
      style="width: 100%"
    >
      <el-table-column :label="$t('editor.optionsEditor.label')">
        <template #default="scope">
          <el-input v-model="scope.row.label"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('editor.optionsEditor.value')">
        <template #default="scope">
          <el-input v-model="scope.row.value"></el-input>
        </template>
      </el-table-column>

      <el-table-column :label="$t('editor.optionsEditor.operation')" width="120">
        <template #default="scope">
          <el-link
            class="op-btn"
            underline="never"
            :title="$t('editor.optionsEditor.add')"
            @click="addRow(scope.$index)"
          >
            <i class="iconfont icon-add"></i>
          </el-link>
          <el-link
            class="op-btn"
            underline="never"
            :disabled="scope.$index === 0"
            :title="$t('editor.optionsEditor.moveUp')"
            @click="moveUpRow(scope.$index)"
          >
            <i class="iconfont icon-move-up"></i>
          </el-link>
          <el-link
            class="op-btn"
            underline="never"
            :disabled="scope.$index === innerOptions.length - 1"
            :title="$t('editor.optionsEditor.moveDown')"
            @click="moveDownRow(scope.$index)"
          >
            <i class="iconfont icon-move-down"></i>
          </el-link>
          <el-link
            class="op-btn remove-btn"
            underline="never"
            :title="$t('editor.optionsEditor.remove')"
            @click="removeRow(scope.$index)"
          >
            <i class="iconfont icon-remove"></i>
          </el-link>
        </template>
      </el-table-column>
    </el-table>

    <el-link class="op-btn append-btn" underline="never" @click="addRow(innerOptions.length)">
      <i class="iconfont icon-add"></i>
    </el-link>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">
          {{ $t('editor.optionsEditor.cancel') }}
        </el-button>
        <el-button type="primary" @click="confirm">
          {{ $t('editor.optionsEditor.save') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
.options-editor {
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
}
</style>
