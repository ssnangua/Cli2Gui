import { Widget } from '@shared/typings'

const _switch: Widget = {
  name: 'switch',
  icon: 'switch',
  label: 'widgets.switch.label',
  component: 'el-switch',

  data: {
    widget: 'switch',
    label: '',
    key: '',
    value: false,
    description: '',
    required: false,
    readonly: false,
    hidden: false
  }
}

export default _switch
