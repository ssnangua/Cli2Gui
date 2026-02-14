import { Widget } from '@shared/typings'

const select: Widget = {
  name: 'select',
  icon: 'select',
  label: 'widgets.select.label',
  component: 'el-select',
  setting: true,

  data: {
    widget: 'select',
    label: '',
    key: '',
    value: '1',
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    options: [
      { value: '1', label: '', labelKey: 'widgets.select.sample.option1' },
      { value: '2', label: '', labelKey: 'widgets.select.sample.option2' }
    ]
  }
}

export default select
