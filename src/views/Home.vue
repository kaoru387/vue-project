<template>
  <div>
    <section id="schedule" class="container p-0 g-mt-10 g-pb-10">
      <div class="row justify-content-between">
        <div class="col-md-12 g-mb-50">
          <header class="text-center g-width-60x--md mx-auto g-mb-5">
            <div class="u-heading-v2-3--bottom g-brd-primary g-mb-0">
              <h2 class="h4 u-heading-v2__title g-color-gray-dark-v3 text-uppercase g-font-weight-600">スタジオ<span class="g-color-primary">予約状況</span></h2>
            </div>
          </header>
          <full-calendar 
            v-if="events.length"
            ref="calendar" 
            :events="events"
            :view-name="'dayGridMonth'">      
          </full-calendar>
        </div>
      </div>
    </section>

    <!-- Login -->
    <section id="login" class="container p-0 g-mt-20 g-pb-10">
      <!-- <header class="text-center g-width-60x--md mx-auto g-mb-30">
        <div class="u-heading-v2-3--bottom g-brd-primary g-mb-20">
          <h2 class="h3 u-heading-v2__title g-color-gray-dark-v2 text-uppercase g-font-weight-600"><span class="g-color-primary">アカウント</span>をお持ちの方</h2>
        </div>
      </header> -->
      <div class="row justify-content-between">
        <div class="col-md-6 col-lg-5 order-lg-2 g-mb-50">
          <div class="g-brd-around g-brd-gray-light-v3 g-bg-white rounded g-px-30 g-pt-50 g-pb-40">
            <header class="text-center mb-4">
              <h1 class="h4 g-color-black g-font-weight-400">ログインしてください</h1>
            </header>
            <!-- Form -->
            <form class="g-py-10" :loading="loading">
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

              <div class="mb-4 text-center">
                <!-- <button class="btn btn-block u-btn-primary g-font-size-12 text-uppercase g-py-12 g-px-25" type="button">Login</button> -->
      					<el-button 
                  :disabled="!line.condition1 || !line.condition2"
      						class="mt-1"
      						type="success" 
      						@click="lineLogin">
      					    LINEログイン
      					</el-button>
              </div>

              <div class="d-flex justify-content-center text-center g-mb-20">
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
        <!-- <div id="price" class="col-md-6 order-lg-1 g-mb-20 g-ml-10 g-mr-10">
          <header class="text-center g-width-60x--md mx-auto g-mb-50">
            <div class="u-heading-v2-3--bottom g-brd-primary g-mb-20">
              <h2 class="h4 u-heading-v2__title g-color-gray-dark-v3 text-uppercase g-font-weight-600">スタジオ<span class="g-color-primary">利用料金表</span></h2>
            </div>
          </header>
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
        </div> -->
      </div>
    </section>
    <!-- End Login -->

    <section id="reception" class="container p-0 g-pt-30 g-pb-10">
      <div class="row justify-content-between">
        <div class="col-md-12 g-mb-50">
          <header class="text-center g-width-60x--md mx-auto g-mb-20">
            <div class="u-heading-v2-3--bottom g-brd-primary g-mb-10">
              <h2 class="h4 u-heading-v2__title g-color-gray-dark-v2 text-uppercase g-font-weight-600"><span class="g-color-primary">参加者募集</span></h2>
            </div>
          </header>
          <normal-reception-class 
            :items="classes" />
        </div>
      </div>
    </section>

  </div>
</template>

<script>
import store from '../store/app';
import _ from 'lodash';
import moment from "moment"

import FullCalendar from '../components/FullCalendar.vue'
import NormalReceptionClass from '../components/NormalReceptionClass'

export default {
	components: {
    FullCalendar,
    NormalReceptionClass,
	},
	data() {
  	return {
  		items: [],
  		presonal: { name: 'presonal'},
  		group: { name: 'group'},
  		experience: { name: 'ex'},
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
    events() {
      return store.state.result.events;
    },
    classes() {
      return store.state.result.classes;
    },
	},
  // watch: {
  //   // ルートが変更されたらこのメソッドを再び呼び出します
  //   $route: 'fetchData'
  // },
  // コンポーネントが既に描画されている際のルート変更時は
  // ロジックが少し異なります
  // beforeRouteUpdate(to, from, next) {
  //   // this.post = null
  //   // store.dispatch('getBookings',{
  //   //   callback: function(err, res){
  //   //     console.log('after!', res)
  //   //     // this.setData(err, post)
  //   //     next()
  //   //   }
  //   // })
  // },
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
    console.log('beforeRouteUpdate');
    next();
	},
  // ナビゲーション前のデータ取得
  beforeRouteEnter(route, redirect, next) {
    console.log('beforeRouteEnter home.', store.state.backuri, '-' , route.fullPath);
    // next();
        

    if(store.state.backuri=='/') {
      // ログイン済の場合、以下コメントでOK
      // next();
      setTimeout(function(){
        store.commit('SET_ISLOADING', false);
      }, 600);
      return;
    }

    // linelogin後
    if(store.state.backuri=='/schedule' || store.state.backuri=='/about') {
      // 初期化
      store.commit('SET_BACK_URI', '');
      store.commit('SET_LINE_LOGIN', '');
      // ログイン済の場合、以下コメントでOK
      // next();
      setTimeout(function(){
        store.commit('SET_ISLOADING', false);
      }, 1000);
      return;
    }

    next(vm => {
     console.log("vm!",store.state.backuri, route.fullPath);
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
      //   console.log('reset!!!')
      //   vm.$router.push({path: '/resetpassword'})
      // }
      // PayPay支払い
      if(store.state.backuri=='/?mode=successPayPay') {
        vm.$router.push({path: '/successpaypay'})
      }
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
    console.log('home', store.state.backuri)
    
    var that = this;

    // // 決済成功
    // if(store.state.backuri=='/?mode=stripeSuccess') {
    //   store.commit('SET_BACK_URI', '');
    //   that.$router.push({path: '/successpayment'});
    //   return;
    // }
    // // PayPay支払い
    // if(store.state.backuri=='/?mode=successPayPay') {
    //   store.commit('SET_BACK_URI', '');
    //   that.$router.push({path: '/successpaypay'});
    //   return;
    // }
    // if(store.state.backuri=='/?mode=successLineLogin') {
    //   store.commit('SET_BACK_URI', '');
    //   that.$router.push({path: '/successlinelogin'});
    //   return;
    // }
    // if(store.state.backuri=='/?mode=lineLogin') {
    //   store.commit('SET_BACK_URI', '');
    //   that.$router.push({path: '/linelogin'});
    //   return;
    // }

    // // 参加申込み確認画面から戻ってきたとき、参加募集へスクロール
    // if(store.state.backuri=='/backReception') {
    //   store.commit('SET_BACK_URI', '');
    //   this.$vuetify.goTo("#reception", { offset: 30 });
    //   store.commit('SET_ISLOADING', false);
    // }

    // linelogin後
    if(store.state.backuri=='/schedule' || store.state.backuri=='/about') {
      // 初期化
      store.commit('SET_BACK_URI', '');
      store.commit('SET_LINE_LOGIN', '');
      if(that.$route.path!=='/schedule') that.$router.push({path: '/schedule'});
      store.commit('SET_ISLOADING', false);
    }

    // 画面内遷移
    if(store.state.backuri=='/back'){
      store.commit('SET_ISLOADING', false);
    }

    // 20210606 start
    // ログアウト後、2回発生する。2回データ取得しないための対処
    if(store.state.backuri=="/logout"){
      store.commit('SET_BACK_URI', '/finish');
    }
    if(store.state.backuri=="/finish") {
      store.commit('SET_BACK_URI', '');
      return;
    }
    // 20210606 end

    // データ取得
    store.commit('RESET_DATA');
    this.fetchData();

	},
	methods: {
    fetchData() {
      console.log('home fetch.',this.$route.path)

      // // セッション確認
      // let isKey = this.$cookies.isKey('arts-auth');
      // console.log('is key.' isKey);

      store.commit('SET_ISLOADING', true);
      store.dispatch('getBookings',{
        callback: function(err, res){
          if(err) return;
          store.commit('SET_ISLOADING', false);
        }
      });

      // クラス受付を取得
      let _date = this.$moment().format('YYYY-MM-DD HH:mm:ss');
      store.dispatch('getClass', {
        params: {
          from_date: _date,
          time: '09:00',
        },
        callback: function(res){
          console.log('class', res)
        }
      });
    },
    setData(err, post) {
      if (err) {
        this.error = err.toString()
      } else {
        this.post = post
      }
    },
		// storeFunc(param) {
		// 	console.log(param)
		// },
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
    },
    apply: function(item){
    	this.$refs.dialogCourse.ready(item);
    	this.modal_course_visible=true;
    },
    lineLogin() {
    	this.$router.replace('/linelogin');
    	store.commit('SET_ISLOADING', false);
    	// const url = "https://localhost:4006";
    	// const url = "https://vue-authentification-b7a7a.firebaseapp.com";
    	// window.open(url+'/?mode=lineLogin', '_blank');
    },
	}
}
</script>
