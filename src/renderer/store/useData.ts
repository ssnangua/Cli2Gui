import { computed, toRaw } from 'vue'
import { useStorage } from '@vueuse/core'
import { Command, CommandBase, CommandWindow } from '@shared/typings'
import { DATA_VERSION } from '@shared/constants'

const items = useStorage<Command[]>('items', [])

const hasItems = computed(() => items.value.length > 0)

function hasItem(id: number): boolean {
  return items.value.findIndex((item) => item._id === id) !== -1
}

function getItem(id: number): Command | undefined {
  return items.value.find((item) => item._id === id)
}

function setItem(id: number, newValue: Command): void {
  const index = items.value.findIndex((item) => item._id === id)
  if (index !== -1) {
    items.value[index] = newValue
  } else {
    items.value.push(newValue)
  }
}

function removeItem(command: Command): void {
  const index = items.value.findIndex((item) => item._id === command._id)
  if (index !== -1) {
    items.value.splice(index, 1)
    // console.log(command)
    if (window.electron.process.platform === 'win32') {
      window.api.removeDesktopShortcuts([toRaw(command)])
    }
  }
}

function clear(): void {
  if (window.electron.process.platform === 'win32') {
    window.api.removeDesktopShortcuts(toRaw(items.value))
  }
  items.value = []
}

function createItem(commandBase?: CommandBase, window?: CommandWindow): Command {
  return {
    _ver: DATA_VERSION,
    _id: Date.now(),
    base: {
      icon: '',
      name: '',
      description: '',
      command: '',
      realPath: '',
      ...commandBase
    },
    options: [],
    window: {
      icon: '',
      width: 0,
      height: 0,
      minWidth: 0,
      minHeight: 0,
      maxWidth: 0,
      maxHeight: 0,
      resizable: true,
      alwaysOnTop: false,
      ...window
    }
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useData() {
  return {
    items,
    hasItems,
    hasItem,
    getItem,
    setItem,
    removeItem,
    createItem,
    clear
  }
}

export default useData
