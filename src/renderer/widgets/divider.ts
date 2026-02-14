import { Widget } from '@shared/typings'

const divider: Widget = {
  name: 'divider',
  icon: 'divider',
  label: 'widgets.divider.label',
  component: 'el-divider',

  data: {
    widget: 'divider',
    attrs: {
      direction: 'horizontal',
      contentPosition: 'center',
      content: ''
    }
  },

  options: [
    {
      attrKey: 'content',
      label: 'widgets.divider.options.content',
      component: 'el-input'
    },
    {
      attrKey: 'contentPosition',
      label: 'widgets.divider.options.contentPosition',
      component: 'el-radio-group',
      options: [
        {
          value: 'left',
          label: '',
          labelKey: 'widgets.divider.options.contentPositionOptions.left'
        },
        {
          value: 'center',
          label: '',
          labelKey: 'widgets.divider.options.contentPositionOptions.center'
        },
        {
          value: 'right',
          label: '',
          labelKey: 'widgets.divider.options.contentPositionOptions.right'
        }
      ]
    }
  ]
}

export default divider
