import { ChildProcessWithoutNullStreams, spawn } from 'child_process'
import treekill from 'tree-kill'
import iconv from 'iconv-lite'
import jschardet from 'jschardet'
import { RunCommandOptions } from '@shared/typings'

function decodeData(callback) {
  return (data) => {
    const encoding = jschardet.detect(data).encoding
    const decoded = iconv.decode(data, encoding || 'utf-8')
    callback(decoded)
  }
}

const childMap = new Map<number, ChildProcessWithoutNullStreams>()

export function execCommand({
  command,
  args = [],
  options = {},
  onError,
  onExit,
  onDisconnect,
  onClose,
  onStdoutData,
  onStderrData
}: RunCommandOptions): number | undefined {
  const child = spawn(command, args, options)
  if (child.pid) childMap.set(child.pid, child)
  if (onStdoutData) child.stdout.on('data', decodeData(onStdoutData))
  if (onStderrData) child.stderr.on('data', decodeData(onStderrData))
  if (onDisconnect) child.on('disconnect', onDisconnect)
  if (onClose) child.on('close', onClose)
  child.on('error', (err) => {
    if (child.pid) childMap.delete(child.pid)
    if (onError) onError(err)
  })
  child.on('exit', (code, signal) => {
    if (child.pid) childMap.delete(child.pid)
    if (onExit) onExit(code, signal)
  })
  return child.pid
}

export function stopCommand(pid: number | undefined): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = pid && childMap.get(pid)
    if (child) {
      treekill(pid, (error) => {
        childMap.delete(pid)
        if (error) reject(error)
        else resolve()
      })
    } else {
      resolve()
    }
  })
}
