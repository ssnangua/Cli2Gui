<script setup lang="ts">
import { toRaw, useTemplateRef } from 'vue'
import { ElMessageBox } from 'element-plus'
import { Command, MenuItem } from '@shared/typings'
import useData from '@store/useData'
import { exportCommands } from '@utils/commandUtil'
import useI18n from '@store/useI18n'
import { generateWindowIcon } from '@utils/iconUtil'

const data = useData()
const { t } = useI18n()

const emit = defineEmits<{
  openEditor: [Command]
}>()

const items: MenuItem[] = [
  {
    label: 'list.itemMenu.edit',
    icon: 'edit',
    click(command) {
      emit('openEditor', command as Command)
    }
  },
  {
    label: 'list.itemMenu.remove',
    icon: 'remove',
    // type: 'danger',
    click(command) {
      ElMessageBox.confirm(t('list.itemMenu.confirmRemove'), {
        type: 'warning',
        cancelButtonText: t('list.itemMenu.cancel'),
        confirmButtonText: t('list.itemMenu.remove'),
        confirmButtonType: 'danger'
      })
        .then(() => {
          data.removeItem(command as Command)
        })
        .catch(() => {})
    }
  },
  {
    label: 'list.itemMenu.export',
    icon: 'export',
    divided: true,
    click(command) {
      exportCommands([command as Command])
    }
  }
]

if (window.electron.process.platform === 'win32') {
  items.push({
    label: 'list.itemMenu.createDesktopShortcut',
    icon: 'shortcut',
    async click(command) {
      const raw = toRaw(command) as Command
      const icon = raw.base.icon && (await generateWindowIcon(raw.base.icon, 256))
      const description = t('list.itemMenu.desktopShortcutDescription')
      window.api.createDesktopShortcut(raw, icon, description)
    }
  })
}

const menu = useTemplateRef('menu')
function open(event: MouseEvent, command: Command): void {
  menu.value?.open(event, command)
}
defineExpose({ open })
</script>

<template>
  <my-popup-menu ref="menu" :items="items" />
</template>
