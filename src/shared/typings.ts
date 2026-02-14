import { SpawnOptionsWithoutStdio } from 'child_process'

export interface AppInfo {
  name: string
  version: string
  electron: string
  chrome: string
  node: string
  v8: string
  os: string
}

export type PathName =
  | 'home'
  | 'appData'
  | 'assets'
  | 'userData'
  | 'sessionData'
  | 'temp'
  | 'exe'
  | 'module'
  | 'desktop'
  | 'documents'
  | 'downloads'
  | 'music'
  | 'pictures'
  | 'videos'
  | 'recent'
  | 'logs'
  | 'crashDumps'

export interface Cli2GuiData {
  cli2gui: string
  data: Command[]
}

export interface MenuItem {
  label: string
  icon?: string
  name?: string
  hidden?: boolean
  disabled?: boolean
  type?: '' | 'primary' | 'success' | 'warning' | 'info' | 'danger'
  divided?: boolean
  click?: (data?: unknown) => void
}

export interface FileInfo {
  command?: string
  realPath: string
  icon: string
}

// 命令
export interface Command {
  _ver: number
  _id: number
  base: CommandBase // 命令基本信息
  options: CommandOption[] // 命令配置项
  window: CommandWindow // 窗口配置
}

// 命令基本信息
export interface CommandBase {
  icon: string // 图标
  name: string // 命令名称
  description: string // 命令描述
  command: string // 命令
  realPath: string // 命令路径
}

// 命令配置项
export interface CommandOption {
  widget: string // 用哪个控件来处理该配置项的数据（控件名，对应 `Widget.name`，如 `slider`）

  label?: string // 配置项的标签
  key?: string // 配置项的键（如 `-i=`、`-o ` 等，默认为空即为无键）
  value?: unknown // 配置项的值（映射为 `Widget.component` 的值）
  joinWith?: string // 配置项的值为数组时的拼接符（如 `;`）
  description?: string // 配置项的描述
  required?: boolean // 是否为必填项
  readonly?: boolean // 是否为只读项
  hidden?: boolean // 是否隐藏

  attrs?: Record<string, unknown> // 输入组件属性（如 `el-input-number` 的 `min`、`max`）
  options?: ComponentOption[] // 输入组件的可选项（如 `el-select` 的 `option`）

  _key?: string // 用于渲染
  _selected?: boolean // 用于交互
}

// 解析 CommandOption 得到的命令配置项
// 示例：{ key: '-i=', value: 'input.txt', args: ['-i=input.txt'] }
// 示例：{ key: '-i', value: 'input.txt', args: ['-i', 'input.txt'] }
export interface ParsedCommandOption {
  // 用于 MyCommandCode 组件显示
  key?: string
  value?: string
  // 用于执行命令
  args?: string[]
  // 其他
  output?: string // 输出路径，只存在于输出控件，方便执行命令时创建输出目录
}

// 命令窗口配置
export interface CommandWindow {
  icon?: string
  width?: number
  height?: number
  minWidth?: number
  minHeight?: number
  maxWidth?: number
  maxHeight?: number
  resizable?: boolean
  alwaysOnTop?: boolean
}

// 控件
export interface Widget {
  icon: string // 图标
  name: string // 控件名（如 `slider`）
  label: string // 控件标签（如 `滑块`）
  component: string // 输入组件（如 `el-input`，复杂数据通过自定义组件实现）
  setting?: boolean // 是否显示设置按钮（有些控件的配置项比较复杂，使用单独的配置弹框，如 `el-select` 的可选项、`my-file-selector` 的文件类型过滤器）
  hideInLib?: boolean // 是否从控件库中隐藏

  data: CommandOption // 控件要处理的命令配置项数据
  options?: WidgetOption[] // 控件配置项
}

// 控件配置项
export interface WidgetOption {
  label?: string // 配置项标签
  tips?: string // 配置项提示信息
  dataKey?: string // 对应 data 里的哪个字段
  valueKey?: string // 对应 data.value 的哪个字段
  attrKey?: string // 对应 data.attrs 的哪个字段
  component?: string // 输入组件（如 `el-input`）
  description?: string // 选项描述
  attrs?: Record<string, unknown> // 输入组件属性（如 `el-input-number` 的 `min`、`max`）
  options?: ComponentOption[] // 输入组件的可选项（如 `el-select`）
  required?: boolean // 是否为必填项
  show?: (commandOption: CommandOption) => boolean // 是否显示
  setting?: boolean // 是否显示设置按钮
}

// 组件选项
export interface ComponentOption {
  label: string
  value: string
  labelKey?: string // label 的 i18n key，用于内建选项（如 alert 的类型）和预设选项（如 `选项1`、`选项2`）
  type?: '' | 'primary' | 'success' | 'warning' | 'info' | 'error' // alert 的类型
}

export interface RunCommandOptions {
  command: string
  args?: string[]
  options?: SpawnOptionsWithoutStdio
  onError?: (err) => void
  onDisconnect?: () => void
  onClose?: (code, signal) => void
  onExit?: (code, signal) => void
  onStdoutData?: (data) => void
  onStderrData?: (data) => void
}
