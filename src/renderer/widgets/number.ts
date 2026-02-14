import { Widget } from '@shared/typings'

const number: Widget = {
  name: 'number',
  icon: 'number',
  label: 'widgets.number.label',
  component: 'el-input-number',

  data: {
    widget: 'number',
    label: '',
    key: '',
    value: 0,
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    attrs: {
      controlsPosition: 'right',
      min: 0,
      max: 100,
      step: 1,
      // precision: 0,
      stepStrictly: true
    }
  },

  options: [
    {
      attrKey: 'min',
      label: 'widgets.number.options.min',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right'
      }
    },
    {
      attrKey: 'max',
      label: 'widgets.number.options.max',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right'
      }
    },
    {
      attrKey: 'step',
      label: 'widgets.number.options.step',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right',
        min: 0
      }
    } /* ,
    {
      attrKey: 'precision',
      label: '精度',
      component: 'el-input-number',
      description: '',
      attrs: {
        controlsPosition: 'right',
        min: 0,
        step: 1
      }
    } */
  ]
}

export default number
