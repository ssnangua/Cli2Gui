import { generateWindowIcon } from '@utils/iconUtil'
import useData from '@store/useData'

const data = useData()

async function addCommandItem(command: string): Promise<void> {
  const file = await window.api.getCommandInfo(command)
  if (file) {
    const base = {
      icon: file.icon,
      name: command,
      description: '',
      command,
      realPath: file.realPath
    }
    const window = {
      icon: await generateWindowIcon(file.icon)
    }
    const item = data.createItem(base, window)
    data.setItem(item._id, item)
  }
}

if (!localStorage.inited) {
  localStorage.inited = '1'
  addCommandItem('whoami')
}
