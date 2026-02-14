import { Widget, WidgetOption } from '@shared/typings'
import base from './base'
import cwd from './cwd'
import input from './input'
import output from './output'
import open from './open'
import text from './text'
import number from './number'
import slider from './slider'
import radio from './radio'
import checkbox from './checkbox'
import select from './select'
import _switch from './switch'
import alert from './alert'
import divider from './divider'

/**
 * 控件映射表
 */
export const widgetsMap: { [key: string]: Widget } = {
  base,
  input,
  output,
  cwd,
  open,
  text,
  switch: _switch,
  number,
  slider,
  radio,
  checkbox,
  select,
  alert,
  divider
}

/**
 * 控件列表
 */
export const widgets: Widget[] = Object.values(widgetsMap)

/**
 * 通用配置项
 */
export const commonOptions: Record<string, WidgetOption> = {
  label: {
    label: 'widgetOptions.label',
    dataKey: 'label',
    component: 'el-input'
  },
  key: {
    label: 'widgetOptions.key',
    dataKey: 'key',
    component: 'el-input',
    description: 'widgetOptions.keyDescription'
  },
  description: {
    dataKey: 'description',
    label: 'widgetOptions.description',
    component: 'el-input',
    attrs: {
      type: 'textarea',
      resize: 'none',
      autosize: {
        minRows: 2,
        maxRows: 8
      }
    }
  },
  required: {
    dataKey: 'required',
    label: 'widgetOptions.required',
    component: 'el-switch'
  },
  readonly: {
    dataKey: 'readonly',
    label: 'widgetOptions.readonly',
    component: 'el-switch'
  },
  hidden: {
    dataKey: 'hidden',
    label: 'widgetOptions.hidden',
    component: 'el-switch'
  }
}
