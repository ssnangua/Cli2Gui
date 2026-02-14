<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { cloneDeep } from 'lodash-es'
import '@store/useTheme'
import { widgetsMap } from '@widgets/widgets'
import useCurCommand from '@store/useCurCommand'
import useData from '@store/useData'
import { xterm } from './components/xterm'
import Log from './components/Log.vue'
import { execCommand } from './execCommand'

const showCommandCode = useStorage('show-command-code', false)
const showXtermDialog = ref(false)

const { curCommand, cwdOption, inputOption, outputOption, otherOptions, inputs } = useCurCommand()

const data = useData()
const id = new URLSearchParams(location.search).get('id')!
curCommand.value = cloneDeep(data.getItem(+id))

const isProcessing = ref(false)
let stopHandler: (() => Promise<void>) | null = null
let isStop = false

async function start(): Promise<void> {
  showXtermDialog.value = true
  xterm.scrollToBottom()

  isProcessing.value = true

  if (inputOption.value) {
    const length = inputs.value.length
    if (length > 0) {
      for (let i = 0; i < length; i++) {
        const input = inputs.value[i]
        if (input.state !== 'normal') continue
        input.state = 'processing'
        const result = await execCommand(curCommand.value!, i, (stop) => (stopHandler = stop))
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
    const result = await execCommand(curCommand.value!, 0, (stop) => (stopHandler = stop))
    console.log(result)
  }

  stopHandler = null
  isStop = false
  isProcessing.value = false
}

function stop(): void {
  isStop = true
  stopHandler?.()
    .then(() => {})
    .catch(() => {})
}

function toggleCommandCode(): void {
  showCommandCode.value = !showCommandCode.value
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
          :show-key="showCommandCode"
          class="input"
        />
      </div>

      <div class="options">
        <!-- 工作目录 -->
        <my-command-option
          v-if="cwdOption && !cwdOption.hidden"
          v-model="cwdOption"
          :widget="widgetsMap.cwd"
          :show-key="showCommandCode"
          class="option"
        />
        <!-- 输出 -->
        <my-command-option
          v-if="outputOption && !outputOption.hidden"
          v-model="outputOption"
          :widget="widgetsMap.output"
          :show-key="showCommandCode"
          class="option"
        />
        <!-- 配置项 -->
        <template v-for="(option, index) in otherOptions">
          <my-command-option
            v-if="!option.hidden"
            :key="index"
            v-model="otherOptions![index]"
            :widget="widgetsMap[option.widget]"
            :show-key="showCommandCode"
            class="option"
          />
        </template>
      </div>
    </el-main>

    <my-command-code v-if="showCommandCode" :command="curCommand" class="command-code" />

    <Log v-model="showXtermDialog" />

    <el-footer class="footer">
      <div class="footer-left">
        <el-tooltip :content="$t('item.command')" placement="top" effect="light" :offset="0">
          <el-link
            underline="never"
            :class="{ active: showCommandCode }"
            @click="toggleCommandCode"
          >
            <i class="iconfont icon-cmd"></i>
          </el-link>
        </el-tooltip>

        <!-- <el-divider direction="vertical" /> -->

        <el-tooltip :content="$t('item.log')" placement="top" effect="light" :offset="0">
          <el-link
            underline="never"
            :class="{ active: showXtermDialog }"
            @click="showXtermDialog = !showXtermDialog"
          >
            <i class="iconfont icon-terminal"></i>
          </el-link>
        </el-tooltip>
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

    .el-link {
      padding: 4px;

      i {
        font-size: 24px;
      }

      color: var(--el-color-info);
      &:hover {
        color: var(--el-text-color-regular);
      }
      &.active {
        color: var(--el-color-warning);
      }
    }
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
