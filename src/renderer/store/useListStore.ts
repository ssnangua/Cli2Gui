import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { Command } from '@shared/typings'

type ViewMode = 'grid-view' | 'list-view'
const viewMode = useStorage<ViewMode>('view-mode', 'grid-view')

const isExporting = ref(false)
const isSelectAll = ref(false)
const selectedItems = ref<Command[]>([])

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useListStore() {
  return {
    viewMode,
    isExporting,
    isSelectAll,
    selectedItems
  }
}

export default useListStore
