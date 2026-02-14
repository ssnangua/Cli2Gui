<script setup lang="ts">
import useTheme from '@store/useTheme'
import AppMenu from './AppMenu.vue'
import useListStore from '@store/useListStore'
import useI18n from '@store/useI18n'

const theme = useTheme()
const { viewMode } = useListStore()

const { languages, locale } = useI18n()

const emit = defineEmits<{
  openEditor: []
}>()
</script>

<template>
  <div class="my-header">
    <div class="header-left">
      <el-button type="primary" @click="emit('openEditor')">
        <i class="iconfont icon-add"></i>
        <span style="margin-left: 5px">{{ $t('list.header.newCommand') }}</span>
      </el-button>
      <el-text type="info" style="margin-left: 10px">
        <i class="iconfont icon-drag-drop"></i>
        {{ $t('list.header.dropExe') }}
      </el-text>
    </div>

    <div class="header-right">
      <el-segmented
        v-model="viewMode"
        :options="[
          { value: 'grid-view', title: $t('list.header.gridView'), icon: 'iconfont icon-grid-alt' },
          { value: 'list-view', title: $t('list.header.listView'), icon: 'iconfont icon-list-alt' }
        ]"
      >
        <template #default="scope">
          <div :title="scope.item.title">
            <i :class="scope.item.icon"></i>
          </div>
        </template>
      </el-segmented>

      <!-- <el-divider direction="vertical" /> -->

      <el-button text style="margin-left: 10px" @click="theme.toggleDark()">
        <i class="iconfont" :class="theme.isDark.value ? 'icon-dark' : 'icon-light'"></i>
      </el-button>

      <el-dropdown placement="bottom" :show-arrow="false" popper-class="lang-list-popper">
        <el-button text>
          <i class="iconfont icon-language"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="(language, key) in languages" :key="key" @click="locale = key">
              <el-text :type="key === locale ? 'primary' : ''">
                {{ language || key }}
              </el-text>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-dropdown placement="bottom-end" :show-arrow="false">
        <el-button text>
          <i class="iconfont icon-menu menu-icon"></i>
        </el-button>
        <template #dropdown>
          <AppMenu />
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped>
.my-header {
  display: flex;
  padding: 10px;
  background: var(--el-bg-color);
  --el-header-height: inherit;

  .header-left {
    flex: auto;
    white-space: nowrap;
  }
  .header-right {
    display: flex;
    align-items: center;
    gap: 5px;

    .el-button {
      width: 32px;
      & + .el-button {
        margin-left: 0;
      }
    }
  }
}

.menu-icon {
  transform: scaleX(-1);
}

.lang-list-popper {
  .el-text--primary {
    font-weight: bold;
  }
}

:deep(.el-button.is-text:not(.is-disabled):focus-visible) {
  outline: unset;
}
</style>
