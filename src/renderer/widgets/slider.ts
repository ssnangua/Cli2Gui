import { Widget } from '@shared/typings'

const slider: Widget = {
  name: 'slider',
  icon: 'slider',
  label: 'widgets.slider.label',
  component: 'el-slider',

  data: {
    widget: 'slider',
    label: '',
    key: '',
    value: 0,
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    attrs: {
      min: 0,
      max: 100,
      step: 1
    }
  },

  options: [
    {
      attrKey: 'min',
      label: 'widgets.slider.options.min',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right'
      }
    },
    {
      attrKey: 'max',
      label: 'widgets.slider.options.max',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right'
      }
    },
    {
      attrKey: 'step',
      label: 'widgets.slider.options.step',
      component: 'el-input-number',
      attrs: {
        controlsPosition: 'right',
        min: 0
      }
    }
  ]
}

export default slider
