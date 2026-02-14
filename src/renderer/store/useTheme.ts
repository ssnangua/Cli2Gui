import { useDark, useToggle } from '@vueuse/core'

const isDark = useDark()
const toggleDark = useToggle(isDark)

function _toggleDark(): void {
  const transition = document.startViewTransition(() => {
    toggleDark()
    window.api.toggleTheme(isDark.value ? 'dark' : 'light')
  })
  transition.ready.then(() => {
    const { x, y } = { x: window.innerWidth, y: 0 }
    const radius = Math.hypot(window.innerWidth, window.innerHeight)
    const clipPath = [`circle(0 at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? clipPath.reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        fill: 'both',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function useTheme() {
  return {
    isDark,
    toggleDark: _toggleDark
  }
}
export default useTheme
