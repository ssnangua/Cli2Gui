import { Command } from '@shared/typings'
import { parseCommand, parseCwd, parseOptions } from '@utils/commandUtil'
import { xterm } from './components/xterm'

const COLOR = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m'
}
function write(data: string | Uint8Array<ArrayBufferLike>, color?: string): void {
  if (color) {
    xterm.write(color)
    xterm.write(data)
    xterm.write('\x1b[0m') // reset
  } else {
    xterm.write(data)
  }
}

interface RunCommandResult {
  code: number
  error?: string
}

/**
 * 执行命令
 * @param command 要执行的命令
 * @param inputIndex 输入索引
 * @param stop 停止执行命令的回调函数
 * @returns { code: number; error: string } 执行结果
 */
export function execCommand(
  command: Command,
  inputIndex: number,
  stop: (stop: () => Promise<void>) => void
): Promise<RunCommandResult> {
  return new Promise((resolve) => {
    // 要执行的命令或可执行文件
    const cmd = parseCommand(command)

    // 命令执行目录
    const cwd = parseCwd(command)

    // 命令参数
    const parsedOptions = parseOptions(command, inputIndex)
    const args = parsedOptions.flatMap(({ args }) => args!)

    // 如果有输出，确保输出目录存在
    const outputOption = parsedOptions.find((option) => option.output)
    if (outputOption) {
      const { dir } = window.api.parsePath(outputOption.output!)
      window.api.ensureDir(dir)
    }

    write(`👉  ${cmd.includes(' ') ? `"${cmd}"` : cmd} ${args.join(' ')}\r\n\r\n`, COLOR.CYAN)

    const errors: string[] = []

    const pid = window.api.execCommand({
      command: cmd,
      args,
      options: { cwd, shell: true },
      onStdoutData: (data) => write(data),
      onStderrData: (data) => {
        write(data, COLOR.YELLOW)
        errors.push(data)
      },
      onError: (error) => {
        write(`Error: ${error}\r\n`, COLOR.RED)
        console.log('error', error)
        errors.push(error)
        resolve({ code: 1, error })
      },
      onClose: (code) => {
        console.log(`${cmd} closed with code ${code}`)
      },
      onExit: (code) => {
        setTimeout(() => {
          write(
            `\r\n${code === 0 ? '🎉' : '❌'}  ${cmd} exited with code ${code}\r\n\r\n`,
            code === 0 ? COLOR.GREEN : COLOR.RED
          )
          console.log(`${cmd} exited with code ${code}`)
          resolve({
            code,
            error: code !== 0 ? errors.at(-1) : undefined
          })
        }, 0)
      }
    })

    stop(() => {
      return window.api.stopCommand(pid)
    })
  })
}
