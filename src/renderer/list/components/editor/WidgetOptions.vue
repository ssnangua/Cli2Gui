<script setup lang="ts">
import { FileFilter } from 'electron'
import { useTemplateRef } from 'vue'
import { ComponentOption, CommandOption, WidgetOption, CommandBase } from '@shared/typings'
import { widgetsMap, commonOptions } from '@widgets/widgets'
import OptionsEditor from './OptionsEditor.vue'
import FileFiltersEditor from './FileFiltersEditor.vue'
import useCurCommand from '@store/useCurCommand'

const { curOption } = useCurCommand()

// ==========================================
//              控件可选项编辑器
// ==========================================
const optionsEditor = useTemplateRef('optionsEditor')
const fileFiltersEditor = useTemplateRef('fileFiltersEditor')
function showOptionSetting(data: CommandOption): void {
  if (data.options) {
    optionsEditor.value!.open(data.options)
  } else if (data.attrs?.filters) {
    fileFiltersEditor.value!.open(data.attrs?.filters as FileFilter[])
  }
}
function onOptionsEditorConfirm(options: ComponentOption[]): void {
  const data = curOption.value!
  data.options = options
  // 修正配置项的值
  if (Array.isArray(data.value)) {
    // 如果值为数组，过滤掉未在选项中出现的值
    data.value = data.value.filter((v) => options.some((o) => o.value === v))
  } else {
    // 如果值不在选项中，则重新选中第一项
    if (!options.some((o) => o.value === data.value)) {
      data.value = options[0].value
    }
  }
}
function onFileFiltersEditorConfirm(filters: FileFilter[]): void {
  curOption.value!.attrs!.filters = filters
}

// ==========================================
//               控件属性变更
// ==========================================
async function onOptionChange(option: WidgetOption): Promise<void> {
  console.log(curOption.value)
  if (option.valueKey === 'command' || option.valueKey === 'realPath') {
    // 注意：value 是有可能为 undefined 的，不过当变更的是 valueKey 时，value 必然有值
    const value = curOption.value!.value as CommandBase

    // 命令变更，自动获取命令真实路径、命令名字、命令图标、生成窗口图标
    if (option.valueKey === 'command' && value.command) {
      const file = await window.api.getCommandInfo(value.command as string)
      if (file) {
        Object.assign(value, {
          name: value.name || window.api.parsePath(file.realPath).name,
          icon: file.icon,
          realPath: file.realPath
        })
      } else {
        Object.assign(value, { icon: '', realPath: '' })
      }
    }

    // 路径变更，自动获取命令名字、命令图标、生成窗口图标
    if (option.valueKey === 'realPath' && value.realPath) {
      const file = await window.api.getFileInfo(value.realPath as string)
      if (file) {
        Object.assign(value, {
          name: value.name || window.api.parsePath(file.realPath).name,
          icon: file.icon,
          command: '',
          realPath: file.realPath
        })
      } else {
        Object.assign(value, { command: '', icon: '', window: { icon: '' } })
      }
    }
  }
}
</script>

<template>
  <div v-if="curOption" class="widget-options">
    <!-- 选项标签、选项键 -->
    <template v-for="key in ['label', 'key']">
      <my-widget-option
        v-if="curOption[key] !== undefined"
        :key="`data_${key}`"
        v-model="curOption[key]"
        :option="commonOptions[key]"
      />
    </template>

    <!-- 值 -->
    <my-widget-option
      v-if="curOption.widget !== 'base' && curOption.value !== undefined"
      v-model="curOption.value"
      class="value-option"
      :option="{
        label: 'widgetOptions.value',
        component: widgetsMap[curOption.widget].component,
        setting: widgetsMap[curOption.widget].setting,
        attrs: curOption.attrs,
        options: curOption.options
      }"
      @show-setting="showOptionSetting(curOption)"
    />

    <!-- 控件属性 -->
    <template v-for="option in widgetsMap[curOption.widget].options">
      <my-widget-option
        v-if="option.dataKey"
        v-show="!option.show || option.show(curOption)"
        :key="'data_' + option.dataKey"
        v-model="curOption[option.dataKey]"
        :option="option"
        @show-setting="showOptionSetting(curOption)"
        @change="onOptionChange"
      />
      <my-widget-option
        v-else-if="option.valueKey"
        v-show="!option.show || option.show(curOption)"
        :key="'value_' + option.valueKey"
        v-model="curOption.value![option.valueKey]"
        :option="option"
        @show-setting="showOptionSetting(curOption)"
        @change="onOptionChange"
      />
      <my-widget-option
        v-else-if="option.attrKey"
        v-show="!option.show || option.show(curOption)"
        :key="'attr_' + option.attrKey"
        v-model="curOption.attrs![option.attrKey]"
        :option="option"
        @show-setting="showOptionSetting(curOption)"
        @change="onOptionChange"
      />
    </template>

    <!-- 描述、必填项、只读、隐藏 -->
    <template v-for="key in ['description', 'required', 'readonly', 'hidden']">
      <my-widget-option
        v-if="curOption[key] !== undefined"
        :key="`data_${key}`"
        v-model="curOption[key]"
        :option="commonOptions[key]"
      />
    </template>
  </div>
  <div v-else>
    <el-empty :image-size="200" description="无配置项" />
  </div>

  <OptionsEditor ref="optionsEditor" @confirm="onOptionsEditorConfirm" />
  <FileFiltersEditor ref="fileFiltersEditor" @confirm="onFileFiltersEditorConfirm" />
</template>

<style scoped>
.value-option {
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);
  background: var(--el-bg-color-page);

  --el-fill-color-blank: var(--el-bg-color);
  --mark-value: var(--el-bg-color-page);
}
</style>
