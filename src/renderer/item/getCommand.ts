import { SpawnOptionsWithoutStdio } from 'child_process'
import { Command } from '@shared/typings'
import { parseCommand, parseCwd, parseOptions } from '@utils/commandUtil'

export default function getCommand(
  command: Command,
  inputIndex: number
): { command: string; options: SpawnOptionsWithoutStdio } {
  // 要执行的命令或可执行文件
  const cmd = parseCommand(command)

  // 命令执行目录
  const cwd = parseCwd(command as Command)

  // 命令参数
  const parsedOptions = parseOptions(command, inputIndex)
  const args = parsedOptions.flatMap(({ args }) => args!)

  // 如果有输出，确保输出目录存在
  const outputOption = parsedOptions.find((option) => option.output)
  if (outputOption) {
    const { dir } = window.api.parsePath(outputOption.output!)
    window.api.ensureDir(dir)
  }

  return {
    command: [cmd, ...args].join(' '),
    options: { cwd }
  }
}
