import MyLogger from './MyLogger/MyLogger.vue'
import MyWindow from './MyWindow/MyWindow.vue'
import MyCommand from './MyCommand.vue'
import MyCommandBase from './MyCommandBase.vue'
import MyCommandCode from './MyCommandCode.vue'
import MyCommandOption from './MyCommandOption.vue'
import MyDescription from './MyDescription.vue'
import MyDropFiles from './MyDropFiles.vue'
import MyEmpty from './MyEmpty.vue'
import MyFileFilters from './MyFileFilters.vue'
import MyFileList from './MyFileList.vue'
import MyFileSelector from './MyFileSelector.vue'
import MyHelpTooltip from './MyHelpTooltip.vue'
import MyIconSelector from './MyIconSelector.vue'
import MyOutput from './MyOutput.vue'
import MyPopupMenu from './MyPopupMenu.vue'
import MyToggler from './MyToggler.vue'
import MyWidgetOption from './MyWidgetOption.vue'

export default {
  install(app) {
    app.component('MyLogger', MyLogger)
    app.component('MyWindow', MyWindow)
    app.component('MyCommand', MyCommand)
    app.component('MyCommandBase', MyCommandBase)
    app.component('MyCommandCode', MyCommandCode)
    app.component('MyCommandOption', MyCommandOption)
    app.component('MyDescription', MyDescription)
    app.component('MyDropFiles', MyDropFiles)
    app.component('MyEmpty', MyEmpty)
    app.component('MyFileFilters', MyFileFilters)
    app.component('MyFileList', MyFileList)
    app.component('MyFileSelector', MyFileSelector)
    app.component('MyHelpTooltip', MyHelpTooltip)
    app.component('MyIconSelector', MyIconSelector)
    app.component('MyOutput', MyOutput)
    app.component('MyPopupMenu', MyPopupMenu)
    app.component('MyToggler', MyToggler)
    app.component('MyWidgetOption', MyWidgetOption)
  }
}
