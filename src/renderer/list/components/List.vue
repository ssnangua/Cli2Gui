<script setup lang="ts">
import useData from '@store/useData'
import useListStore from '@store/useListStore'
import { Command } from '@shared/typings'
import Item from './Item.vue'

const { items } = useData()
const { viewMode, isExporting, isSelectAll, selectedItems } = useListStore()

const emit = defineEmits<{
  itemClick: [Command]
  itemMenu: [MouseEvent, Command]
}>()
</script>

<template>
  <el-checkbox-group
    v-if="items.length > 0"
    v-model="selectedItems"
    class="command-list"
    :class="[viewMode, isExporting ? 'is-exporting' : '']"
    @change="isSelectAll = $event.length === items.length"
  >
    <Item
      v-for="item in items"
      :key="item._id"
      :command="item"
      @click="emit('itemClick', item)"
      @menu="emit('itemMenu', $event, item)"
    >
      <el-checkbox :value="item" class="select-box" />
    </Item>
  </el-checkbox-group>
  <el-empty v-else :description="$t('list.noData')" class="empty" />
</template>

<style scoped>
.command-list {
  font-size: inherit;
  line-height: inherit;
  padding: 10px;
  display: flex;
  gap: 10px;

  &.grid-view {
    flex-flow: row wrap;
    justify-content: flex-start;
    align-content: flex-start;
  }

  &.list-view {
    flex-flow: column;
  }
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
  background-color: rgba(0, 0, 0, 0.01);
  &:hover {
    background-color: rgba(0, 0, 0, 0.3);
  }
  &.is-checked {
    outline: 2px solid var(--el-color-primary);
    outline-offset: -2px;
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
