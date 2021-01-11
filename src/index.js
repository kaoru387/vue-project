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

// import GAuth from 'vue-google-oauth2'
// Vue.use(GAuth, {
//   clientId: '768834812579-007e5802er7gj3c93p8qa9568h8bj3na.apps.googleusercontent.com', scope: 'email', prompt: 'consent', fetch_basic_profile: false
// })

// iframe
import VueFriendlyIframe from 'vue-friendly-iframe';
Vue.use(VueFriendlyIframe);

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)

Vue.config.productionTip = false

import Firebase from 'Firebase'
import firebase from "@firebase/app";
// import { firebaseConfig } from './config/firebase-config'
// // import "firebaseui-ja/dist/firebaseui.css";
// firebase.initializeApp(firebaseConfig)
// Vue.use(firebase)


Firebase.init();

firebase.auth().onAuthStateChanged(user => {
	if (user) {
		// console.log(user);
		if (user.ma) {
		  localStorage.setItem('jwt', user.ma);
		} 
		if (user.uid) {
			store.commit('SET_AUTH', user);
		 	store.commit('onUserStatusChanged', true) 

		 	// supersass
		 	store.dispatch('getUsers',function(e){
		 		// supersassに存在するかチェック
		      	let list = _.filter(e.data, function(o) {
		            if(user.email==o.email){
		              return o;
		            }
		        });
		      	if(list.length==0){
		      		// 存在しない場合、新規登録する
		      		store.commit('SET_ISLOADING', true)
		      		store.dispatch('addUser',{
		      			params: user,
		      			// {
		      			// 	full_name: user.displayName,
	      				// 	name: user.email,
	      				// 	password: user.displayName,
		      			// 	id: user.uid
		      			// },
		      			callback: function(res){
		      				console.log('新規登録に成功しました!!',res)
		      				store.commit('SET_ISLOADING', false) 
		      			}
		      		});
		      		return;

		      	}else{
		      		// 存在する場合、権限を確認し保有（true:一般、false:会員）
		      		if(!list[0].fk) store.commit('SET_AUTH_ROLE', false)
		      		else store.commit('SET_AUTH_ROLE', true)

		      		// TODO: checksum不具合解決まで・・
		      		// console.log('yaho',list[0].super_field)
		      		store.commit('SET_AUTH_CHECKSUM', list[0].super_field) 
		      		store.commit('SET_ISLOADING', false)

		      		// 失敗
		      		// supersassログイン
		      		// store.dispatch('loginSupersass',{
			      	// 	params: {
			      	// 		email: list[0].email,
			      	// 		checksum: list[0].super_field,
			      	// 	}
			      	// });
		      	}
		      	// ハッシュ値取得：検証用
		      	// store.dispatch('getMD5',{
		      	// 	params: {
		      	// 		'user_name':user.email
		      	// 	}
		      	// });

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
