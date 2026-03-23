import { Terminal } from '@xterm/xterm'
import { SpawnOptionsWithoutStdio } from 'child_process'

type XData = string | Uint8Array<ArrayBufferLike>

const COLOR = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
  MAGENTA: '\x1b[35m',
  CYAN: '\x1b[36m',
  WHITE: '\x1b[37m'
}
function writeXterm(xterm: Terminal, data: XData, color?: string): void {
  if (color) {
    xterm.write(color)
    xterm.write(data)
    xterm.write('\x1b[0m') // reset
  } else {
    xterm.write(data)
  }
}

interface RunResult {
  code: number
  error?: string
}

class Runner {
  private pid: number | undefined

  /**
   * 执行命令
   * @param command 要执行的命令
   * @param options 命令执行选项
   * @param xterm xterm对象，用于输出命令执行日志
   */
  constructor(
    public command: string,
    public options: SpawnOptionsWithoutStdio,
    public xterm: Terminal
  ) {}

  run(): Promise<RunResult> {
    return new Promise((resolve) => {
      const { command, options, xterm } = this

      const write = (data: XData, color?: string): void => writeXterm(xterm, data, color)

      write(`👉  ${command}\r\n\r\n`, COLOR.CYAN)

      const errors: string[] = []

      this.pid = window.api.runCommand({
        command,
        options,
        onStdoutData: (data) => write(data),
        onStderrData: (data) => {
          write(data, COLOR.YELLOW)
          errors.push(data)
        },
        onError: (error) => {
          write(`Error: ${error}\r\n`, COLOR.RED)
          console.log('Error:', error)
          errors.push(error)
          this.pid = undefined
          resolve({ code: 1, error })
        },
        onClose: (code) => {
          console.log(
            `%c${command}`,
            'background:#000;color:#fff;padding:2px 4px',
            `closed with code ${code}`
          )
        },
        onExit: (code) => {
          setTimeout(() => {
            write(
              `\r\n${code === 0 ? '🎉' : '❌'}  Exited with code ${code}\r\n\r\n`,
              code === 0 ? COLOR.GREEN : COLOR.RED
            )
            console.log(
              `%c${command}`,
              'background:#000;color:#fff;padding:2px 4px',
              `exited with code ${code}`
            )
            this.pid = undefined
            resolve({
              code,
              error: code !== 0 ? errors.at(-1) : undefined
            })
          }, 0)
        }
      })
    })
  }

  stop(): Promise<void> {
    return window.api.stopCommand(this.pid)
  }

  get isRunning(): boolean {
    return this.pid !== undefined
  }
}

export default Runner
