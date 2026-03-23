import { CommandOption, Widget } from '@shared/typings'

const open: Widget = {
  name: 'path',
  icon: 'folder-open',
  label: 'widgets.path.label',
  component: 'my-file-selector',

  data: {
    widget: 'path',
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
      label: 'widgets.path.options.openDirectory',
      component: 'el-switch'
    },
    {
      attrKey: 'filters',
      label: 'widgets.path.options.filters',
      component: 'my-file-filters',
      show: (option: CommandOption) => !option.attrs?.openDirectory,
      setting: true
    },
    {
      attrKey: 'title',
      label: 'widgets.path.options.title',
      component: 'el-input'
    },
    {
      attrKey: 'defaultPath',
      label: 'widgets.path.options.defaultPath',
      component: 'my-file-selector',
      attrs: {
        openDirectory: true
      }
    }
  ]
}

export default open
