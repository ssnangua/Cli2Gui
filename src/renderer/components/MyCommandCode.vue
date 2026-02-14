<script setup lang="ts">
import { ParsedCommandOption } from '@shared/typings'
import { computed, nextTick, watch } from 'vue'
import { parseCommand, parseOptions } from '@utils/commandUtil'
import useCurCommand from '@store/useCurCommand'

const { curCommand, inputIndex } = useCurCommand()

const cmd = computed(() => curCommand.value && parseCommand(curCommand.value))

const parsedOptions = computed<ParsedCommandOption[]>(() => {
  if (!curCommand.value) return []
  return parseOptions(curCommand.value, inputIndex.value)
})

watch(parsedOptions, () => {
  nextTick(() => {
    window.dispatchEvent(new Event('resize'))
  })
})
</script>

<template>
  <div v-if="cmd" class="my-command-code">
    <span class="option">
      <pre class="command">{{ cmd }}</pre>
    </span>
    <template v-for="(option, i) in parsedOptions" :key="i">
      <span class="option">
        <span class="space">&nbsp;</span>
        <pre v-if="option.key" class="option-key">{{ option.key }}</pre>
        <span v-if="option.key && !option.key.endsWith('=') && option.value" class="space"
          >&nbsp;</span
        >
        <pre v-if="option.value" class="option-value">{{ option.value }}</pre>
      </span>
    </template>
  </div>
</template>

<style scoped>
.my-command-code {
  flex-shrink: 0;
  padding: 8px 10px;
  background-color: var(--el-color-warning-light-9);
  /* box-shadow: var(--el-box-shadow-light); */
  text-align: left;
  word-break: break-all;
  user-select: text;
  cursor: text;
  overflow: hidden;
  font-size: 14px;
  max-height: 100px;
  overflow: auto;

  pre {
    display: inline;
    white-space: pre-wrap;
    margin: 0;
    padding: 0;
    font-family: Consolas, 'Courier New', monospace;
    line-height: 18px;
  }

  .command {
    color: var(--el-color-danger);
    font-weight: bold;
  }
  .option {
    display: inline-block;
    .space {
      word-spacing: 5px;
    }
    .option-key {
      color: var(--el-color-primary);
    }
    .option-value {
      color: var(--el-color-success);
    }
  }
}
</style>
