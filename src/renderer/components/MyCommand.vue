<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, useTemplateRef } from 'vue'
import Runner from '@utils/Runner'

const model = defineModel<{
  command: string
  cwd: string
}>()

const props = defineProps<{
  disabled?: boolean
}>()

const logger = useTemplateRef('logger')
const isShowLogger = ref(false)
function showLogger(show: boolean): void {
  if (show) {
    isShowLogger.value = true
    logger.value.focus()
  } else {
    isShowLogger.value = false
  }
}

let runner: Runner | null = null
let isRunning = ref(false)

async function run(): Promise<void> {
  const { xterm } = logger.value
  const { command, cwd } = model.value!

  showLogger(true)
  xterm.scrollToBottom()

  isRunning.value = true

  runner = new Runner(command, { cwd }, xterm)
  const result = await runner.run()
  console.log(result)

  runner = null
  isRunning.value = false
}

function stop(): void {
  runner?.stop()
}

onMounted(() => {
  window.addEventListener('beforeunload', beforeunload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', beforeunload)
})
async function beforeunload(): Promise<void> {
  if (runner) await runner.stop()
  alert('已卸载')
}
</script>

<template>
  <div class="my-command">
    <el-form v-if="model" :model="model" label-width="auto">
      <el-form-item :label="$t('widgets.command.component.command')">
        <my-file-selector v-model="model.command" :exectuble="true" :disabled="props.disabled" />
      </el-form-item>
      <el-form-item v-if="!props.disabled" :label="$t('widgets.command.component.cwd')">
        <my-file-selector v-model="model.cwd" :open-directory="true" />
      </el-form-item>
    </el-form>
    <div class="controls">
      <my-toggler v-model="isShowLogger" @click="showLogger(!isShowLogger)">
        {{ $t('widgets.command.component.log') }}
      </my-toggler>

      <el-button v-if="!isRunning" type="primary" :disabled="!model?.command" @click="run">
        <i class="iconfont icon-start"></i>
        <span>{{ $t('widgets.command.component.run') }}</span>
      </el-button>
      <el-button v-else type="danger" @click="stop">
        <i class="iconfont icon-stop"></i>
        <span>{{ $t('widgets.command.component.stop') }}</span>
      </el-button>
    </div>
    <my-logger ref="logger" v-model="isShowLogger" />
  </div>
</template>

<style scoped>
.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;

  .el-button {
    i:has(+ span) {
      margin-right: 5px;
    }
  }
}
</style>
