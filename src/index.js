import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store/app";

require('./styles/style.scss')

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify)

import ElementUI from 'element-ui'
import { Dialog } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
Vue.use(BootstrapVue)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

// バリデーション
import VeeValidate, { localize } from'vee-validate'
import ja from 'vee-validate/dist/locale/ja.json';
localize('ja',ja);
Vue.use(localize)
import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';
extend('required', required);
extend('email', email);
extend('min', min);

import firebase from "@firebase/app";
import Firebase from 'Firebase'
Firebase.init();

// // 検証用
// store.dispatch('addAppointment',{
// 	params: {
// 	  start: '2021-02-12 09:00:00',
// 	  finish: '2021-02-12 10:00:00',
// 	  resource_id: 794202,
// 	  price: 800,
// 	},
// 	callback: function(res){
// 	  // 初期化
// 	  localStorage.setItem('OK', res);
// 	  // window.location.href = '/';
// 	}
// });

// Firestore db作成
store.dispatch('getInfo',{
// store.dispatch('addAppointment',{
	params: {},
	callback: function(res){

		// _.forEach(store.state.result.bookings, function(v, k) {
		// 	// ユーザマスター
		// 	// Firebase.db().collection("balances").doc(v['email'])
	 //  //         .set({
	 //  //         	id: v['id'],
	 //  //           name: v['email'],
	 //  //       });

	 //  		// 予約
	 //        var washingtonRef = Firebase.db().collection("balances").doc(v['email']);
		// 	washingtonRef.update({
		// 	    bookings: firebase.firestore.FieldValue.arrayUnion({
		// 	    	product_name: v['product_name'],
		// 	    	date: v['date'],
		// 	    	price: v['price'],
		// 	    	start: v['start'],
		// 	    	finish: v['finish'],
		// 	    	created: v['created'],
		// 	    })
		// 	});
			
		// });

		// // 料金マスター作成
		// _.forEach(res, function(v, k) {
  //         // console.log(v.id, k);
  //         Firebase.db().collection("schedules").doc(v.name)
  //         .set({
  //         	id: v.id,
  //           name: v.name,
  //           type: 'resource',
  //           group: 'mamber',
  //           resources: {
  //           	'1:00': {name:"1時間",price: 800},
  //           	'1:30': {name:"1.5時間",price: 1200},
  //           	'2:00': {name:"2時間",price: 1600}
  //           }
  //         });
  //       })
	}
});

Firebase.auth().onAuthStateChanged(user => {
	// 
	store.commit('SET_ISLOADING', true)
	let that = this;
	if (user) {
		// ログイン情報
		if (user.ma) {
		  localStorage.setItem('jwt', user.ma);
		} 
		if (user.uid) {

			// メール認証済のみユーザ管理
			if(user.emailVerified) {
				// console.log('emailVerified')
				store.commit('SET_AUTH', user);
		 		store.commit('onUserStatusChanged', true)
			}

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
			      			console.log('get md5')
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
