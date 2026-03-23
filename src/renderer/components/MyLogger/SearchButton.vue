<script setup lang="ts">
const { icon } = defineProps<{
  icon: string
}>()
</script>

<template>
  <el-button text>
    <i class="iconfont" :class="`icon-${icon}`"></i>
  </el-button>
</template>

<style scoped>
.el-button {
  padding: 6px;
  width: 26px;
  height: 26px;

  & + .el-button {
    margin-left: 2px;
  }
}
</style>
