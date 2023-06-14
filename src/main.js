import { createApp } from 'vue'
import App from './App.vue'
import HDE from './plugin/index'

HDE.on('ready', function () {
  if (HDE.getState().formType !== 'create') {
    const { plugin } = HDE.getState()
    plugin.showButton = true
    HDE.emit('setPlugin', plugin)

    const app = createApp(App)

    app.mount('#app')
  }
})
