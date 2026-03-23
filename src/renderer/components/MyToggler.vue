<script setup lang="ts">
const model = defineModel<boolean>()
const { type = 'primary' } = defineProps<{
  type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'default'
}>()
</script>

<template>
  <el-button :type="model ? type : 'info'" plain>
    <slot></slot>
  </el-button>
</template>
