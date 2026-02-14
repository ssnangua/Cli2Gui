<script setup lang="ts">
import { h, ref, watch } from 'vue'
import { ElMessageBox, ElText } from 'element-plus'
import { MenuItem } from '@shared/typings'
import useData from '@store/useData'
import useListStore from '@store/useListStore'
import { importCommands } from '@utils/commandUtil'
import useI18n from '@store/useI18n'

const data = useData()
const { isExporting } = useListStore()
const { t } = useI18n()

watch(data.hasItems, (value) => {
  items.value
    .filter((item) => item.name === 'export' || item.name === 'clear')
    .forEach((item) => {
      item.disabled = !value
    })
})

const items = ref<MenuItem[]>([
  {
    label: 'list.appMenu.import',
    icon: 'import',
    click() {
      importCommands()
    }
  },
  {
    name: 'export',
    label: 'list.appMenu.export',
    icon: 'export',
    disabled: !data.hasItems.value,
    click() {
      isExporting.value = !isExporting.value
    }
  },
  {
    name: 'clear',
    label: 'list.appMenu.clear',
    icon: 'clear',
    disabled: !data.hasItems.value,
    // type: 'danger',
    click() {
      ElMessageBox({
        title: t('list.appMenu.confirmClear'),
        message: h(ElText, { type: 'warning' }, () => t('list.appMenu.irreversible')),
        type: 'warning',
        showCancelButton: true,
        cancelButtonText: t('list.appMenu.cancel'),
        confirmButtonText: t('list.appMenu.clear'),
        confirmButtonType: 'danger'
      })
        .then(() => {
          data.clear()
          isExporting.value = false
        })
        .catch(() => {})
    }
  },
  {
    label: 'list.appMenu.github',
    icon: 'github',
    divided: true,
    click() {
      window.api.openExternal('https://github.com/ssnangua/Cli2Gui')
    }
  },
  {
    label: 'list.appMenu.about',
    icon: 'none',
    async click() {
      const { name, version, electron, chrome, node, v8, os } = await window.api.getAppInfo()
      window.api.showMessageBox({
        type: 'info',
        title: name,
        message: name,
        detail: [
          `${t('list.appMenu.version')}：${version}`,
          `Electron：${electron}`,
          `Chromium：${chrome}`,
          `Node.js：${node}`,
          `V8：${v8}`,
          `OS：${os}`
        ].join('\n')
      })
    }
  },
  {
    label: 'list.appMenu.quit',
    icon: 'quit',
    // type: 'danger',
    click() {
      window.api.quitApp()
    }
  }
])
</script>

<template>
  <el-dropdown-menu>
    <el-dropdown-item
      v-for="(item, index) in items"
      :key="index"
      :disabled="item.disabled"
      :divided="item.divided"
      @click="item.click?.(item)"
    >
      <el-link :type="item.type" :disabled="item.disabled" underline="never">
        <i class="iconfont" :class="[`icon-${item.icon}`]"></i>
        {{ $t(item.label) }}
      </el-link>
    </el-dropdown-item>
  </el-dropdown-menu>
</template>

<style scoped>
:deep(.el-dropdown-menu__item) {
  padding: 0;

  .el-link {
    padding: 5px 16px;
    font-weight: normal;
    flex: auto;
    justify-content: flex-start;
  }
}
</style>
