<script setup lang="ts">
import { computed, nextTick, watch } from 'vue'
import { ElInput } from 'element-plus'
import useCurCommand from '@store/useCurCommand'
import MyOutput from '@components/MyOutput.vue'

const { inputOption } = useCurCommand()

const model = defineModel<{
  outDir: string
  outName: string
  overwrite: boolean
  removeInput: boolean
}>()

const { disabled } = defineProps<{
  disabled?: boolean
}>()

const isDirectory = computed(() => inputOption.value?.attrs!.openDirectory)
watch(isDirectory, () => {
  model.value!.outName = ''
})

function toggleFormatFlag(inputRef: unknown, key: string, value: string, to: number): void {
  const innerInputRef = (inputRef as typeof MyOutput).inputRef
  if (innerInputRef) inputRef = innerInputRef
  const inputEl = (inputRef as typeof ElInput).input
  inputEl.focus()
  setTimeout(() => {
    if (!model.value) return
    let start = inputEl.selectionStart
    let end = inputEl.selectionEnd
    const format = model.value[key]
    const index = format.indexOf(value)
    if (index !== -1) {
      model.value[key] = format.replace(value, '')
      start = end = index
    } else {
      // if (start !== end) {
      //   model.value[key] = format.slice(0, start) + value + format.slice(end)
      //   end = start + value.length
      // }
      model.value[key] = format.slice(0, to) + value + format.slice(to)
      start = end = to > 0 ? to : to + value.length
    }
    nextTick(() => {
      inputEl.selectionStart = start
      inputEl.selectionEnd = end
      inputEl.focus()
    })
  }, 0)
}
</script>

<template>
  <div v-if="inputOption" class="my-output">
    <el-form v-if="model" :model="model" label-width="auto">
      <el-form-item :label="$t('widgets.output.component.outDir')">
        <el-tooltip placement="top-start" effect="light" :offset="1" :show-arrow="false">
          <my-file-selector
            ref="outDirInput"
            v-model="model.outDir"
            :disabled="disabled"
            :open-directory="true"
            placeholder="{DIR}"
            style="width: 100%"
          ></my-file-selector>

          <template #content>
            <div class="format-toolbar">
              <el-button
                type="primary"
                size="small"
                :disabled="disabled"
                @click="toggleFormatFlag($refs.outDirInput, 'outDir', '{DIR}', 0)"
              >
                {{ $t('widgets.output.component.inputDir') }}
              </el-button>
            </div>
          </template>
        </el-tooltip>
      </el-form-item>

      <el-form-item :label="$t('widgets.output.component.outName')">
        <el-tooltip placement="bottom-start" effect="light" :offset="1" :show-arrow="false">
          <el-input
            ref="outNameInput"
            v-model="model.outName"
            :disabled="disabled"
            :placeholder="isDirectory ? '{NAME}' : '{NAME}{EXT}'"
          ></el-input>

          <template #content>
            <div class="format-toolbar">
              <el-button
                type="primary"
                size="small"
                :disabled="disabled"
                @click="toggleFormatFlag($refs.outNameInput, 'outName', '{NO}', 0)"
              >
                {{ $t('widgets.output.component.inputNo') }}
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="disabled"
                @click="toggleFormatFlag($refs.outNameInput, 'outName', '{NAME}', 0)"
              >
                {{ $t('widgets.output.component.inputName') }}
              </el-button>
              <el-button
                v-if="!isDirectory"
                type="primary"
                size="small"
                :disabled="disabled"
                @click="
                  toggleFormatFlag($refs.outNameInput, 'outName', '{EXT}', model.outName.length)
                "
              >
                {{ $t('widgets.output.component.inputExt') }}
              </el-button>
            </div>
          </template>
        </el-tooltip>
      </el-form-item>

      <el-form-item>
        <template #label>{{ $t('widgets.output.component.overwrite') }}</template>
        <el-switch v-model="model.overwrite" :disabled="disabled"></el-switch>
        <my-help-tooltip :content="$t('widgets.output.component.overwriteTips')" :offset="0" />
      </el-form-item>
    </el-form>
  </div>

  <div v-else>
    <my-empty>
      <el-text type="info">{{ $t('widgets.output.component.noInput') }}</el-text>
    </my-empty>
  </div>
</template>

<style scoped>
.my-output {
  :deep(.el-form-item) {
    margin-bottom: 0;
    + .el-form-item {
      margin-top: 10px;
    }
  }

  :deep(.my-description) {
    margin-top: 0;
    width: 100%;
  }
}
.format-toolbar {
  .el-button + .el-button {
    margin-left: 5px;
  }
}
</style>
