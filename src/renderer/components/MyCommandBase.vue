<script setup lang="ts">
import appIcon from '@assets/icon.png'

const model = defineModel<{
  icon: string
  name: string
  description: string
  command: string
  realPath: string
}>()
</script>

<template>
  <div v-if="model" class="my-command">
    <el-image class="icon" :src="model.icon || appIcon" fit="cover" />
    <div class="info">
      <div class="name">
        <el-text>{{ model.name }}</el-text>
      </div>
      <div class="description">
        <el-text size="small" type="info">{{ model.description }}</el-text>
      </div>
      <div>
        <el-text size="small">{{ model.command || model.realPath }}</el-text>
      </div>
      <div v-if="model.command && model.command !== model.realPath" class="path">
        <el-text size="small" type="info">{{ model.realPath }}</el-text>
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-command {
  display: flex;
  align-items: center;
  justify-content: center;

  .icon {
    flex-shrink: 0;
    width: 32px;
    height: 32px;
  }

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
</style>
