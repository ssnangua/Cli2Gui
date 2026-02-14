import { Widget } from '@shared/typings'

const base: Widget = {
  name: 'base',
  icon: '',
  label: 'widgets.base.label',
  component: 'my-command-base',
  hideInLib: true,

  data: {
    widget: 'base',
    value: {
      icon: '',
      name: '',
      description: '',
      command: '',
      realPath: ''
    }
  },

  options: [
    {
      valueKey: 'name',
      label: 'widgets.base.options.name',
      component: 'el-input'
    },
    {
      valueKey: 'command',
      label: 'widgets.base.options.command',
      component: 'el-input',
      description: 'widgets.base.options.commandDescription'
    },
    {
      valueKey: 'realPath',
      label: 'widgets.base.options.realPath',
      component: 'my-file-selector',
      description: 'widgets.base.options.realPathDescription',
      attrs: {
        exectuble: true
      }
    },
    {
      valueKey: 'icon',
      label: 'widgets.base.options.icon',
      component: 'my-icon-selector',
      description: 'widgets.base.options.iconDescription'
    },
    {
      valueKey: 'description',
      label: 'widgets.base.options.description',
      component: 'el-input'
    }
  ]
}

export default base
