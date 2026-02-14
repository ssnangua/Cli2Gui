<script setup lang="ts">
import { onMounted } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { widgetsMap } from '@widgets/widgets'
import useCurCommand from '@store/useCurCommand'

const { curCommand, curOption } = useCurCommand()

function selectIndex(index: number): void {
  if (curCommand.value) {
    const option = curCommand.value.options[index]
    if (option === curOption.value) return
    curCommand.value.options.forEach((widget) => (widget._selected = false))
    curOption.value = option
    curOption.value._selected = true
    emit('selectChange', index)
  }
}

function removeOption(index: number): void {
  curCommand.value?.options.splice(index, 1)
  selectIndex(index - 1)
}

const emit = defineEmits<{
  selectChange: [number]
}>()

onMounted(() => {
  selectIndex(0)
})
</script>

<template>
  <VueDraggable
    v-if="curCommand"
    v-model="curCommand.options"
    class="command-options"
    group="options"
    :animation="150"
    draggable=".draggable"
    @add="selectIndex($event.newIndex)"
  >
    <div
      v-for="(option, index) in curCommand!.options"
      :key="option._key"
      :field="option._key"
      class="drag-item"
      :class="{
        draggable: index > 0,
        selected: option._selected
      }"
      @click="selectIndex(index)"
    >
      <my-command-option
        v-model="curCommand!.options[index]"
        :widget="widgetsMap[option.widget]"
        class="command-option"
      />
      <div class="drag-item-cover">
        <el-button
          v-if="index > 0"
          type="danger"
          class="cover-btn remove-btn"
          @click.stop="removeOption(index)"
        >
          <i class="iconfont icon-remove"></i>
        </el-button>
      </div>
    </div>
  </VueDraggable>
</template>

<style scoped>
.command-options {
  flex: auto;
  overflow: hidden scroll;
  padding: 10px;

  --mark-value: var(--el-bg-color-overlay);
}

.drag-item {
  position: relative;

  cursor: pointer;
  &.draggable {
    -webkit-user-drag: element;
  }

  & + .drag-item {
    margin-top: 10px;
  }
}

.command-option {
  pointer-events: none;
}

.drag-item-cover {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.01);
  /* &:hover {
    outline: dotted 1px var(--el-color-primary);
  } */
}

.cover-btn {
  width: 20px;
  height: 20px;
  display: none;
  position: absolute;
  border-radius: 0;
  padding: 10px;

  &.remove-btn {
    top: 0;
    right: 0;
    cursor: pointer;
  }
}

.drag-item.selected {
  .drag-item-cover {
    outline: 2px solid var(--el-color-primary);
    .cover-btn {
      display: inline-flex;
    }
  }
}

:deep(.el-divider__text) {
  background-color: var(--el-card-bg-color);
}
</style>
