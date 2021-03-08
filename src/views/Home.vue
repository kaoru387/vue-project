<template>
  <div id="home">
	<el-alert
		v-if="info.isResetPassword"
        class="text-left mb-3"
        type="error"
        description="パスワード再設定メールを送信しました。メールが届いているかをご確認ください。"
        show-icon>
    </el-alert>
	<el-button 
	 	v-if="auth.username==''"
		class="mt-1 mb-3"
		type="success" 
		@click="lineLogin">
	    LINEログイン
	</el-button>
	<!-- <a v-if="auth.username==''" :href="'https://vue-authentification-b7a7a.firebaseapp.com/?mode=lineLogin'" target="_blank" asp-area="" asp-controller="Account" asp-action="LineLogin">
      <img width="128" height="40" src="/images/btn_login_base.png"/>
    </a> -->
	<div v-else class="d-flex bd-highlight justify-content-center pt-2 pb-2">
		<span class="p-0 bd-highlight pr-2">
		  	<el-button type="success" @click="searchStudioNago">
			    + 名護スタジオ予約
			</el-button>
		</span>
		<span class="p-0 bd-highlight">
			<el-button type="danger" @click="searchStudioKoza">
		    	+ コザスタジオ予約
		  	</el-button>
		</span>
	</div>
	<div class="d-flex bd-highlight">
		<div class="p-0 flex-fill bd-highlight mt-2 mb-3">
			<div class="d-flex flex-column bd-highlight m-0 text-center">
		        <span class="p-0 bd-highlight">
		        	<a class="text-decoration-underline font-weight-bold" :style="{'color':'blue !important','font-size': '12pt'}" @click="sheet = !sheet">料金説明</a>
		        </span>
		    </div>
		</div>
	</div>
   	<!-- <div v-if="auth.username!=='' && auth.isAdmissionFee && auth.emailVerified && auth.credit==0">
	    <el-alert
	        class="text-left mb-3"
	        type="warning"
	        description="ポイントが不足しています。"
	        show-icon>
	    </el-alert>
	</div> -->
	<!-- <el-button v-if="!search_loading && auth.emailVerified" type="primary" @click="moveSearch">
	    + 会員の新規予約
	</el-button>
	<el-button v-if="auth.username==''" type="danger" @click="moveSearch">
    	+ 一般の新規予約
  	</el-button> -->
  	<div>
  		<template>
  			<div class="d-flex bd-highlight">
			  <div class="p-0 pr-3 pb-1 flex-fill flex-shrink-1 bd-highlight text-right">
			  	<span class="p-0 bd-highlight">
                	<span class="badge" :style="{'background-color': '#9DC0AC', 'color':'white'}">ナゴスタジオ</span>
                </span>
                <span class="p-0 bd-highlight">
                	<span class="badge" :style="{'background-color': '#F3C857', 'color':'white'}">コザスタジオ</span>
                </span>
			  </div>
			</div>

		  <div class="text-center">
		    <v-bottom-sheet v-model="sheet">
		      <v-sheet
		        class="text-center"
		        height="600px"
		      >
		        <v-btn
		          class="mt-3"
		          text
		          color="red"
		          @click="sheet = !sheet"
		        >
		          閉じる
		        </v-btn>
		        <div>
		        	<div class="text-center pt-5 pb-3" :style="{'color':'#03BFA5'}">
			        	<h4 class="font-weight-bold">支払方法</h4>
			      	</div>
			      	<div class="d-flex flex-column bd-highlight m-0 text-center">
					  <!-- <div class="p-0 bd-highlight">
					  	<img
							width="88" height="25"
						  	src="/images/Paypay_logo.png"
						  	alt="PayPay">
				      </div> -->
					  <div class="p-0 bd-highlight pt-2">
					  	<img
							width="182" height="22"
						  	src="/images/card_5brand.png"
						  	alt="card">
					  	<img
					  		class="ml-1"
							width="108" height="25"
						  	src="/images/Powered_by_Stripe_blurple.png"
						  	alt="stripe">
					  </div>
					</div>
		        </div>
		        <div class="m-1 mt-5">
		        	<div class="text-center pb-2 pt-4">
			        	<h5 class="font-weight-bold">料金説明</h5>
			      	</div>
					<div class="container" :style="{'border': '1px solid black'}">
					  <div class="row">
					  	<div class="col-2"></div>
					    <div class="col">
					    	<el-badge type="success" :value="'フラメンコの練習'"></el-badge>
					    </div>
					    <div class="col">
					    	<el-badge type="danger" :value="'一般・その他の利用'"></el-badge>
					    </div>
					  </div>
					  <div class="row pt-0">
					  	<div class="col-2 pr-0 text-center">個人利用</div>
					  	<div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥800 </div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,200</div>
							  <div class="p-0 bd-highlight">2時間：¥1,600</div>
							</div>
					    </div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥1,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,500</div>
							  <div class="p-0 bd-highlight">2時間：¥2,000</div>
							</div>
					    </div>
					  </div>
					  <div class="row pt-2">
					  	<div class="col-2 pr-0">
					  		<span class="font-weight-medium text-center">グループ利用</span>
					  	</div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥1,500</div>
							  <div class="p-0 bd-highlight">1.5時間：¥2,000</div>
							  <div class="p-0 bd-highlight">2時間：¥2,500</div>
							</div>
					    </div>
					    <div class="col"">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥2,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥2,500</div>
							  <div class="p-0 bd-highlight">2時間：¥3,000</div>
							</div>
					    </div>
					  </div>
					</div>
		        </div>
		      </v-sheet>
		    </v-bottom-sheet>
		  </div>
		</template>
    </div>
	<v-container>
		<full-calendar ref="calendar" 
			v-if="events.length"
	    	:events="events"
	    	:view-name="'dayGridMonth'">    	
		</full-calendar>
	</v-container>
	<v-container v-if="!loading">
		<h4 v-if="auth.username!==''" class="mt-1 mb-5" ref="courseContents">{{ auth.username }}さんご予約</h4>
		<my-reservation
		    v-for="(item, index) in contens"
			:key="'course-detail'+item.id" :item="item"
			:ref="'courseDetail'+item.id"
			@apply="apply" />
	</v-container>
  </div>
</template>
<style scoped>
	.test {
	  font-size: 10pt;
	  font-weight: 600;
	}
</style>
<script>
import store from '../store/app';
import _ from 'lodash';
import moment from "moment"

import FullCalendar from '../components/FullCalendar.vue'
import MyReservation from '../components/MyReservation'

import Firebase from "../Firebase";
import firebase from "@firebase/app";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_live_51I1LTfAXJN6gcxR4hNyT76w1LVnMGtnUEmrLgyURu6JRIg8niYPpCjn5XSmrjY9TSZg83XdZ4jt4iX7F88nOkeaN00kzBXdjQa');

export default {
	components: {
	    FullCalendar,
	    MyReservation,
	},
	data() {
    	return {
    		sheet: false,
    		search_loading: false,
    		search: {
    			name: ''
    		},
    		v0: true,
    		alert: true,
    		modal_visible: false,
    		modal_course_visible: false,
    		modal_resource_visible: false,
      		items: [],
      		// modal_shop_visible: false,
      		presonal: { name: 'presonal'},
      		group: { name: 'group'},
      		experience: { name: 'ex'},
      		// contens: [],
      		type_options: [{
	          value: '1',
	          label: '個人利用'
	        }, {
	          value: '2',
	          label: '団体利用',
	        }],
	        options: [{
	            value: '1',
	            label: '1時間'
	          }, {
	            value: '1.5',
	            label: '1.5時間',
	          }, {
	            value: '2',
	            label: '2時間',
	          }
	        ],
	  	}
	},
	computed: {
		loading() {
	      return store.state.isLoading;
	    },
	    events() {
	      return store.state.result.events;
	    },
	    selectDate() {
	      return store.state.selectDate;
	    },
	    auth() {
	      return store.state.auth;
	    },
	    supersass() {
	      return store.state.auth.supersass;
	    },
	    info() {
	      return store.state.info;
	    },
	    height() {
	    	return window.innterHeight;
	    },
	    contens() {
	      return store.state.result.myschedules;
	    },
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteUpdate');
	    next();
	},
	beforeRouteEnter (to, from, next) {
	    //ページの更新
	    console.log('beforeRouteEnter /Home');
	    // ログイン後か判定
	    let that = this;
	    next(vm => {
	    	console.log("vm",store.state.backuri);
	    	if(store.state.backuri=='') return;
	    	if(store.state.backuri=='/?mode=signedIn') {
		      	vm.$router.push({path: '/login'})
		    }
		    // 予約キャンセル
		    if(store.state.backuri=='/?mode=stripeCancel') {
		    	vm.$router.push({path: '/cancelpayment'})
		    }
		    // 決済成功
		    if(store.state.backuri=='/?mode=stripeSuccess') {
		    	vm.$router.push({path: '/successpayment'})
		    }
		    // 会員ポイント精算
		    if(store.state.backuri=='/?mode=stripeSuccessPoint') {
		    	vm.$router.push({path: '/successpaymentaddpoint'})
		    }
		    // // 入会金
		    // if(store.state.backuri=='/?mode=stripeSuccessAdmission') {
		    // 	vm.$router.push({path: '/successadmission'})
		    // }
		    // // パスワードリセット
		    // if(store.state.backuri=='/?mode=resetPassword') {
		    // 	console.log('reset!!!')
		    // 	vm.$router.push({path: '/resetpassword'})
		    // }
		    // // PayPay支払い
	    	// if(store.state.backuri=='/?mode=successPayPay') {
	    	// 	vm.$router.push({path: '/successpaypay'})
	    	// }
	    	if(store.state.backuri=='/?mode=successLineLogin') {
		        vm.$router.push({path: '/successlinelogin'})
		    }
		    if(store.state.backuri=='/?mode=lineLogin') {
		        vm.$router.push({path: '/linelogin'});
		    }
	    });
	},
	created: function () {
	},
	mounted(){
		// console.log('home mount');
	 // if(this.auth.username=='') return;
	 //    let that = this;
	 //    store.dispatch('getUserAgenda',{
		// 	params: {
		// 	  from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
		// 	  user_email: store.state.auth.email
		// 	},
		// 	// callback: function(res){
		// 	// 	that.contens = res;
		// 	// }
		// });
	},
	methods: {
		storeFunc(param) {
			console.log(param)
		},
		openModal(){
			// ログインチェック
			var that = this;
			let currentUserStatus = Firebase.auth().currentUser;
			if(currentUserStatus===null) {
				// ログイン未だの場合
				that.$router.push({path: '/account'});
				return;
			}
	    },
		openShop() {
	      // this.modal_shop_visible = true;
	      store.commit('SET_ISLOADING', true);
	      let that = this;
	      let parms = {
	        price: 4000,
	        email: that.auth.email
	      }
	      const processA = async function() {
	        const stripe = await stripePromise;
	        const response = await firebase.functions().httpsCallable('postStripe');
	        await response({
	          method: 'POST',
	          params: {
	            price: "price_1IJdUsAXJN6gcxR4UbytacgS",
	            quantity: 1,
	          },
	          mode: "payment",
	          success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessPoint",
	          cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
	          headers: {
	            "Accept": "*/*",
	            "Contsent-Type": "application/json; charset=utf-8",
	            "Access-Control-Allow-Origin": "*",
	          }
	        }).then((res) => {
				console.log(res)
				const session = res.data;
				const sessionId = session.id;

				// 一旦保持
				Firebase.db().collection("sessions").doc(parms.email)
				.set({
					sessionId: sessionId,
					params: parms,
					status: 'checkout'
				});
				const result = stripe.redirectToCheckout({
					sessionId: sessionId,
				});
				if (result.error) {
					console.log(result.error.message);
				}
	        });
	      }
	      const processAll = async function() {
	        await processA()
	      }
	      processAll()
	    },
		openAdmission() {
			// console.log('OK');
			store.commit('SET_ISLOADING', true)
			let that = this;
			const processA = async function() {
			const stripe = await stripePromise;
			const response = await firebase.functions().httpsCallable('postStripe');
			await response({
			  method: "POST",
			  params: {
			    price: "price_1IJeKsAXJN6gcxR42W81FB4f",
			    quantity: 1,
			  },
			  mode: "subscription",
			  success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessAdmission",
			  cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
			  headers: {
			    "Accept": "*/*",
			    "Contsent-Type": "application/json; charset=utf-8",
			    "Access-Control-Allow-Origin": "*",
			  }
			}).then((res) => {
			  const session = res.data;
			  const sessionId = session.id;
			  const result = stripe.redirectToCheckout({
			    sessionId: sessionId,
			  });
			  if (result.error) {
			    console.log(result.error.message);
			  }
			});
			}
			const processAll = async function() {
			await processA()
			}
			processAll();
		},
		storeFunc(param) {
		    if(param.name=='presonal'){ 	// 個人利用
		    	store.state.info.isPersonal=true;
		    }else if(param.name=='group'){  // グループ利用
		    	store.state.info.isPersonal=false;
		    }
		    this.$refs.dialogFullscreen.ready();
		    this.modal_visible = true;
	    },
		close_shop_modal: function() {
	        this.modal_shop_visible = false;
	    },
	    reservationNonMember(){
	      this.modal_experience_visible = true;
	    },
	    close_experience_modal: function() {
	      this.modal_experience_visible = false;
	    },
	    close_modal: function() {
	    	// console.log('close')
	    	this.modal_visible = false;
	    	this.modal_course_visible = false;
	    	this.modal_resource_visible = false;

	    	// this.reload();
	    	// store.commit('SET_ISLOADING', true)
	    	
		 //    // ユーザー情報更新
			// store.commit('SET_EVENTS', []);	// 初期化
		 //    var that = this;
		 //    store.dispatch('getUsers',function(users){
		 //    	let _id = store.state.auth.user_id
		 //    	let index =_.findIndex(users, function(o) { 
	  //               return o.id == _id; 
	  //           })
	  //           if(index != -1){
	  //             	// 保有ポイント更新
	  //               store.state.auth.credit = users[index].credit
	  //           }
			//     // that.reload();
			//     // 予約詳細
			//     that.filterContents(that.selectDate);
			//     // store.commit('SET_ISLOADING', false)
		 //    });

	    },
	    apply: function(item){
	    	this.$refs.dialogCourse.ready(item);
	    	this.modal_course_visible=true;
	    },
	    searchStudioNago() {
	    	store.commit('SET_ISLOADING', true)
			let date = moment().format('YYYY-MM-DD');
			// let start = moment().format('HH:mm');
			let start = moment().format('06:00');
			let search = {
				date: date,
				start: start,
				studio_name: 'ナゴスタジオ'
			}
			store.commit('SET_SELECT_SEARCH', search)
			this.goSearch(search)
	    },
	    searchStudioKoza() {
	    	store.commit('SET_ISLOADING', true)
			let date = moment().format('YYYY-MM-DD');
			// let start = moment().format('HH:mm');
			let start = moment().format('06:00');
			let search = {
				date: date,
				start: start,
				studio_name: 'コザスタジオ'
			}
			store.commit('SET_SELECT_SEARCH', search)
			this.goSearch(search)
	    },
	    goSearch(search) {
	    	// 検索初期値

	    	// 料金マスター
			let _documentName = "個人利用";
			// 会員の場合
			if(this.auth.username!=='' && this.auth.isLine) {
				_documentName = "スタジオレンタル（個人利用）";
			}
			store.commit('SET_SELECT_RESOURCES', [])
			store.dispatch('getFree', {
				params: {
				  date: search.date,
				  time: search.start,
				  time_zone: '1:00',
				  hour: 1.0,
				  document: _documentName,
				  use_type: '個人',
				  use_name: 'フラメンコ練習',
				  studio_name: search.studio_name,
				},
				callback: function(res){
				  // console.log(res)
				  // console.log('ge', res);
				  store.commit('SET_SELECT_RESOURCES', res)
				  store.commit('SET_ISLOADING', false)
				}
			});
	    	this.$router.replace('/studiosearch')

	    },
	    lineLogin() {
	    	// this.$router.replace('/linelogin')
	    	// const url = "https://localhost:4006";
	    	const url = "https://vue-authentification-b7a7a.firebaseapp.com";
	    	window.open(url+'/?mode=lineLogin', '_blank');
	    },
	    // onLinkClick() {
	    // 	store.commit('SET_ISLOADING', true)
	    // 	let that = this;
		   //  store.dispatch('saveUserAdmission',{
		   //    params: {
		   //      group_id: 1,
		   //    },
		   //    callback: function(res) {
		   //      console.log(res)
		   //      setTimeout(function(){
		   //          store.commit('SET_ISLOADING', false)
		   //          // window.location.href = "https://lin.ee/d0sbdmh";
		   //          window.location.href = "https://lin.ee/efAn9nW";
		   //      },1500);
		   //    }
		   //  });
	    // },
	    
	}
}
</script>
