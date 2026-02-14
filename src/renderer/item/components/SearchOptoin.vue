<script setup lang="ts">
import SearchButton from './SearchButton.vue'
const model = defineModel<boolean>()
const { icon } = defineProps<{
  icon: string
}>()
</script>

<template>
  <SearchButton
    class="search-option"
    :icon="icon"
    :text="!model"
    :type="model ? 'primary' : ''"
    @click="model = !model"
  />
</template>
