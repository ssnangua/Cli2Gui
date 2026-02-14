import appIcon from '@assets/icon.png'

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!

function drawImage(icon: string, x: number, y: number, size: number): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = icon
    img.onload = () => {
      const scale = Math.min(size / img.naturalWidth, size / img.naturalHeight)
      const dw = img.naturalWidth * scale
      const dh = img.naturalHeight * scale
      const dx = x + (size - dw) / 2
      const dy = y + (size - dh) / 2
      ctx.drawImage(img, dx, dy, dw, dh)
      resolve()
    }
  })
}

/**
 * 生成窗口图标，将命令图标和应用图标叠加在一起
 * @param itemIcon 命令图标
 * @returns 与应用图标叠加后的图标
 */
export async function generateWindowIcon(itemIcon: string, size: number = 64): Promise<string> {
  canvas.width = canvas.height = size
  const scaleSize = Math.floor(size * (50 / 64))
  const offset = size - scaleSize
  // 在左下角绘制应用图标
  await drawImage(appIcon, 0, offset, scaleSize)
  // 在右上角绘制命令图标
  await drawImage(itemIcon, offset, 0, scaleSize)
  // 生成叠加后的图标
  const windowIcon = canvas.toDataURL('image/png')
  // 清除画布，以便下次使用
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return windowIcon
}

/**
 * 绘制命令图标（将图片绘制为特定尺寸的图标，在选择大图时减少保存的数据量）
 * @param src 要绘制的图片
 * @returns 绘制后的命令图标
 */
export async function drawIcon(src: string): Promise<string> {
  await drawImage(src, 0, 0, 64)
  const icon = canvas.toDataURL('image/png')
  // 清除画布，以便下次使用
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  return icon
}
