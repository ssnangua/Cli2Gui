import { Widget } from '@shared/typings'

const cwd: Widget = {
  name: 'cwd',
  icon: 'cwd',
  label: 'widgets.cwd.label',
  component: 'my-file-selector',

  data: {
    widget: 'cwd',
    label: '',
    value: '',
    required: false,
    readonly: false,
    hidden: false,
    attrs: {
      openDirectory: true
    }
  }
}

export default cwd
