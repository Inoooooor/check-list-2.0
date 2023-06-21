import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import HDE from './plugin/index'
import './assets/style.scss'

HDE.on('ready', function () {
  if (HDE.getState().formType !== 'create') {
    const { plugin } = HDE.getState()
    plugin.showButton = true
    HDE.emit('setPlugin', plugin)

    const pinia = createPinia()
    const app = createApp(App)

    app.use(pinia)
    app.mount('#app')
  }
})
