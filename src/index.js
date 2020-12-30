import Vue from 'vue'
import App from './App.vue'
import router from './router'
require('./styles/style.scss')
// require('@/assets/sass/main.scss')

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import '@mdi/font/css/materialdesignicons.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.use(Vuetify)

import ElementUI from 'element-ui'
import { Dialog } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

// import 'bootstrap/dist/css/bootstrap.css'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
Vue.use(BootstrapVue)
Vue.use(ElementUI, { locale })

// import 'font-awesome/css/font-awesome.min.css'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// import { fas } from '@fortawesome/free-solid-svg-icons'
// library.add(fas) // Include needed icons
// Vue.component('font-awesome-icon', FontAwesomeIcon) // Register component globally

// import GAuth from 'vue-google-oauth2'
// Vue.use(GAuth, {
//   clientId: '768834812579-007e5802er7gj3c93p8qa9568h8bj3na.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: false
// })

Vue.config.productionTip = false

new Vue({
	vuetify: new Vuetify({
		icons: {
	    	iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
	    },
	}),
  router,
  render: h => h(App)
}).$mount('#app')

// new Vue({
//   render: h => h(App),
// }).$mount('#app')
// 