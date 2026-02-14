import { Widget } from '@shared/typings'

const radio: Widget = {
  name: 'radio',
  icon: 'radio',
  label: 'widgets.radio.label',
  component: 'el-radio-group',
  setting: true,

  data: {
    widget: 'radio',
    label: '',
    key: '',
    value: '1',
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    options: [
      { value: '1', label: '', labelKey: 'widgets.radio.sample.option1' },
      { value: '2', label: '', labelKey: 'widgets.radio.sample.option2' }
    ]
  }
}

export default radio
