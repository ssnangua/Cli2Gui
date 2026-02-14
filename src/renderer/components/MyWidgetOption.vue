<script setup lang="ts">
import { computed } from 'vue'
import {
  InfoFilled,
  SuccessFilled,
  WarningFilled,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import { WidgetOption } from '@shared/typings'
import { getSliderMarks } from '@utils/elUtil'

const TYPE_ICON = {
  primary: InfoFilled,
  success: SuccessFilled,
  info: InfoFilled,
  warning: WarningFilled,
  error: CircleCloseFilled
}

const model = defineModel<unknown>()

const { option, disabled } = defineProps<{
  option: WidgetOption
  disabled?: boolean
}>()

const marks = computed(() => {
  return option.component === 'el-slider'
    ? getSliderMarks(
        option.attrs!.min as number,
        option.attrs!.max as number,
        model.value as number
      )
    : null
})

const emit = defineEmits<{
  showSetting: [WidgetOption]
  change: [WidgetOption]
}>()

function onChange(): void {
  emit('change', option)
}
</script>

<template>
  <div class="my-widget-option">
    <div v-if="option.label || option.tips" class="header">
      <el-text class="label" :class="{ 'is-required': option.required }">
        {{ option.label ? $t(option.label) : '' }}
      </el-text>
      <my-help-tooltip
        v-if="option.dataKey === 'description'"
        icon="markdown"
        :content="$t('widgetOptions.markdownTips')"
        placement="top"
      />

      <my-help-tooltip v-if="option.tips" :content="$t(option.tips)" />

      <el-link
        v-if="option.setting"
        underline="never"
        class="setting-btn"
        :title="$t('widgetOptions.setting')"
        @click="emit('showSetting', option)"
      >
        <i class="iconfont icon-setting"></i>
      </el-link>
    </div>

    <div class="component" :class="'component_' + option.component">
      <component
        :is="option.component"
        v-model="model"
        v-bind="option.attrs"
        :disabled="disabled"
        :spellcheck="false"
        :marks="marks"
        @change="onChange"
      >
        <template v-if="option.component === 'el-radio-group'">
          <el-radio v-for="item in option.options" :key="item.value" :value="item.value">
            {{ item.labelKey ? $t(item.labelKey) : item.label }}
          </el-radio>
        </template>

        <template v-else-if="option.component === 'el-checkbox-group'">
          <el-checkbox v-for="item in option.options" :key="item.value" :value="item.value">
            {{ item.labelKey ? $t(item.labelKey) : item.label }}
          </el-checkbox>
        </template>

        <template v-else-if="option.component === 'el-select'">
          <el-option
            v-for="item in option.options"
            :key="item.value"
            :label="item.labelKey ? $t(item.labelKey) : item.label"
            :value="item.value"
          >
            <el-text v-if="item.type" :type="item.type === 'error' ? 'danger' : item.type">
              <el-icon><component :is="TYPE_ICON[item.type]" /></el-icon>
              {{ item.labelKey ? $t(item.labelKey) : item.label }}
            </el-text>
          </el-option>
        </template>
        <template v-if="option.attrs?.content">
          {{ option.attrs.content }}
        </template>
      </component>
    </div>

    <my-description v-if="option.description" :content="$t(option.description)" />
  </div>
</template>

<style scoped>
.my-widget-option {
  padding: 10px;

  .header {
    height: 32px;
    display: flex;
    align-items: center;
    position: relative;

    .label {
      font-weight: bold;
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

  .key {
    margin-left: 10px;
  }

  .setting-btn {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 32px;
  }

  .component_el-slider {
    padding: 0 10px 10px 10px;
  }
  .header + .component_my-file-list {
    margin-top: -30px;
  }

  /* :deep(textarea) {
    max-height: 200px;
  } */
}
</style>
