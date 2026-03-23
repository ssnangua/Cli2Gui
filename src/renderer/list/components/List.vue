<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import useData from '@store/useData'
import useListStore from '@store/useListStore'
import { Command } from '@shared/typings'
import Item from './Item.vue'

const { items } = useData()
const { viewMode, isDragging, isExporting, isSelectAll, selectedItems } = useListStore()

const emit = defineEmits<{
  itemClick: [Command]
  itemMenu: [MouseEvent, Command]
}>()
</script>

<template>
  <el-checkbox-group
    v-if="items.length > 0"
    v-model="selectedItems"
    class="export-group"
    @change="isSelectAll = $event.length === items.length"
  >
    <VueDraggable
      v-model="items"
      :animation="150"
      ghost-class="ghost"
      draggable=".draggable"
      class="command-list"
      :class="[viewMode, isDragging ? 'is-dragging' : '', isExporting ? 'is-exporting' : '']"
      @start="isDragging = true"
      @end="isDragging = false"
    >
      <Item
        v-for="item in items"
        :key="item._id"
        :command="item"
        class="draggable"
        @click="emit('itemClick', item)"
        @menu="emit('itemMenu', $event, item)"
      >
        <el-checkbox :value="item" class="select-box" />
      </Item>
    </VueDraggable>
  </el-checkbox-group>
  <el-empty v-else :description="$t('list.noData')" class="empty" />
</template>

<style scoped>
.export-group {
  font-size: inherit;
  line-height: inherit;
}

.command-list {
  font-size: inherit;
  line-height: inherit;
  padding: 10px;
  display: flex;
  gap: 10px;

  .draggable {
    transition: none;
    -webkit-user-drag: element;
  }

  &.grid-view {
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
  }

  &.list-view {
    flex-flow: column;
  }
}
.ghost {
  opacity: 0.5;
}

.select-box {
  display: none;
  align-items: flex-start;
  justify-content: flex-end;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  outline-offset: -2px;
  &:hover {
    outline: 2px dashed var(--el-color-primary);
  }
  &.is-checked {
    outline: 2px solid var(--el-color-primary);
  }
}

:deep(.select-box) {
  .el-checkbox__input {
    margin: 5px;
  }
  .el-checkbox__label {
    display: none;
  }
}

.is-dragging {
  .select-box {
    display: none !important;
  }
  :deep(.command-item) .menu-btn {
    display: none !important;
  }
}

.is-exporting {
  .select-box {
    display: inline-flex;
  }
  .command-item:hover .menu-btn {
    display: none !important;
  }
}

.empty {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
