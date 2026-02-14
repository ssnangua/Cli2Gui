<script setup lang="ts">
import useCurCommand from '@store/useCurCommand'

const { curCommand } = useCurCommand()
</script>

<template>
  <div class="window-editor">
    <el-alert :title="$t('editor.windowOptions.zeroTips')" type="info" :closable="false" />

    <el-form v-if="curCommand" :model="curCommand.window" label-width="auto" class="form">
      <el-form-item :label="$t('editor.windowOptions.size')">
        <el-input-number v-model="curCommand.window.width" :min="0"></el-input-number>
        <span class="x">×</span>
        <el-input-number v-model="curCommand.window.height" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('editor.windowOptions.resizable')">
        <el-switch v-model="curCommand.window.resizable"></el-switch>
      </el-form-item>

      <el-form-item v-if="curCommand.window.resizable" :label="$t('editor.windowOptions.minSize')">
        <el-input-number v-model="curCommand.window.minWidth" :min="0"></el-input-number>
        <span class="x">×</span>
        <el-input-number v-model="curCommand.window.minHeight" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item v-if="curCommand.window.resizable" :label="$t('editor.windowOptions.maxSize')">
        <el-input-number v-model="curCommand.window.maxWidth" :min="0"></el-input-number>
        <span class="x">×</span>
        <el-input-number v-model="curCommand.window.maxHeight" :min="0"></el-input-number>
      </el-form-item>

      <el-form-item :label="$t('editor.windowOptions.alwaysOnTop')">
        <el-switch v-model="curCommand.window.alwaysOnTop"></el-switch>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.window-editor {
  padding: 10px;
}

.form {
  margin-top: 10px;
  padding: 10px;
}

.x {
  margin: 0 10px;
}
</style>
