import { generateWindowIcon } from '@utils/iconUtil'
import useData from '@store/useData'
import appIcon from '@assets/icon.png'

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
      icon: await generateWindowIcon(file.icon || appIcon)
    }
    const item = data.createItem(base, window)
    data.setItem(item._id, item)
  }
}

if (!localStorage.inited) {
  localStorage.inited = '1'
  addCommandItem('whoami')
}
