<template>
  <div id="home">
  	<!-- Login -->
    <section class="container p-0 g-mt-50 g-pb-20">
      <div class="row justify-content-between">
        <div class="col-md-6 col-lg-5 order-lg-2 g-mb-80">
          <div class="g-brd-around g-brd-gray-light-v3 g-bg-white rounded g-px-30 g-py-50 mb-4">
            <header class="text-center mb-4">
              <h1 class="h4 g-color-black g-font-weight-400">ログインしてください</h1>
            </header>
            <!-- Form -->
            <form class="g-py-15" :loading="loading">
            	<div class="mb-4 text-center">
            		<span class="g-font-weight-400">LINEアカウントご利用の方</span>
            	</div>
            	<div class="mb-4">
            		<p class="g-color-gray-dark-v4 mt-1">以下の条件にチェックを入れて、LINEログインをご利用ください。</p>
            		<label class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-13 g-pl-25 mb-0">
                  <!-- <span class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0">
                    <i class="fa" data-check-icon="&#xf00c"></i>
                  </span> -->
                  <input v-model="line.condition1" type="checkbox" name='checkbox' class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0"><i class="fa" data-check-icon="&#xf00c"></i></input>
                  LINEアカウントにメールアドレスが設定されている。
                </label>
                <label class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-13 g-pl-25 mt-2">
                  <!-- <span class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0">
                    <i class="fa" data-check-icon="&#xf00c"></i>
                  </span> -->
                  <input v-model="line.condition2" type="checkbox" name='checkbox' class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0"><i class="fa" data-check-icon="&#xf00c"></i></input>
                  LINEアカウント情報の共有を許可する。
                </label>
              </div>

              <!-- <div class="mb-4">
                <div class="input-group g-rounded-left-3">
                  <span class="input-group-prepend g-width-45">
                    <span class="input-group-text justify-content-center w-100 g-bg-transparent g-brd-gray-light-v3 g-color-gray-dark-v5">
                      <i class="icon-finance-067 u-line-icon-pro"></i>
                    </span>
                  </span>
                  <input class="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v3 g-rounded-left-0 g-rounded-right-3 g-py-15 g-px-15" type="email" placeholder="Email Adress">
                </div>
              </div>

              <div class="mb-4">
                <div class="input-group g-rounded-left-3 mb-4">
                  <span class="input-group-prepend g-width-45">
                    <span class="input-group-text justify-content-center w-100 g-bg-transparent g-brd-gray-light-v3 g-color-gray-dark-v5">
                      <i class="icon-media-094 u-line-icon-pro"></i>
                    </span>
                  </span>
                  <input class="form-control g-color-black g-bg-white g-bg-white--focus g-brd-gray-light-v3 g-rounded-left-0 g-rounded-right-3 g-py-15 g-px-15" type="password" placeholder="Password">
                </div>
              </div>

              <div class="row justify-content-between mb-5">
                <div class="col align-self-center">
                  <label class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-13 g-pl-25 mb-0">
                    <input class="g-hidden-xs-up g-pos-abs g-top-0 g-left-0" type="checkbox">
                    <span class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0">
                      <i class="fa" data-check-icon="&#xf00c"></i>
                    </span>
                    Keep signed in
                  </label>
                </div>
                <div class="col align-self-center text-right">
                  <a class="g-font-size-13" href="page-password-recovery-1.html">Forgot password?</a>
                </div>
              </div> -->

              <div class="mb-4 text-center">
                <!-- <button class="btn btn-block u-btn-primary g-font-size-12 text-uppercase g-py-12 g-px-25" type="button">Login</button> -->
      					<el-button 
                  :disabled="!line.condition1 || !line.condition2"
      						class="mt-1 mb-3"
      						type="success" 
      						@click="lineLogin">
      					    LINEログイン
      					</el-button>
              </div>

              <div class="d-flex justify-content-center text-center g-mb-30">
                <div class="d-inline-block align-self-center g-width-50 g-height-1 g-bg-gray-light-v1"></div>
                <span class="align-self-center g-color-gray-dark-v5 mx-4">OR</span>
                <div class="d-inline-block align-self-center g-width-50 g-height-1 g-bg-gray-light-v1"></div>
              </div>

              <div class="row no-gutters">
                <div class="col-12 text-center">
                	<a class="text-decoration-underline" href="#" @click="goLogin" :disabled="loading">
                	電話番号ログイン
              	</a>
                </div>
              </div>
            </form>
            <!-- End Form -->
          </div>
          <!-- <div class="text-center">
            <p class="g-color-gray-dark-v5 mb-0">Artsアカウントはお持ちですか？
              <a class="g-font-weight-600" href="page-signup-1.html">新規作成</a></p>
          </div> -->
        </div>

        <div class="col-md-6 order-lg-1 g-mb-80">
          <div class="text-center g-mb-40">
            <h2 class="h1 g-font-weight-400 mb-3">料金表</h2>
          </div>
          <div class="row">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col" class="text-center">
                    <span class="g-font-size-17">フラメンコの<br>練習</span>
                  </th>
                  <th scope="col" class="text-center">
                    <span class="g-font-size-17">その他の<br>利用</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" colspan="3" class="text-left">
                    <span class="g-font-size-14" :style="{'color':'#696969 !important'}">個人利用</span>
                  </th>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">1時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥800</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥1,000</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">1.5時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥1,200</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥1,500</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">2時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥1,600</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥2,000</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" colspan="3" class="text-left" :style="{'color':'#696969 !important'}">
                    <span class="g-font-size-14">グループ利用</span>
                  </th>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">1時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥1,500</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥2,000</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">1.5時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥2,000</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥2,500</span>
                  </td>
                </tr>
                <tr>
                  <th scope="row" class="text-center">
                    <span class="g-font-size-12">2時間</span>
                  </th>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥2,500</span>
                  </td>
                  <td class="text-right p-2 text-secondary">
                    <span class="g-font-size-14">¥3,000</span>
                  </td>
                </tr>
              </tbody>
            </table> 
          </div>
        </div>
      </div>
    </section>
    <!-- End Login -->

    <!-- Call to Action -->
    <!-- <div class="g-bg-primary">
      <div class="container g-py-20">
        <div class="row justify-content-center">
          <div class="col-md-4 mx-auto g-py-20">
            
            <div class="media g-px-50--lg">
              <i class="d-flex g-color-white g-font-size-40 g-pos-rel g-top-3 mr-4 icon-real-estate-048 u-line-icon-pro"></i>
              <div class="media-body">
                <span class="d-block g-color-white g-font-weight-500 g-font-size-17 text-uppercase">簡単ログイン</span>
                <span class="d-block g-color-white-opacity-0_8">LINEアカウントを利用してアカウント作成が可能です。煩わしい登録操作は必要ありません。</span>
              </div>
            </div>
            
          </div>

          <div class="col-md-4 mx-auto g-brd-x--md g-brd-white-opacity-0_3 g-py-20">
            <div class="media g-px-50--lg">
              <i class="d-flex g-color-white g-font-size-40 g-pos-rel g-top-3 mr-4 icon-real-estate-040 u-line-icon-pro"></i>
              <div class="media-body">
                <span class="d-block g-color-white g-font-weight-500 g-font-size-17 text-uppercase">ポイントサービス</span>
                <span class="d-block g-color-white-opacity-0_8">がんばるあなたを応援〜。継続して練習すれば、ポイントを進呈いたします！</span>
              </div>
            </div>
          </div>

          <div class="col-md-4 mx-auto g-py-20">
            <div class="media g-px-50--lg">
              <i class="d-flex g-color-white g-font-size-40 g-pos-rel g-top-3 mr-4 icon-hotel-restaurant-062 u-line-icon-pro"></i>
              <div class="media-body text-left">
                <span class="d-block g-color-white g-font-weight-500 g-font-size-17 text-uppercase">いつでもスケジュール調整</span>
                <span class="d-block g-color-white-opacity-0_8">スタジオの予約状況がリアルタイムで確認でき、場所や時間を気にせずいつでも予約できます。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> -->
    <!-- End Call to Action -->


	<!-- <el-alert
		v-if="info.isResetPassword"
        class="text-left mb-3"
        type="error"
        description="パスワード再設定メールを送信しました。メールが届いているかをご確認ください。"
        show-icon>
    </el-alert> -->
	<!-- <el-button 
	 	v-if="auth.username==''"
		class="mt-1 mb-3"
		type="success" 
		@click="lineLogin">
	    LINEログイン
	</el-button>
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
	</div> -->

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
  	
	<!-- <v-container v-if="!loading">
		<h4 v-if="auth.username!==''" class="mt-1 mb-5" ref="courseContents">{{ auth.username }}さんご予約</h4>
		<my-reservation
		    v-for="(item, index) in contens"
			:key="'course-detail'+item.id" :item="item"
			:ref="'courseDetail'+item.id"
			@apply="apply" />
	</v-container> -->
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
    		// sheet: false,
    		// search_loading: false,
    		// search: {
    		// 	name: ''
    		// },
    		// v0: true,
    		// alert: true,
    		// modal_visible: false,
    		// modal_course_visible: false,
    		// modal_resource_visible: false,
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
        line: {
          condition1: false,
          condition2: false,
        }
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
    console.log('beforeRouteEnter /Home', store.state.backuri, '-' , to.fullPath);

    let that = this;
    // // if(store.state.backuri=='' || to.fullPath=='/') {
    if(store.state.backuri=='/') {
      // ログイン済の場合、以下コメントでOK
      // next();
      return;
    }
    
    // linelogin後
    if(store.state.backuri=='/schedule') {
    // if(store.state.backuri=='/about') { 
      // 初期化
      store.commit('SET_BACK_URI', '');
      store.commit('SET_LINE_LOGIN', '');
      // ログイン済の場合、以下コメントでOK
      // next();
      return;
    }

    // ログインなしで戻ってきたとき
    if(store.state.backuri=='/back'){
      store.commit('SET_BACK_URI', '');
      setTimeout(function(){
        store.commit('SET_ISLOADING', false);
      },700);
      next();
      return;
    }

    // // if(store.state.backuri=='/' && to.fullPath=='/') {
    // //   setTimeout(function(){
    // //     store.commit('SET_ISLOADING', false);
    // //   },700);
    // //   return;
    // // }

    // ログイン後か判定
    next(vm => {
    	console.log("vm",store.state.backuri, to.fullPath);

    	if(store.state.backuri=='/?mode=signedIn') {
	      vm.$router.push({path: '/login'});
	    }
	    // 決済成功
	    if(store.state.backuri=='/?mode=stripeSuccess') {
	    	vm.$router.push({path: '/successpayment'});
	    }
	    // 会員ポイント精算
	    if(store.state.backuri=='/?mode=stripeSuccessPoint') {
	    	vm.$router.push({path: '/successpaymentaddpoint'});
	    }
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
	      vm.$router.push({path: '/successlinelogin'});
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
		goLogin(){
			// ログインチェック
			var that = this;
			// let currentUserStatus = Firebase.auth().currentUser;
			if(this.auth.email=='') {
				// ログイン未だの場合
				that.$router.push({path: '/login'});
				return;
			}
	    },
		// openShop() {
	 //      // this.modal_shop_visible = true;
	 //      store.commit('SET_ISLOADING', true);
	 //      let that = this;
	 //      let parms = {
	 //        price: 4000,
	 //        email: that.auth.email
	 //      }
	 //      const processA = async function() {
	 //        const stripe = await stripePromise;
	 //        const response = await firebase.functions().httpsCallable('postStripe');
	 //        await response({
	 //          method: 'POST',
	 //          params: {
	 //            price: "price_1IJdUsAXJN6gcxR4UbytacgS",
	 //            quantity: 1,
	 //          },
	 //          mode: "payment",
	 //          success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessPoint",
	 //          cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
	 //          headers: {
	 //            "Accept": "*/*",
	 //            "Contsent-Type": "application/json; charset=utf-8",
	 //            "Access-Control-Allow-Origin": "*",
	 //          }
	 //        }).then((res) => {
		// 		console.log(res)
		// 		const session = res.data;
		// 		const sessionId = session.id;

		// 		// 一旦保持
		// 		Firebase.db().collection("sessions").doc(parms.email)
		// 		.set({
		// 			sessionId: sessionId,
		// 			params: parms,
		// 			status: 'checkout'
		// 		});
		// 		const result = stripe.redirectToCheckout({
		// 			sessionId: sessionId,
		// 		});
		// 		if (result.error) {
		// 			console.log(result.error.message);
		// 		}
	 //        });
	 //      }
	 //      const processAll = async function() {
	 //        await processA()
	 //      }
	 //      processAll()
	 //    },
		// openAdmission() {
		// 	// console.log('OK');
		// 	store.commit('SET_ISLOADING', true)
		// 	let that = this;
		// 	const processA = async function() {
		// 	const stripe = await stripePromise;
		// 	const response = await firebase.functions().httpsCallable('postStripe');
		// 	await response({
		// 	  method: "POST",
		// 	  params: {
		// 	    price: "price_1IJeKsAXJN6gcxR42W81FB4f",
		// 	    quantity: 1,
		// 	  },
		// 	  mode: "subscription",
		// 	  success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessAdmission",
		// 	  cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
		// 	  headers: {
		// 	    "Accept": "*/*",
		// 	    "Contsent-Type": "application/json; charset=utf-8",
		// 	    "Access-Control-Allow-Origin": "*",
		// 	  }
		// 	}).then((res) => {
		// 	  const session = res.data;
		// 	  const sessionId = session.id;
		// 	  const result = stripe.redirectToCheckout({
		// 	    sessionId: sessionId,
		// 	  });
		// 	  if (result.error) {
		// 	    console.log(result.error.message);
		// 	  }
		// 	});
		// 	}
		// 	const processAll = async function() {
		// 	await processA()
		// 	}
		// 	processAll();
		// },
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
  //   searchStudioNago() {
  //   	store.commit('SET_ISLOADING', true)
		// let date = moment().format('YYYY-MM-DD');
		// // let start = moment().format('HH:mm');
		// let start = moment().format('06:00');
		// let search = {
		// 	date: date,
		// 	start: start,
		// 	studio_name: 'ナゴスタジオ'
		// }
		// store.commit('SET_SELECT_SEARCH', search)
		// this.goSearch(search)
  //   },
  //   searchStudioKoza() {
  //   	store.commit('SET_ISLOADING', true)
		// let date = moment().format('YYYY-MM-DD');
		// // let start = moment().format('HH:mm');
		// let start = moment().format('06:00');
		// let search = {
		// 	date: date,
		// 	start: start,
		// 	studio_name: 'コザスタジオ'
		// }
		// store.commit('SET_SELECT_SEARCH', search)
		// this.goSearch(search)
  //   },
  //   goSearch(search) {
  //   	// 検索初期値

  //   	// 料金マスター
		// let _documentName = "個人利用";
		// // 会員の場合
		// if(this.auth.username!=='' && this.auth.isLine) {
		// 	_documentName = "スタジオレンタル（個人利用）";
		// }
		// store.commit('SET_SELECT_RESOURCES', [])
		// store.dispatch('getFree', {
		// 	params: {
		// 	  date: search.date,
		// 	  time: search.start,
		// 	  time_zone: '1:00',
		// 	  hour: 1.0,
		// 	  document: _documentName,
		// 	  use_type: '個人',
		// 	  use_name: 'フラメンコ練習',
		// 	  studio_name: search.studio_name,
		// 	},
		// 	callback: function(res){
		// 	  // console.log(res)
		// 	  // console.log('ge', res);
		// 	  store.commit('SET_SELECT_RESOURCES', res)
		// 	  store.commit('SET_ISLOADING', false)
		// 	}
		// });
  //   	this.$router.replace('/studiosearch')

  //   },
    lineLogin() {
    	this.$router.replace('/linelogin');
    	store.commit('SET_ISLOADING', false);
    	// const url = "https://localhost:4006";
    	// const url = "https://vue-authentification-b7a7a.firebaseapp.com";
    	// window.open(url+'/?mode=lineLogin', '_blank');
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
