import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from "./store/app";

require('./styles/style.scss')

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.css'
Vue.use(Vuetify)

import ElementUI from 'element-ui'
import { Dialog } from 'element-ui'
import locale from 'element-ui/lib/locale/lang/ja'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css'

import BootstrapVue from "bootstrap-vue"
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
Vue.use(BootstrapVue)
Vue.use(ElementUI, { locale })
Vue.config.productionTip = false

// バリデーション
import VeeValidate, { localize } from'vee-validate'
import ja from 'vee-validate/dist/locale/ja.json';
localize('ja',ja);
Vue.use(localize);

import { extend } from 'vee-validate';
import { required, email, min } from 'vee-validate/dist/rules';
extend('required', required);
extend('email', email);
extend('min', min);

import firebase from "@firebase/app";
import Firebase from 'Firebase'
Firebase.init();

window.jQuery = window.$ = require('jquery');

// <!-- JS Global Compulsory -->
require('../assets/vendor/jquery/jquery.min.js');
require('../assets/vendor/jquery-migrate/jquery-migrate.min.js');
require('../assets/vendor/popper.js/popper.min.js');
require('../assets/vendor/bootstrap/bootstrap.min.js');

// <!-- JS Implementing Plugins -->
require('../assets/vendor/jquery.countdown.min.js');
require('../assets/vendor/slick-carousel/slick/slick.js');
require('../assets/vendor/hs-megamenu/src/hs.megamenu.js');
require('../assets/vendor/malihu-scrollbar/jquery.mCustomScrollbar.concat.min.js');
require('../assets/vendor/appear.js');

// <!-- JS Unify -->
// require('../assets/js/hs.core.js');
// require('../assets/js/components/hs.header.js');
// require('../assets/js/helpers/hs.hamburgers.js');
// require('../assets/js/components/hs.dropdown.js');
// require('../assets/js/components/hs.scrollbar.js');

// <script src="../assets/js/components/hs.go-to.js"></script>

// <!-- JS Implementing Plugins -->
require('../assets/vendor/hs-megamenu/src/hs.megamenu.js');
require('../assets/vendor/malihu-scrollbar/jquery.mCustomScrollbar.concat.min.js');

// <!-- JS Unify -->
require('../assets/js/hs.core.js');
require('../assets/js/components/hs.header.js');
require('../assets/js/helpers/hs.hamburgers.js');
require('../assets/js/components/hs.dropdown.js');
require('../assets/js/components/hs.scrollbar.js');
require('../assets/js/components/hs.go-to.js');

require('../assets/js/components/hs.countdown.js');
require('../assets/js/components/hs.count-qty.js');
require('../assets/js/components/hs.carousel.js');

// <!-- JS Customization -->
require("../assets/js/custom.js");


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
// store.dispatch('getInfo',{
// // store.dispatch('addAppointment',{
// 	params: {},
// 	callback: function(res){
// 		_.forEach(store.state.result.bookings, function(v, k) {
// 			// ユーザマスター
// 			// Firebase.db().collection("balances").doc(v['email'])
// 	  //         .set({
// 	  //         	id: v['id'],
// 	  //           name: v['email'],
// 	  //       });

// 	  // 		// 予約
// 	  //       var washingtonRef = Firebase.db().collection("balances").doc(v['email']);
// 			// washingtonRef.update({
// 			//     bookings: firebase.firestore.FieldValue.arrayUnion({
// 			//     	product_name: v['product_name'],
// 			//     	date: v['date'],
// 			//     	price: v['price'],
// 			//     	start: v['start'],
// 			//     	finish: v['finish'],
// 			//     	created: v['created'],
// 			//     })
// 			// });
// 		});

// 		// // 料金マスター作成
// 		// _.forEach(res, function(v, k) {
//   //         // console.log(v.id, k);
//   //         Firebase.db().collection("schedules").doc(v.name)
//   //         .set({
//   //         	id: v.id,
//   //           name: v.name,
//   //           type: 'resource',
//   //           group: 'mamber',
//   //           resources: {
//   //           	'1:00': {name:"1時間",price: 800},
//   //           	'1:30': {name:"1.5時間",price: 1200},
//   //           	'2:00': {name:"2時間",price: 1600}
//   //           }
//   //         });
//   //       })
// 	}
// });
Firebase.auth().onAuthStateChanged(user => {

	store.commit('SET_ISLOADING', true);
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
				// store.commit('SET_AUTH', user);
		 		store.commit('onUserStatusChanged', true)
			}
			store.commit('SET_AUTH', user);
			
			//---------------
		 	// supersass
		 	//---------------
		 	// ログイン名取得
		 	let password = user.email;
			let name = user.email;
			if(user.email==null) {
				// 電話ログインの場合
				password = user.phoneNumber;
				name = user.phoneNumber;
			}
		 	store.dispatch('getUsers',function(e){
		 		// supersassに存在するかチェック
		      	let list = _.filter(e, function(o) {
		            if(name==o.name){
		              return o;
		            }
		        });
		      	if(list.length==0){
		      		let full_name = name;
		      		if(user.displayName!==null) full_name = user.displayName;
		      		let newUser = {
		      			'full_name': full_name,
		      			'email': user.email,
			            'name': name,
			            'password': password,
			            'phone': user.phoneNumber,
			            'address': "",
		      		}
		      		// 存在しない場合、新規登録する
		      		store.dispatch('addUser',{
		      			params: newUser,
		      			callback: function(res){
		      				console.log('新規登録に成功しました!!',res)
		      			}
		      		});
		      		return;
		      	}else{
		      		// console.log(list[0])
		      		// 存在する場合、権限を確認し保有（true:一般、false:会員）
		      		if(!list[0].fk) store.commit('SET_AUTH_ROLE', false)
		      		else store.commit('SET_AUTH_ROLE', true)

	      			// // checksum変換
		      		// store.dispatch('getMD5',{
			      	// 	params: list[0],
			      	// 	callback: function(res){
			      	// 		// console.log('get md5',res)
			      	// 		store.commit('SET_AUTH_CHECKSUM', res) 
			      	// 	}
			      	// });
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
		render: h => h(App),
		methods: {
		  window:onload = function() {  
		   	$.HSCore.components.HSScrollBar.init($('.js-scrollbar'));
		  },
		},
		mounted: function() {
		 	// console.log('yaho');

		 	$.HSCore.components.HSCarousel.init('[class*="js-carousel"]');

		 	// initialization of header
	        $.HSCore.components.HSHeader.init($('#js-header'));
	        $.HSCore.helpers.HSHamburgers.init('.hamburger');

	        // initialization of HSMegaMenu component
	        $('.js-mega-menu').HSMegaMenu({
	          event: 'hover',
	          pageContainer: $('.container'),
	          breakpoint: 991
	        });

	        // initialization of HSDropdown component
	        $.HSCore.components.HSDropdown.init($('[data-dropdown-target]'), {
	          afterOpen: function () {
	            $(this).find('input[type="search"]').focus();
	          }
	        });

	        // initialization of HSScrollBar component
	        $.HSCore.components.HSScrollBar.init($('.js-scrollbar'));


		    // initialization of countdowns
		    var countdowns = $.HSCore.components.HSCountdown.init('.js-countdown', {
		        yearsElSelector: '.js-cd-years',
		        monthElSelector: '.js-cd-month',
		        daysElSelector: '.js-cd-days',
		        hoursElSelector: '.js-cd-hours',
		        minutesElSelector: '.js-cd-minutes',
		        secondsElSelector: '.js-cd-seconds'
		    });

	        // initialization of go to
	        $.HSCore.components.HSGoTo.init('.js-go-to');


	        $('#carouselCus1').slick('setOption', 'responsive', [{
	          breakpoint: 1200,
	          settings: {
	            slidesToShow: 4
	          }
	        }, {
	          breakpoint: 992,
	          settings: {
	            slidesToShow: 3
	          }
	        }, {
	          breakpoint: 768,
	          settings: {
	            slidesToShow: 2
	          }
	        }], true);

		    $('#carouselCus2').slick('setOption', 'responsive', [{
		        breakpoint: 1200,
		        settings: {
		          slidesToShow: 3
		        }
		      }, {
		        breakpoint: 992,
		        settings: {
		          slidesToShow: 2
		        }
		      }, {
		        breakpoint: 768,
		        settings: {
		          slidesToShow: 1
		        }
		      }, {
		        breakpoint: 480,
		        settings: {
		          slidesToShow: 1
		        }
		      }], true);


		}
	}).$mount("#app");
});
