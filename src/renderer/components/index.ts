import MyEmpty from '@components/MyEmpty.vue'
import MyDescription from '@components/MyDescription.vue'
import MyHelpTooltip from '@components/MyHelpTooltip.vue'
import MyDropFiles from '@components/MyDropFiles.vue'
import MyPopupMenu from '@components/MyPopupMenu.vue'
import MyCommandCode from '@components/MyCommandCode.vue'
import MyCommandBase from '@components/MyCommandBase.vue'
import MyIconSelector from '@components/MyIconSelector.vue'
import MyFileSelector from '@components/MyFileSelector.vue'
import MyFileList from '@components/MyFileList.vue'
import MyOutput from '@components/MyOutput.vue'
import MyFileFilters from '@components/MyFileFilters.vue'
import MyCommandOption from '@components/MyCommandOption.vue'
import MyWidgetOption from '@components/MyWidgetOption.vue'

export default {
  install(app) {
    app.component('MyEmpty', MyEmpty)
    app.component('MyDescription', MyDescription)
    app.component('MyHelpTooltip', MyHelpTooltip)
    app.component('MyDropFiles', MyDropFiles)
    app.component('MyPopupMenu', MyPopupMenu)
    app.component('MyCommandCode', MyCommandCode)
    app.component('MyCommandBase', MyCommandBase)
    app.component('MyIconSelector', MyIconSelector)
    app.component('MyFileSelector', MyFileSelector)
    app.component('MyFileList', MyFileList)
    app.component('MyOutput', MyOutput)
    app.component('MyFileFilters', MyFileFilters)
    app.component('MyCommandOption', MyCommandOption)
    app.component('MyWidgetOption', MyWidgetOption)
  }
}
