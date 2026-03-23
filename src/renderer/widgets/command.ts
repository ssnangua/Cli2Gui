import { Widget } from '@shared/typings'

const command: Widget = {
  name: 'command',
  icon: 'terminal',
  label: 'widgets.command.label',
  component: 'my-command',

  data: {
    widget: 'command',
    label: '',
    value: {
      command: '',
      cwd: ''
    },
    description: '',
    required: false,
    readonly: false,
    hidden: false
  }
}

export default command
