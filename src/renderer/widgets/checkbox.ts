import { Widget } from '@shared/typings'

const checkbox: Widget = {
  name: 'checkbox',
  icon: 'checkbox',
  label: 'widgets.checkbox.label',
  component: 'el-checkbox-group',
  setting: true,

  data: {
    widget: 'checkbox',
    label: '',
    key: '',
    value: [],
    joinWith: '',
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    options: [
      { value: '1', label: '', labelKey: 'widgets.checkbox.sample.option1' },
      { value: '2', label: '', labelKey: 'widgets.checkbox.sample.option2' }
    ]
  },

  options: [
    {
      dataKey: 'joinWith',
      label: 'widgets.checkbox.options.joinWith',
      component: 'el-input',
      tips: 'widgets.checkbox.options.joinWithTips'
    }
  ]
}

export default checkbox
