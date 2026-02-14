import { Widget } from '@shared/typings'

const text: Widget = {
  name: 'text',
  icon: 'text',
  label: 'widgets.text.label',
  component: 'el-input',

  data: {
    widget: 'text',
    label: '',
    key: '',
    value: '',
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    attrs: {
      type: 'text',
      resize: 'none',
      autosize: {
        minRows: 2,
        maxRows: 8
      }
    }
  },

  options: [
    {
      attrKey: 'type',
      label: 'widgets.text.options.type',
      component: 'el-radio-group',
      options: [
        { value: 'text', label: '', labelKey: 'widgets.text.options.typeOptions.text' },
        { value: 'textarea', label: '', labelKey: 'widgets.text.options.typeOptions.textarea' }
      ]
    }
  ]
}

export default text
