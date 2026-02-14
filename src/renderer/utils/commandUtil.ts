import { toRaw } from 'vue'
import { dayjs } from 'element-plus'
import { Command, CommandOption, ParsedCommandOption } from '@shared/typings'
import useData from '@store/useData'

const { parsePath, joinPath } = window.api
const data = useData()

// 获取输出路径
function getOutput(command: Command, inputIndex: number): string {
  const inputOption = command.options.find((option) => option.widget === 'input')
  const outputOption = command.options.find((option) => option.widget === 'output')
  if (!inputOption || !outputOption) return ''

  const input = (inputOption.value as string[])[inputIndex]
  if (!input) return ''

  const value = outputOption.value as {
    outDir: string
    outName: string
    overwrite: boolean
  }
  const isDirectory = inputOption.attrs?.openDirectory
  const { dir, name, ext } = parsePath(input)
  const outDir = (value.outDir || '{DIR}').replace(/{DIR}/g, dir)
  const outName = (value.outName || (isDirectory ? '{NAME}' : '{NAME}{EXT}'))
    .replace(/{NO}/g, String(inputIndex + 1))
    .replace(/{NAME}/g, name)
    .replace(/{EXT}/g, ext)
  return window.api.uniquePath(joinPath(outDir, outName))
}

export function parseValue(value: string): string {
  const formatted = value.replace(/\n/g, ' ').replace(/"/g, '\\"')
  return formatted.includes(' ') ? `"${formatted}"` : formatted
}

export function parseKeyValue(key: string, value: string): ParsedCommandOption {
  value = parseValue(value)
  return key
    ? {
        key,
        value,
        args: key.endsWith('=') ? [key + value] : [key, value]
      }
    : { value, args: [value] }
}

/**
 * 解析命令
 */
export function parseCommand(command: Command): string {
  return parseValue(command.base.command || command.base.realPath)
}

/**
 * 解析工作目录
 */
export function parseCwd(command: Command): string | undefined {
  const cwdOption = command.options.find((option) => option.widget === 'cwd')
  if (cwdOption?.value) return cwdOption.value as string
  // 如果未指定，默认为可执行文件所在目录
  if (command.base.realPath) return window.api.parsePath(command.base.realPath).dir
  return undefined
}

type OptionParser = (
  option: CommandOption,
  inputIndex?: number,
  command?: Command
) => ParsedCommandOption[]

const optionParser: Record<string, OptionParser> = {
  checkbox(option) {
    const key = option.key as string
    const value = option.value as string[]
    const joinWith = option.joinWith as string

    if (value.length === 0) return []

    if (key.endsWith('=') || joinWith) {
      // 如果key以`=`结尾，或者设置了拼接符，将值拼接为一个参数
      return [parseKeyValue(key, value.join(joinWith))]
    } else {
      // 否则，将每个选项都作为单独的命令行参数
      return (key ? [key] : []).concat(value).map((value) => parseKeyValue('', value))
    }
  },

  input(option, inputIndex) {
    const key = option.key as string
    const value = option.value as string[]
    if (value.length === 0) return []
    return [parseKeyValue(key, value[inputIndex!])]
  },

  number(option) {
    const key = option.key as string
    const value = option.value as number
    return [parseKeyValue(key, String(value))]
  },

  open(option) {
    const key = option.key as string
    const value = option.value as string
    if (!value) return []
    return [parseKeyValue(key, value)]
  },

  output(option, inputIndex, command) {
    const key = option.key as string
    const value = getOutput(command!, inputIndex!)
    if (!value) return []
    return [
      {
        output: value,
        ...parseKeyValue(key, value)
      }
    ]
  },

  radio(option) {
    const key = option.key as string
    const value = option.value as string
    return [parseKeyValue(key, value)]
  },

  select(option) {
    return optionParser.radio(option)
  },

  slider(option) {
    return optionParser.number(option)
  },

  switch(option) {
    const key = option.key as string
    const value = option.value as boolean
    return key && value ? [{ key: key, args: [key] }] : []
  },

  text(option) {
    const key = option.key as string
    const value = option.value as string
    if (!value) return []
    return [parseKeyValue(key, value)]
  }
}

/**
 * 解析命令选项
 * @param command 命令
 * @param inputIndex 输入控件的值的索引（用于获取输入文件路径，以计算输出文件路径）
 * @returns 解析后的选项（key 和 value 用于 MyCommandCode 组件渲染，args 是执行命令时的命令行参数）
 */
export function parseOptions(command: Command, inputIndex: number): ParsedCommandOption[] {
  const parsedOptions: ParsedCommandOption[] = []
  for (const option of command.options) {
    const parser = optionParser[option.widget]
    if (parser) {
      parsedOptions.push(...parser(option, inputIndex, command))
    }
  }
  return parsedOptions
}

/**
 * 导出命令
 * @param commands 要导出的命令列表
 */
export async function exportCommands(commands: Command[]): Promise<void> {
  const downloadsPath = await window.api.getPath('downloads')
  const version = await window.api.getVersion()
  const filename = [
    'Cli2Gui',
    ...(commands.length === 1 ? [commands[0].base.name] : []),
    dayjs().format('YYYY_M_D')
  ].join('_')
  const filePath = window.api.uniquePath(window.api.joinPath(downloadsPath, filename + '.json'))
  await window.api
    .showSaveDialog({
      defaultPath: filePath,
      buttonLabel: '导出',
      filters: [{ name: 'JSON', extensions: ['json'] }]
    })
    .then((result) => {
      if (!result.canceled && result.filePath) {
        const json = {
          cli2gui: version,
          data: commands.map(toRaw)
        }
        window.api.exportData(result.filePath, json)
      }
    })
    .catch(() => {})
}

/**
 * 导入命令
 * @returns 导入的命令列表
 */
export async function importCommands(jsonFiles?: string[]): Promise<void> {
  if (!jsonFiles) {
    jsonFiles = (
      await window.api.showOpenDialog({
        buttonLabel: '导入',
        filters: [{ name: 'JSON', extensions: ['json'] }]
      })
    ).filePaths
  }

  for (const jsonFile of jsonFiles) {
    const json = await window.api.importData(jsonFile)
    if (json) {
      const items = json.data.filter((item) => !data.hasItem(item._id)).map(fixItem)
      data.items.value.push(...items)
    }
  }
}

function fixItem(item: Command): Command {
  if (item._ver === 1) {
    // 兼容处理
  }
  return item
}
