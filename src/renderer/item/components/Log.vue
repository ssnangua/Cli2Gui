<script setup lang="ts">
import { useTemplateRef, onMounted, onUnmounted, ref, watch } from 'vue'
import { xterm, fitAddon, searchAddon } from './xterm'
import SearchButton from './SearchButton.vue'
import SearchOptoin from './SearchOptoin.vue'

const searchInput = useTemplateRef('searchInput')
const searchTerm = ref('')
const searchOptions = ref({
  caseSensitive: false,
  wholeWord: false,
  regex: false,
  // incremental: true,
  decorations: {
    matchBorder: 'rgba(255, 255, 255, 0.3)',
    matchOverviewRuler: '#000000',
    activeMatchBorder: 'rgba(255, 255, 255, 0.3)',
    activeMatchColorOverviewRuler: '#000000'
  }
})
const searchResult = ref({
  resultIndex: 0,
  resultCount: 0
})
function findNext(): void {
  searchAddon.findNext(searchTerm.value, searchOptions.value)
}
function findPrevious(): void {
  searchAddon.findPrevious(searchTerm.value, searchOptions.value)
}
watch(
  searchOptions,
  () => {
    searchAddon.clearDecorations()
    findNext()
    searchInput.value?.focus()
  },
  { deep: true }
)
searchAddon.onDidChangeResults((result) => {
  searchResult.value = result
})

function clear(): void {
  xterm.clear()
  xterm.clearSelection()
  searchResult.value = {
    resultIndex: 0,
    resultCount: 0
  }
  searchAddon.clearDecorations()
}

const terminalRef = useTemplateRef('terminal')

let isXtermMounted = false
function mountXterm(): void {
  if (isXtermMounted) return
  if (terminalRef.value) {
    isXtermMounted = true
    xterm.open(terminalRef.value)
    setTimeout(() => fitAddon.fit(), 0)
  }
}

onMounted(() => {
  window.addEventListener('resize', onResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize(): void {
  fitAddon.fit()
}

const xtermMenuItems = [{ label: 'item.logDialog.clear', icon: 'clear', click: clear }]
const xtermSelectionMenuItems = [
  {
    label: 'item.logDialog.copy',
    icon: 'copy',
    click: (selection: string) => {
      navigator.clipboard.writeText(selection)
    }
  }
]

const xtermMenu = useTemplateRef('xtermMenu')
const xtermSelectionMenu = useTemplateRef('xtermSelectionMenu')
function onXtermContextMenu(event: MouseEvent): void {
  const selection = xterm.getSelection()
  if (selection) {
    xtermSelectionMenu.value?.open(event, selection)
  } else {
    xtermMenu.value?.open(event)
  }
}
</script>

<template>
  <el-dialog
    :title="$t('item.log')"
    width="80vw"
    modal-class="xterm-dialog"
    body-class="xterm-dialog-body"
    align-center
    draggable
    :modal="false"
    modal-penetrable
    @open="mountXterm"
  >
    <div ref="terminal" class="my-xterm" @contextmenu.prevent="onXtermContextMenu"></div>
    <my-popup-menu ref="xtermMenu" :items="xtermMenuItems" />
    <my-popup-menu ref="xtermSelectionMenu" :items="xtermSelectionMenuItems" />

    <div class="xterm-toolbar">
      <div class="xterm-search">
        <el-input
          ref="searchInput"
          v-model="searchTerm"
          :placeholder="$t('item.logDialog.find')"
          class="xterm-search-input"
          @input="findNext"
          @keydown.enter="findNext"
        >
          <template #prefix>
            <i class="iconfont icon-search"></i>
          </template>
          <template #suffix>
            <SearchOptoin
              v-model="searchOptions.caseSensitive"
              :title="$t('item.logDialog.matchCase')"
              icon="case-sensitive"
            />
            <SearchOptoin
              v-model="searchOptions.wholeWord"
              :title="$t('item.logDialog.matchWholeWord')"
              icon="whole-word"
            />
            <SearchOptoin
              v-model="searchOptions.regex"
              :title="$t('item.logDialog.useRegularExpression')"
              icon="regexp"
            />
          </template>
        </el-input>

        <span class="xterm-search-nav">
          <SearchButton
            :title="$t('item.logDialog.previousMatch')"
            icon="move-up"
            :disabled="searchResult.resultCount === 0"
            @click="findPrevious"
          />
          <SearchButton
            :title="$t('item.logDialog.nextMatch')"
            icon="move-down"
            :disabled="searchResult.resultCount === 0"
            @click="findNext"
          />
        </span>

        <span class="xterm-search-result">
          <el-text v-if="searchResult.resultCount > 0">
            {{
              $t('item.logDialog.matchResult', {
                no: searchResult.resultIndex + 1,
                total: searchResult.resultCount
              })
            }}
          </el-text>
          <el-text v-else type="info">
            {{ $t('item.logDialog.noResults') }}
          </el-text>
        </span>
      </div>

      <el-button @click="clear">
        <i class="iconfont icon-clear" style="margin-right: 5px"></i>
        {{ $t('item.logDialog.clear') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<style scoped>
.my-xterm {
  overflow: hidden;
}

.xterm-toolbar {
  padding-top: 10px;
  display: flex;
  justify-content: space-between;
}
.xterm-search {
  width: calc(100% - 75px);
  display: flex;
  align-items: center;
  gap: 10px;
  margin-right: 10px;
}
.xterm-search-input {
  flex: auto;
}
.xterm-search-nav,
.xterm-search-result {
  flex-shrink: 0;
}
.xterm-search-result {
  min-width: 100px;
}
:deep(.xterm-search) .el-input__wrapper {
  padding-right: 3px;
}

@media screen and (max-width: 600px) {
  .xterm-search > * {
    display: none;
  }
}
</style>

<style>
.xterm-dialog-body {
  height: 70vh;
  overflow: hidden;
  display: flex;
  flex-flow: column;

  .my-xterm {
    flex: auto;
    background-color: #000;
  }
}
</style>
