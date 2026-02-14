import { CommandOption, Widget } from '@shared/typings'

const open: Widget = {
  name: 'open',
  icon: 'folder-open',
  label: 'widgets.open.label',
  component: 'my-file-selector',

  data: {
    widget: 'open',
    label: '',
    key: '',
    value: '',
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
      label: 'widgets.open.options.openDirectory',
      component: 'el-switch'
    },
    {
      attrKey: 'filters',
      label: 'widgets.open.options.filters',
      component: 'my-file-filters',
      show: (option: CommandOption) => !option.attrs?.openDirectory,
      setting: true
    },
    {
      attrKey: 'title',
      label: 'widgets.open.options.title',
      component: 'el-input'
    },
    {
      attrKey: 'defaultPath',
      label: 'widgets.open.options.defaultPath',
      component: 'my-file-selector',
      attrs: {
        openDirectory: true
      }
    }
  ]
}

export default open
