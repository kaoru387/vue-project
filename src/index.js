import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store/app";

require('./styles/style.scss')
// require('@/assets/sass/main.scss')

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
// import '@mdi/font/css/materialdesignicons.css'
// import 'material-design-icons-iconfont/dist/material-design-icons.css'
Vue.use(Vuetify)

// import vuetify from "./plugins/vuetify";

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

// // iframe
// import VueFriendlyIframe from 'vue-friendly-iframe';
// Vue.use(VueFriendlyIframe);

// カンマ区切り保留
// Vue.filter('moneyDelimiter', function(value) {
//  return value.toLocaleString();
// });

// import VueCookies from 'vue-cookies'
// Vue.use(VueCookies)

Vue.config.productionTip = false

import Firebase from 'Firebase'
import firebase from "@firebase/app";
// import { firebaseConfig } from './config/firebase-config'
// // import "firebaseui-ja/dist/firebaseui.css";
// firebase.initializeApp(firebaseConfig)
// Vue.use(firebase)

Firebase.init();

// // 検証用
// store.dispatch('getInfo',{
// 	params: {},
// 	callback: function(res){
// 		console.log('test!!',res)
// 		// store.commit('SET_ISLOADING', false) 
// 	}
// });

firebase.auth().onAuthStateChanged(user => {
	// console.log('yaho')
	store.commit('SET_ISLOADING', true)
	if (user) {
		// ログイン情報
		if (user.ma) {
		  localStorage.setItem('jwt', user.ma);
		} 
		if (user.uid) {
			store.commit('SET_AUTH', user);
		 	store.commit('onUserStatusChanged', true) 

		 	// supersass
		 	store.dispatch('getUsers',function(e){
		 		// supersassに存在するかチェック
		      	let list = _.filter(e, function(o) {
		            if(user.email==o.name){
		              return o;
		            }
		        });
		        // console.log(user,e)
		      	if(list.length==0){
		      		// 存在しない場合、新規登録する
		      		store.dispatch('addUser',{
		      			params: user,
		      			callback: function(res){
		      				console.log('新規登録に成功しました!!')
		      				// store.commit('SET_ISLOADING', false) 
		      			}
		      		});
		      		return;
		      	}else{
		      		// 存在する場合、権限を確認し保有（true:一般、false:会員）
		      		if(!list[0].fk) store.commit('SET_AUTH_ROLE', false)
		      		else store.commit('SET_AUTH_ROLE', true)

		      		// checksum変換
		      		store.dispatch('getMD5',{
			      		params: list[0],
			      		callback: function(res){
			      			console.log('md5',res)
			      			store.commit('SET_AUTH_CHECKSUM', res) 
			      		}
			      	});
		      	}
		 	});
			
		} else {
		 	store.commit('onUserStatusChanged', false)
		}
	} else {
		store.commit('onAuthEmailChanged', "")
	}
	new Vue({
		router,
		store,
		vuetify: new Vuetify({
		}),
		render: h => h(App)
	}).$mount("#app");
})


// new Vue({
//   vuetify,
//   router,
//   render: h => h(App)
// }).$mount('#app')

// new Vue({
// 	vuetify: new Vuetify({
// 	}),
//   router,
//   render: h => h(App)
// }).$mount('#app')

// new Vue({
// 	Vuetify: new Vuetify({
// 		icons: {
// 	    	iconfont: 'mdi', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
// 	    },
// 	}),
//   router,
//   render: h => h(App)
// }).$mount('#app')
