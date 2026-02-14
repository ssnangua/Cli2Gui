import { computed, ref } from 'vue'
import { Command, CommandOption } from '@shared/typings'

const curCommand = ref<Command>() // 当前操作的命令
const curOption = ref<CommandOption>() // 当前操作的控件
const inputIndex = ref(0) // input控件当前选中项的索引
const inputTableHeight = ref(0) // input控件表格的高度

function findOption(widget: string): CommandOption | undefined {
  return curCommand.value?.options.find((option) => option.widget === widget)
}
const cwdOption = computed(() => findOption('cwd'))
const inputOption = computed(() => findOption('input'))
const outputOption = computed(() => findOption('output'))
const otherOptions = computed(() =>
  curCommand.value?.options.filter(({ widget }) => {
    return widget !== 'command' && widget !== 'cwd' && widget !== 'input' && widget !== 'output'
  })
)

interface InputItem {
  path: string
  selected: boolean
  state: 'normal' | 'processing' | 'success' | 'error'
  code?: number
  error?: string
}
const inputs = ref<InputItem[]>([])

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useCommand() {
  return {
    curCommand,
    curOption,
    inputIndex,
    inputTableHeight,
    cwdOption,
    inputOption,
    outputOption,
    otherOptions,
    inputs
  }
}

export default useCommand
