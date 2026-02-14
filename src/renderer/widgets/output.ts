import { Widget } from '@shared/typings'

const output: Widget = {
  name: 'output',
  icon: 'output',
  label: 'widgets.output.label',
  component: 'my-output',

  data: {
    widget: 'output',
    label: '',
    key: '',
    value: {
      outDir: '',
      outName: '',
      overwrite: false
    },
    description: '',
    required: false,
    readonly: false,
    hidden: false
  }
}

export default output
