import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },

  preload: {
    resolve: {
      alias: {
        '@shared': resolve('src/shared')
      }
    }
  },

  renderer: {
    build: {
      rollupOptions: {
        input: {
          list: resolve(__dirname, 'src/renderer/list/index.html'),
          item: resolve(__dirname, 'src/renderer/item/index.html')
        }
      }
    },
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@assets': resolve('src/renderer/assets'),
        '@utils': resolve('src/renderer/utils'),
        '@components': resolve('src/renderer/components'),
        '@widgets': resolve('src/renderer/widgets'),
        '@store': resolve('src/renderer/store')
      }
    },
    plugins: [vue(), vueJsx()]
  }
})
