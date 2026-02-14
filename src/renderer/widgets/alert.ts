import { Widget } from '@shared/typings'

const alert: Widget = {
  name: 'alert',
  icon: 'alert',
  label: 'widgets.alert.label',
  component: 'el-alert',

  data: {
    widget: 'alert',
    attrs: {
      type: 'info',
      title: '',
      description: '',
      showIcon: true,
      closable: false
    }
  },

  options: [
    {
      attrKey: 'title',
      label: 'widgets.alert.options.title',
      component: 'el-input'
    },
    {
      attrKey: 'description',
      label: 'widgets.alert.options.description',
      component: 'el-input'
    },
    {
      attrKey: 'showIcon',
      label: 'widgets.alert.options.showIcon',
      component: 'el-switch'
    },
    {
      attrKey: 'type',
      component: 'el-select',
      label: 'widgets.alert.options.type',
      options: [
        {
          value: 'primary',
          label: '',
          labelKey: 'widgets.alert.options.typeOptions.primary',
          type: 'primary'
        },
        {
          value: 'success',
          label: '',
          labelKey: 'widgets.alert.options.typeOptions.success',
          type: 'success'
        },
        {
          value: 'info',
          label: '',
          labelKey: 'widgets.alert.options.typeOptions.info',
          type: 'info'
        },
        {
          value: 'warning',
          label: '',
          labelKey: 'widgets.alert.options.typeOptions.warning',
          type: 'warning'
        },
        {
          value: 'error',
          label: '',
          labelKey: 'widgets.alert.options.typeOptions.error',
          type: 'error'
        }
      ]
    }
  ]
}

export default alert
