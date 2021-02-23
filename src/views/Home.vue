
<script src="https://www.line-website.com/social-plugins/js/thirdparty/loader.min.js" async="async" defer="defer"></script>
<template>
  <div id="home">
  	<!-- <b-badge class="sample mr-1 badge-success" pill>スタジオ予約</b-badge>個人利用 -->
  	<!-- 再読み込み -->
  	<!-- <el-alert
  		:closable="false"
  		class="text-left pt-1 pb-1 mt-1"
	    type="success"
	    description="どなたでもお気軽にご予約ください。会員登録いただくとお得なチケット購入できます！"
	    show-icon>
	</el-alert> -->
	<!-- <el-dropdown v-if="auth.username==''" @command="storeFunc" trigger="click">
	  <el-button type="warning">
	    + ログインなしで新規予約する<i class="el-icon-arrow-down el-icon--right"></i>
	  </el-button>
	  <el-dropdown-menu slot="dropdown">
	  	<el-dropdown-item :command="presonal">
	  		<span>個人利用</span>
		</el-dropdown-item>
	  	<el-dropdown-item :command="group">	
	  		<span>グループ利用</span>
	  	</el-dropdown-item>
	  </el-dropdown-menu>
	</el-dropdown> -->
	<!-- <el-button v-else-if="!search_loading" type="primary" @click="openResources">
	    + 新規予約する
	</el-button> -->
	<el-alert
		v-if="info.isResetPassword"
        class="text-left mb-3"
        type="error"
        description="パスワード再設定メールを送信しました。メールが届いているかをご確認ください。"
        show-icon>
    </el-alert>
	<!-- <span v-if="auth.username==''" @click="openModal">
		<el-alert
			v-if="auth.username==''"
	        class="text-left mb-3"
	        type="warning"
	        description="会員登録いただくと一回のレンタル料がお安くなります。こちらをクリックしてご登録ください!!">
	    </el-alert>
	</span> -->
	<div class="d-flex bd-highlight">
		<div class="p-0 flex-fill bd-highlight w-100 text-right mt-2 mb-3">
			<div class="d-flex flex-column bd-highlight m-0 text-center">
		        <!-- <span class="p-0 bd-highlight">
		        	<el-button 
				    	v-if="auth.username==''"
				    	type="danger" @click="openModal">
					    会員新規登録
					</el-button>
		        </span> -->
		        <span class="p-0 bd-highlight">
		        	<a class="text-decoration-underline" :style="{'color':'blue !important','font-size': '12pt'}" @click="sheet = !sheet">料金説明</a>
		        </span>
		    </div>
		</div>
	</div>
	
    <!-- <span v-if="auth.username!=='' && !auth.isAdmissionFee && auth.emailVerified">
		<el-alert
	        class="text-left mb-3"
	        type="warning"
	        description="レッスン受講生は入会金支払い不要です。管理者が承認するまでお待ち下さい。"
	        show-icon>
	    </el-alert>
    </span>
    <el-button 
    	v-if="auth.username!=='' && !auth.isAdmissionFee && auth.emailVerified"
    	class="mt-2 mb-3"
    	type="warning" @click="openAdmission">
	    入会金支払い・入会申し込みを完了する
	</el-button> -->

	<!-- <div role="alert" class="alert alert-warning pl-3 p-2 text-left" @click="openAdmission">
    	<v-icon color="#856404" class="mb-1">mdi-alert-circle</v-icon><span :style="{'cursor': 'e-resize'}"  class="ml-1">入会金をお支払いいただければ、一回のレンタル料がお安くなるチケットを購入できます。</span>
    </div> -->
    <!-- <el-button 
    	v-if="auth.username!=='' && auth.isAdmissionFee && auth.emailVerified"
    	class="mt-2 mb-2"
    	type="primary" @click="openShop">
	    チケットを購入してポイント追加する
	</el-button> -->
	<div v-if="auth.username!=='' && !auth.isLine">
	    <!-- <el-alert
	        class="text-left mt-2 mb-3"
	        type="success"
	        description="会員登録いただき誠にありがとうございます。是非お客様のLINEの友だちに追加お願いいたしますm(__)m"
	        show-icon>
	    </el-alert> -->
		<!-- <el-button 
	    	class="mt-1 mb-3"
	    	type="success" 
	    	@click="onLinkClick">
		    LINE友達になる
		</el-button> -->
	</div>

   	<!-- <div v-if="auth.username!=='' && auth.isAdmissionFee && auth.emailVerified && auth.credit==0">
	    <el-alert
	        class="text-left mb-3"
	        type="warning"
	        description="ポイントが不足しています。"
	        show-icon>
	    </el-alert>
	</div> -->
    <el-alert
		v-if="auth.username!=='' && !auth.emailVerified"
        class="text-left mb-3"
        type="error"
        description="メール認証がまだ完了していないため予約できません。メールが届いているかをご確認ください。"
        show-icon>
    </el-alert>
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
		        <!-- <div>
		        	<div class="text-center pt-3 text-primary">
			        	<h4>レッスン受講生</h4>
			      	</div>
			      	<div class="d-flex flex-column bd-highlight m-0 text-center">
					  <div class="p-0 bd-highlight">
					  	<v-icon 
				        class="pr-1 pb-1"
				        large
				        color="#03BFA5"
				        :style="{'font-size':'20px'}"
				      	>mdi-check-circle</v-icon>
				      	<span>入会金不要</span>
				      </div>
					  <div class="p-0 bd-highlight">
					  	<v-icon 
				        class="pr-1 pb-1"
				        large
				        color="#03BFA5"
				        :style="{'font-size':'20px'}"
				      	>mdi-check-circle</v-icon>
				      	<span>会員様価格</span>
					  </div>
					</div>
		        </div> -->

		        <div class="m-1 mt-5">
		        	<div class="text-center pb-2 pt-2">
			        	<h4>料金説明</h4>
			      	</div>
					<div class="container" :style="{'border': '1px solid black'}">
					  <div class="row">
					  	<div class="col-2"></div>
					    <div class="col">
					    	<el-badge type="danger" :value="'一般のお客様'"></el-badge>
					    </div>
					    <div class="col">
					    	<el-badge type="success" :value="'会員様'"></el-badge>
					    </div>
					  </div>
					  <!-- 
					  <div class="row" :style="{'border': '1px solid black'}">
					  	<div class="col-2 pr-0">
					  		<span class="font-weight-medium text-left">入会金</span></div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-center">
							  <div class="p-0 bd-highlight">不要</div>
							</div>
					    </div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">¥4,000/年</div>
							</div>
					    </div>
					  </div> -->
					  <div class="row pt-3" :style="{'border': '1px solid black'}">
					  	<div class="col-2 pr-0">
					  		<span class="font-weight-medium text-left">チケット購入</span></div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-center">
							  <div class="p-0 bd-highlight">不可</div>
							</div>
					    </div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0">
							  <div class="p-0 bd-highlight text-right">¥3,000/回</div>
							  <div class="p-0 bd-highlight text-left">
								  <span class="test">¥4,000分のポイントが加算されます!</span>
								</div>
							</div>
					    </div>
					  </div>
					  <div class="row pt-2">
					  	<div class="col-2 pr-0">
					  		<span class="font-weight-medium text-left">個人利用</span></div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥1,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,500</div>
							  <div class="p-0 bd-highlight">2時間：¥2,000</div>
							</div>
					    </div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥800 </div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,200</div>
							  <div class="p-0 bd-highlight">2時間：¥1,600</div>
							</div>
					    </div>
					  </div>
					  <div class="row pt-3">
					  	<div class="col-2 pr-0 text-left">グループ利用</div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥2,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥2,500</div>
							  <div class="p-0 bd-highlight">2時間：¥3,000</div>
							</div>
					    </div>
					    <div class="col"">
					    	<div class="d-flex flex-column bd-highlight m-0 text-right">
							  <div class="p-0 bd-highlight">1時間：¥1,500</div>
							  <div class="p-0 bd-highlight">1.5時間：¥2,000</div>
							  <div class="p-0 bd-highlight">2時間：¥2,500</div>
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
	<!-- <div v-else>
		<div class="d-flex">
			<v-list-item three-line>
		      <v-list-item-content>
		      	<el-alert
			      class="mt-2 mb-1"
			      type="success"
			      description="利用可能時間表示中..."
			      show-icon>
			    </el-alert>
		        <v-list-item-subtitle class="text-right p-2">{{ search.name }}</v-list-item-subtitle>
		        <v-list-item-subtitle v-if="auth.username!=='' && !auth.isAdmissionFee" class="text-left p-2">
		        	<el-alert
				      class="mt-2 mb-1"
				      type="error"
				      description="入会金未払いのため、一般価格になります。"
				      show-icon>
				    </el-alert>
		        </v-list-item-subtitle>
		      </v-list-item-content>
		    </v-list-item>
	   	</div>
	</div> -->
	<v-container>
		<calendar ref="calendar" 
			v-if="events.length"
	    	:events="events"
	    	:view-name="'dayGridMonth'">    	
		</calendar>
	</v-container>
	<v-container v-if="!loading">
		<h4 v-if="auth.username!==''" class="mt-1 mb-5" ref="courseContents">{{ auth.username }}さんご予約</h4>
		<my-reservation
		    v-for="(item, index) in contens"
			:key="'course-detail'+item.id" :item="item"
			:ref="'courseDetail'+item.id"
			@apply="apply" />
		<!-- <el-alert
			v-if="contens.length==0"
	  		:closable="false"
	  		class="text-left"
		    type="warning"
		    description="選択日付の予定はありません。"
		    show-icon>
		</el-alert> -->
	</v-container>
	<!-- 予約 -->
	<!-- <modal-reservation-studio 
		ref="dialogFullscreen"
		:dialog-form-visible="modal_visible" 
		:close-modal="close_modal"
		@reload="reload"
	 /> -->
	 <!-- 申込み -->
	 <!-- <modal-reservation-course 
		ref="dialogCourse"
		:dialog-form-visible="modal_course_visible" 
		:close-modal="close_modal"
		@reload="reload"
	 /> -->
	 <!-- メニュー選択画面 -->
	 <!-- <modal-resources 
		ref="dialogResources"
		:dialog-form-visible="modal_resource_visible" 
		:close-modal="close_modal"
		@searchFree="searchFree" 
	 />
	 -->
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
import Calendar from '../components/FullCalendar.vue'
// import ModalReservationStudio from '../components/ModalReservationStudio'
// import ModalReservationCourse from '../components/ModalReservationCourse'
import MyReservation from '../components/MyReservation'
// import CourseDetail from '../components/CourseDetail'
// import ModalResources from '../components/ModalResources'

import Firebase from "../Firebase";
import firebase from "@firebase/app";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');


import _ from 'lodash';
import moment from "moment"

export default {
	components: {
	    Calendar,
	    // ModalReservationStudio,
	    // ModalReservationCourse,
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
	          // , {
	          //   value: 'Option4',
	          //   label: 'Option4',
	          //   disabled: true
	          // }
	        ],
	        use_type: '',
	        time_zone: ''
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
	    	if(store.state.backuri=='') return;
	    	console.log("vm",store.state.backuri)
	    	if(store.state.backuri=='/?mode=signedIn') {
		      	// ログイン後フラグを初期化
		      	// store.commit('SET_BACK_URI', '');
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
		    // 入会金
		    if(store.state.backuri=='/?mode=stripeSuccessAdmission') {
		    	vm.$router.push({path: '/successadmission'})
		    }
		    // 
		    if(store.state.backuri=='/?mode=resetPassword') {
		    	console.log('reset!!!')
		    	vm.$router.push({path: '/resetpassword'})
		    }
	    });
	},
	created: function () {
	
	},
	mounted() {
	 	if(this.auth.username=='') return;
	    let that = this;
	    store.dispatch('getUserAgenda',{
			params: {
			  from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			  user_email: store.state.auth.email
			},
			// callback: function(res){
			// 	that.contens = res;
			// }
		});
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
	      store.commit('SET_ISLOADING', true)
	      
	      let that = this;
	      let parms = {
	        price: 4000,
	        email: that.auth.email
	      }
	      const processA = async function() {
	        const stripe = await stripePromise;
	        const response = await firebase.functions().httpsCallable('postStripe');
	        await response({
	          // path: '/create-checkout-session-ticket',
	          method: 'POST',
	          params: {
	            price: "price_1IJdUsAXJN6gcxR4UbytacgS",
	            quantity: 1,
	          },
	          mode: "payment",
	          // success_url: "https://localhost:4006/?mode=stripeSuccessPoint",
	          success_url: "https://kdev.page/?mode=stripeSuccessPoint",
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
			console.log('OK')
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
			  // success_url: "https://localhost:4006/?mode=stripeSuccessAdmission",
			  success_url: "https://kdev.page/?mode=stripeSuccessAdmission",
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
			processAll()

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
	    moveSearch() {
	    	store.commit('SET_ISLOADING', true)
	    	this.$router.push({path: '/studiosearch'})
	    },
	    onLinkClick() {
	    	store.commit('SET_ISLOADING', true)
	    	let that = this;
		    store.dispatch('saveUserAdmission',{
		      params: {
		        group_id: 1,
		      },
		      callback: function(res){
		        console.log(res)
		        setTimeout(function(){
		            store.commit('SET_ISLOADING', false)
		            window.location.href = "https://lin.ee/d0sbdmh";
		        },1500);
		      }
		    });

	    	
	    }

	  //   searchFree(form){
	  //   	// 検索
	  //   	let that = this
	  //   	that.search_loading = true;
	  //   	let target_date = this.$moment(form.date).format('YYYY-MM-DD');
	  //   	let item = {
			// 	dateStr: target_date
			// }
			// let use_type = "個人";
			// if(form.use_type == "スタジオ予約グループ") use_type = "グループ"
			// this.search.name = '日付：' + target_date + ',入室時間：' + form.time + ',利用タイプ：' + use_type + ',スタジオ：' + form.studio

			// store.commit('SET_SELECT_SEARCH', form)

			// // イベント初期化
			// let len = store.state.result.events.length;
			// // 全削除だと日表示にならない
			// store.state.result.events.splice(0, len-1)
	  //   	// _.forEach(store.state.result.events, function(v, k) {
	  //   	// 		let dt=that.$moment(v.start).utc().format('YYYY-MM-DD');
	  //   	// 		if(target_date == dt) store.state.result.events.splice(k, k)	
	  //   	// });

	  //   	// 利用可能時間を取得し、対象日カレンダーに表示する
	  //   	this.modal_resource_visible = false;
			// this.$refs['calendar'].handleDateClick(item)
	  //   	store.dispatch('getFree',{
			// 	params: form,
			// 	callback: function(res){
			// 		console.log('update')
			// 	}
			// });
	  //   }
	}
}
</script>
