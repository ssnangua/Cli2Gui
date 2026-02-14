window.addEventListener('dragenter', preventDefault)
window.addEventListener('dragover', preventDefault)
window.addEventListener('dragleave', preventDefault)
window.addEventListener('drop', preventDefault)

window.addEventListener('beforeunload', () => {
  window.removeEventListener('dragenter', preventDefault)
  window.removeEventListener('dragover', preventDefault)
  window.removeEventListener('dragleave', preventDefault)
  window.removeEventListener('drop', preventDefault)
})

function preventDefault(e: DragEvent): boolean {
  e.preventDefault()
  e.stopPropagation()
  return false
}

export interface FileExtra {
  lastModified: number
  name: string
  size: number
  type: string
  path: string
}

/**
 * 处理拖放的文件
 * @param e 拖放事件
 * @returns 拖放的文件列表
 */
export function handleDropFiles(e: DragEvent): FileExtra[] {
  return Array.from<File>(e.dataTransfer?.files || []).map((file) => {
    const { lastModified, name, size, type } = file
    return {
      lastModified,
      name,
      size,
      type,
      path: window.electron.webUtils.getPathForFile(file)
    }
  })
}
