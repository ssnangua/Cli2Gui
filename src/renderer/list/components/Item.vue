<script setup lang="ts">
import { computed } from 'vue'
import appIcon from '@assets/icon.png'
import { Command } from '@shared/typings'

const { command } = defineProps<{
  command: Command
}>()

const base = computed(() => command.base)

const emit = defineEmits<{
  click: []
  menu: [MouseEvent]
}>()
</script>

<template>
  <el-card
    shadow="hover"
    :title="base.name"
    class="command-item-card"
    body-class="command-item-card-body"
  >
    <div
      class="command-item"
      @click.stop="emit('click')"
      @contextmenu.prevent="emit('menu', $event)"
    >
      <el-image class="icon" :src="base.icon || appIcon" fit="cover" />
      <div class="info">
        <div class="name">
          <el-text>{{ base.name }}</el-text>
        </div>
        <div class="desc">
          <el-text size="small" type="info">{{ base.description }}</el-text>
        </div>
        <div class="command">
          <el-text size="small">{{ base.command || base.realPath }}</el-text>
        </div>
        <div v-if="base.command && base.command !== base.realPath" class="path">
          <el-text size="small" type="info">{{ base.realPath }}</el-text>
        </div>
      </div>

      <el-link class="menu-btn" underline="never" @click.stop="emit('menu', $event)">
        <i class="iconfont icon-dots-v"></i>
      </el-link>
    </div>

    <slot></slot>
  </el-card>
</template>

<style scoped>
:deep(.command-item-card-body) {
  padding: 0;
  position: relative;
}

.command-item {
  position: relative;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
  }

  .menu-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 32px;
    height: 32px;
    display: none;
  }

  &:hover .menu-btn {
    display: flex;
  }
}

.grid-view {
  .command-item-card {
    width: 100px;

    .command-item {
      flex-flow: column;

      .icon {
        margin: 10px 0;
      }

      .info {
        flex: auto;
        margin-top: 5px;
        align-content: center;

        .name {
          text-align: center;
          width: 80px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .desc,
        .command,
        .path {
          display: none;
        }
      }
    }
  }
}

.list-view {
  .el-card {
    .command-item {
      .info {
        flex: auto;
        margin-left: 10px;

        * {
          line-height: 1em;
          word-break: break-all;
        }

        .name {
          font-weight: bold;
        }

        & > div + div {
          margin-top: 5px;
        }
      }
    }
  }
}
</style>
