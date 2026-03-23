<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import '@store/useTheme'
import { widgetsMap } from '@widgets/widgets'
import useI18n from '@store/useI18n'
import useCurCommand from '@store/useCurCommand'
import useData from '@store/useData'
import Runner from '@utils/Runner'
import getCommand from './getCommand'

const { locale, t } = useI18n()

const { curCommand, cwdOption, inputOption, outputOption, otherOptions, inputs } = useCurCommand()

const data = useData()
const id = new URLSearchParams(location.search).get('id')!
curCommand.value = cloneDeep(data.getItem(+id))

const { name, command } = curCommand.value!.base
function updateTitle(): void {
  document.title = name || command || t('list.unnamed')
}
updateTitle()
watch(locale, updateTitle)

const isShowCommandCode = useStorage('is-show-command-code', false)
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

const executable = !!curCommand.value!.base.command || !!curCommand.value!.base.realPath

const isProcessing = ref(false)
let runner: Runner | null = null
let isStop = false

async function start(): Promise<void> {
  const { xterm } = logger.value

  showLogger(true)
  xterm.scrollToBottom()

  isProcessing.value = true

  if (inputOption.value) {
    const length = inputs.value.length
    if (length > 0) {
      for (let inputIndex = 0; inputIndex < length; inputIndex++) {
        const input = inputs.value[inputIndex]
        if (input.state !== 'normal') continue
        input.state = 'processing'
        const { command, options } = getCommand(curCommand.value!, inputIndex)
        runner = new Runner(command, options, xterm)
        const result = await runner.run()
        console.log(result)
        if (isStop) {
          Object.assign(input, {
            code: 2,
            state: 'error',
            error: result.error
          })
          break
        } else {
          Object.assign(input, {
            code: result.code,
            state: result.code === 0 ? 'success' : 'error',
            error: result.error
          })
        }
      }
    }
  } else {
    const { command, options } = getCommand(curCommand.value!, 0)
    runner = new Runner(command, options, xterm)
    const result = await runner.run()
    console.log(result)
  }

  runner = null
  isStop = false
  isProcessing.value = false
}

function stop(): void {
  isStop = true
  runner?.stop()
}

function toggleCommandCode(): void {
  isShowCommandCode.value = !isShowCommandCode.value
  // 触发 resize 事件，让 input 控件重新计算表格高度
  nextTick(() => window.dispatchEvent(new Event('resize')))
}
</script>

<template>
  <el-container>
    <el-main class="main">
      <div v-if="inputOption && !inputOption.hidden" class="input-option">
        <!-- 输入 -->
        <my-command-option
          v-model="inputOption"
          :widget="widgetsMap.input"
          :show-key="isShowCommandCode"
          class="input"
        />
      </div>

      <div class="options">
        <!-- 工作目录 -->
        <my-command-option
          v-if="cwdOption && !cwdOption.hidden"
          v-model="cwdOption"
          :widget="widgetsMap.cwd"
          :show-key="isShowCommandCode"
          class="option"
        />
        <!-- 输出 -->
        <my-command-option
          v-if="outputOption && !outputOption.hidden"
          v-model="outputOption"
          :widget="widgetsMap.output"
          :show-key="isShowCommandCode"
          class="option"
        />
        <!-- 配置项 -->
        <template v-for="(option, index) in otherOptions">
          <my-command-option
            v-if="!option.hidden"
            :key="index"
            v-model="otherOptions![index]"
            :widget="widgetsMap[option.widget]"
            :show-key="isShowCommandCode"
            class="option"
          />
        </template>
      </div>
    </el-main>

    <my-command-code
      v-if="executable && isShowCommandCode"
      :command="curCommand"
      class="command-code"
    />

    <my-logger v-if="executable" ref="logger" v-model="isShowLogger" />

    <el-footer v-if="executable" class="footer">
      <div class="footer-left">
        <my-toggler v-model="isShowCommandCode" @click="toggleCommandCode">
          {{ $t('item.command') }}
        </my-toggler>
        <!-- <el-divider direction="vertical" /> -->
        <my-toggler v-model="isShowLogger" @click="showLogger(!isShowLogger)">
          {{ $t('item.log') }}
        </my-toggler>
      </div>

      <div class="footer-right">
        <el-button
          v-if="!isProcessing"
          type="primary"
          :disabled="inputOption && (inputOption.value as string[]).length === 0"
          @click="start"
        >
          <i class="iconfont icon-start"></i>
          <span>{{ $t('item.run') }}</span>
        </el-button>
        <el-button v-else type="danger" @click="stop">
          <i class="iconfont icon-stop"></i>
          <span>{{ $t('item.stop') }}</span>
        </el-button>
      </div>
    </el-footer>
  </el-container>
</template>

<style scoped>
.main {
  --mark-value: var(--el-bg-color-overlay);

  padding: 0;
  flex: auto;
  display: flex;
  overflow: hidden;
  border-top: 1px solid var(--el-border-color);
  border-bottom: 1px solid var(--el-border-color);

  .input-option {
    flex: auto;
    display: flex;
    padding: 10px;

    .input {
      flex: auto;
      display: flex;
      flex-flow: column;
    }
  }

  .options {
    width: 300px;
    flex-shrink: 0;
    overflow: hidden auto;
    padding: 10px 10px 10px 0;

    .option + .option {
      margin-top: 10px;
    }
  }

  &:not(:has(.input-option)) .options {
    flex: auto;
    padding-left: 10px;
  }

  :deep([widget='divider']) {
    padding: 0 10px;
  }

  :deep([widget='input']) {
    .el-card__body {
      display: flex;
      flex-flow: column;

      .component {
        flex: auto;
        display: flex;
        height: 0;

        .my-file-list {
          flex: auto;
          width: 0;
        }
      }
    }
  }
}

.command-code {
  border-bottom: 1px solid var(--el-border-color);
}

.footer {
  height: auto;
  padding: 10px;
  display: flex;
  align-items: center;
  background: var(--el-bg-color);

  .footer-left {
    flex: auto;
    flex-shrink: 0;
  }

  .footer-right {
    .el-button {
      i:has(+ span) {
        margin-right: 5px;
      }
    }
  }
}

:deep(.el-card[widget='divider']) {
  padding: 0;
  border: none;
  box-shadow: none;
  background: var(--el-bg-color-page);

  .el-card__body {
    padding: 0;
  }
  .el-divider__text {
    background: var(--el-bg-color-page);
  }
}
</style>
