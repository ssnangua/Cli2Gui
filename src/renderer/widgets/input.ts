import { CommandOption, Widget } from '@shared/typings'

const input: Widget = {
  name: 'input',
  icon: 'input',
  label: 'widgets.input.label',
  component: 'my-file-list',

  data: {
    widget: 'input',
    label: '',
    key: '',
    value: [],
    description: '',
    required: false,
    readonly: false,
    hidden: false,
    attrs: {
      openDirectory: false,
      filters: [],
      title: '',
      defaultPath: ''
    }
  },

  options: [
    {
      attrKey: 'openDirectory',
      label: 'widgets.input.options.openDirectory',
      component: 'el-switch'
    },
    {
      attrKey: 'filters',
      label: 'widgets.input.options.filters',
      component: 'my-file-filters',
      show: (option: CommandOption) => !option.attrs?.openDirectory,
      setting: true
    },
    {
      attrKey: 'title',
      label: 'widgets.input.options.title',
      component: 'el-input'
    },
    {
      attrKey: 'defaultPath',
      label: 'widgets.input.options.defaultPath',
      component: 'my-file-selector',
      attrs: {
        openDirectory: true
      }
    }
  ]
}

export default input
