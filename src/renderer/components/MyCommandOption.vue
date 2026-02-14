<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { ElInput } from 'element-plus'
import { Widget, CommandOption } from '@shared/typings'
import { getSliderMarks } from '@utils/elUtil'

const data = defineModel<CommandOption>()

const { widget, showKey = true } = defineProps<{
  widget: Widget
  showKey?: boolean
}>()

const key = computed(() => {
  return data.value?.key?.replace(/ /g, '<i class="iconfont icon-space"></i>')
})

const joinWith = computed(() => {
  return data.value?.joinWith?.replace(/ /g, '<i class="iconfont icon-space"></i>')
})

const marks = computed(() => {
  return widget.component === 'el-slider' && data.value
    ? getSliderMarks(
        data.value.attrs!.min as number,
        data.value.attrs!.max as number,
        data.value.value as number,
        data.value.readonly
      )
    : null
})

const emit = defineEmits<{
  showSetting: [Widget]
  change: [Widget]
}>()

function onChange(): void {
  emit('change', widget)
}

const componentRef = useTemplateRef('componentRef')
function resizeTextarea(): void {
  if (componentRef.value) {
    ;(componentRef.value as typeof ElInput).resizeTextarea()
  }
}
onMounted(() => {
  if (data.value?.attrs?.type === 'textarea') {
    window.addEventListener('resize', resizeTextarea)
  }
})
onUnmounted(() => {
  if (data.value?.attrs?.type === 'textarea') {
    window.removeEventListener('resize', resizeTextarea)
  }
})
</script>

<template>
  <el-card
    v-if="data"
    class="my-command-option-card"
    :widget="data.widget"
    body-class="my-command-option-card-body"
  >
    <div v-if="data.label || ((key || joinWith) && showKey)" class="my-command-option-header">
      <el-text v-if="data.label" class="label" :class="{ 'is-required': data.required }">
        {{ data.label }}
      </el-text>
      <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
      <el-tag v-if="key && showKey" type="primary" class="label-tag" v-html="key"></el-tag>
      <!-- eslint-disable-next-line vue/no-v-html vue/no-v-text-v-html-on-component -->
      <el-tag v-if="joinWith && showKey" type="info" class="label-tag" v-html="joinWith"></el-tag>
    </div>

    <div class="component" :class="'component_' + widget.component">
      <component
        :is="widget.component"
        ref="componentRef"
        v-bind="data.attrs"
        v-model="data.value"
        :spellcheck="false"
        :marks="marks"
        :disabled="data.readonly"
        @change="onChange"
      >
        <template v-if="widget.component === 'el-radio-group'">
          <el-radio v-for="item in data.options" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-radio>
        </template>

        <template v-else-if="widget.component === 'el-checkbox-group'">
          <el-checkbox v-for="item in data.options" :key="item.value" :value="item.value">
            {{ item.label }}
          </el-checkbox>
        </template>

        <template v-else-if="widget.component === 'el-select'">
          <el-option
            v-for="item in data.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </template>
        <template v-if="data.attrs?.content">
          {{ data.attrs.content }}
        </template>
      </component>
    </div>

    <my-description v-if="data.description" :content="data.description" />
  </el-card>
</template>

<style scoped>
.my-command-option-card {
  /* padding: 10px; */
  border-radius: 4px;

  .my-command-option-header {
    height: 32px;
    display: flex;
    align-items: center;
    position: relative;

    .label {
      font-weight: bold;
      margin-right: 10px;
    }
    & + .component {
      margin-top: 5px;
      position: relative;
      z-index: 1;
    }
  }

  .is-required::before {
    content: '*';
    color: var(--el-color-danger);
    margin-right: 4px;
  }

  .label-tag {
    margin-right: 10px;
  }
}

:deep(.my-command-option-card-body) {
  position: relative;
  padding: 10px;

  .component_el-slider {
    padding: 0 10px 10px 10px;
  }

  .my-command-option-header + .component_my-file-list {
    margin-top: -30px;
  }
}
</style>
