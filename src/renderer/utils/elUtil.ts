export function getSliderMarks(
  min: number,
  max: number,
  value: number,
  disabled?: boolean
): unknown {
  return {
    [min]: min + '',
    [max]: max + '',
    [value]: disabled
      ? value + ''
      : {
          style: {
            color: 'var(--el-slider-main-bg-color)',
            background: 'var(--mark-value)',
            zIndex: 1000,
            padding: '0 4px'
          },
          label: value + ''
        }
  }
}
