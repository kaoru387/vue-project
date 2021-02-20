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
	<span v-if="auth.username==''" @click="openModal">
		<el-alert
			v-if="auth.username==''"
	        class="text-left mb-3"
	        type="warning"
	        description="会員登録いただくと一回のレンタル料がお安くなります。こちらをクリックしてご登録ください!!">
	    </el-alert>
	</span>
    <span v-if="auth.username!=='' && !auth.isAdmissionFee && auth.emailVerified" @click="openAdmission">
		<el-alert
	        class="text-left mb-3"
	        type="warning"
	        description="入会金をお支払いいただければ、一回のレンタル料がお安くなるチケットを購入できます。こちらをクリックしてお申し込みください。"
	        show-icon>
	    </el-alert>
    </span>
	<!-- <div role="alert" class="alert alert-warning pl-3 p-2 text-left" @click="openAdmission">
    	<v-icon color="#856404" class="mb-1">mdi-alert-circle</v-icon><span :style="{'cursor': 'e-resize'}"  class="ml-1">入会金をお支払いいただければ、一回のレンタル料がお安くなるチケットを購入できます。</span>
    </div> -->
   	<span v-if="auth.username!=='' && auth.isAdmissionFee && auth.emailVerified && auth.credit==0" @click="openShop">
	    <el-alert
	        class="text-left mb-3"
	        type="warning"
	        description="ポイントが不足しています。こちらをクリックしてレンタルチケットをご購入ください。"
	        show-icon>
	    </el-alert>
	</span>
    <el-alert
		v-if="auth.username!=='' && !auth.emailVerified"
        class="text-left mb-3"
        type="error"
        description="メール認証がまだ完了していないため予約できません。メールが届いているかをご確認ください。"
        show-icon>
    </el-alert>
	<el-button v-if="!search_loading && auth.emailVerified" type="primary" @click="moveSearch">
	    + 会員の新規予約
	</el-button>
	<el-button v-if="auth.username==''" type="danger" @click="moveSearch">
    	+ 一般の新規予約
  	</el-button>
  	<div>
  		<template>
		  <div class="text-center">
		    <a class="text-decoration-underline sample" :style="{'color':'blue !important'}" @click="sheet = !sheet">料金説明</a>
		    <v-bottom-sheet v-model="sheet">
		      <v-sheet
		        class="text-center"
		        height="600px"
		      >
		        <v-btn
		          class="mt-5"
		          text
		          color="red"
		          @click="sheet = !sheet"
		        >
		          料金説明を閉じる
		        </v-btn>
		        <div class="m-1 mt-3">
		          	<!-- <span>一般のお客様</span>
		          	<div class="d-flex flex-column bd-highlight mb-3">
					  <div class="p-0 bd-highlight">Flex item 1</div>
					  <div class="p-0 bd-highlight">Flex item 2</div>
					  <div class="p-0 bd-highlight">Flex item 3</div>
					</div> -->
					<div class="container font-weight-medium" :style="{'border': '1px solid black'}">
					  <div class="row">
					  	<div class="col-2"></div>
					    <div class="col">一般のお客様</div>
					    <div class="col">会員様</div>
					  </div>
					  <div class="row" :style="{'border': '1px solid black'}">
					  	<div class="col-2">
					  		<span class="font-weight-medium">個人利用</span></div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-left">
							  <div class="p-0 bd-highlight">1時間：¥1,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,500</div>
							  <div class="p-0 bd-highlight">2時間：¥2,000</div>
							</div>
					    </div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-left">
							  <div class="p-0 bd-highlight">1時間：¥800</div>
							  <div class="p-0 bd-highlight">1.5時間：¥1,200</div>
							  <div class="p-0 bd-highlight">2時間：¥1,600</div>
							</div>
					    </div>
					  </div>
					  <div class="row pt-3">
					  	<div class="col-2">グループ利用</div>
					    <div class="col">
					    	<div class="d-flex flex-column bd-highlight m-0 text-left">
							  <div class="p-0 bd-highlight">1時間：¥2,000</div>
							  <div class="p-0 bd-highlight">1.5時間：¥2,500</div>
							  <div class="p-0 bd-highlight">2時間：¥3,000</div>
							</div>
					    </div>
					    <div class="col"">
					    	<div class="d-flex flex-column bd-highlight m-0 text-left">
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
		        <v-list-item-subtitle class="text-left p-2">{{ search.name }}</v-list-item-subtitle>
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
	<v-container class="mt-3">
		<calendar ref="calendar" 
			v-if="events.length"
	    	:events="events"
	    	:view-name="'dayGridMonth'"
		    @eventChange="eventChange">    	
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
	/*.item {
	  padding-top: 6px;
	  padding-right: 20px; 
	}*/
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
	 //    dateSelected(select_date){
	 //    	////////////////////////////////
	 //    	// 選択された日付のイベントを表示する
	 //    	////////////////////////////////
	 //    	// let date = moment(select_date).utc().format('YYYY-MM-DD')
		// 	this.filterContents(select_date);
  //       	// データなしの場合、日付までスクロール移動
  //       	if(this.contens.length==0) {
  //       		this.$refs.courseContents.scrollIntoView({block: "center"});
  //       		return;
  //       	}
  //           let that = this;
  //           this.$nextTick(function() {
  //           	// 先頭へ移動
  //           	that.$refs['courseDetail'+that.contens[0].id][0].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  //           });
		// },
		eventChange(eventInfo){
			
			// ////////////////////////////////
			// // イベント選択
			// ////////////////////////////////

			// let date = moment(eventInfo.start).utc().format('YYYY-MM-DD')
			// var result = eventInfo.start.indexOf('Z');
			// if(result==-1) date = moment(eventInfo.start).format('YYYY-MM-DD')	
			// this.filterContents(date);

   //          let that = this;
   //          this.$nextTick(function() {

   //          	// 初期化
   //          	_.forEach(that.contens, function(v, k) {
		 //      		that.$refs['courseDetail'+v.id][0].$el.style.border='thin solid rgba(0,0,0,0.12)';
		 //      		that.$refs['courseDetail'+v.id][0].$el.classList.remove('shadow-lg');
	  //       	});
	      		
   //          	// イベント取得
   //          	let index = _.findIndex(store.state.result.events, function(o){
	  //       		return o.id==eventInfo.id;
	  //       	});
	  //       	if(index==-1) return;
	  //       	let e = store.state.result.events[index]

   //          	//移動
   //          	that.$refs['courseDetail'+e.id][0].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})

   //          	// 選択枠線変更
   //          	that.$refs['courseDetail'+eventInfo.id][0].$el.style.borderColor=e.iconColor;
   //          	that.$refs['courseDetail'+eventInfo.id][0].$el.classList.add('shadow-lg');

   //          	// 背景色までいいかな・・保留
   //     //      	that.$refs['courseDetail'+eventInfo.id][0].$el.style.backgroundColor=e.iconColor;
   //     //      	setTimeout(() => {
			//     //     that.$refs['courseDetail'+eventInfo.id][0].$el.style.backgroundColor="white";
			//     // }, 1000);
   //          });
		},
		// filterContents(select_date) {	// 対象データ抽出
		// 	// 初期化
		// 	this.contens = [];
  //  			let contens=[];
  //     		_.forEach(store.state.result.events, function(v, k) {
  //     			let _d = moment(v.start).format('YYYY-MM-DD');
  //     			var result = v.start.indexOf('Z');
  //     			if(result!==-1) _d = moment(v.start).utc().format('YYYY-MM-DD');
	 //      		if(select_date==_d) contens.push(v);
  //       	});
  //           this.contens=contens;
  //           // console.log(contens)
		// },
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
	    // reload() {
	    //   let that = this;
	    //   const processA = async function() {
	    //     await store.commit('SET_EVENTS', []);
	    //     // 予約取得
	    //     await store.dispatch('getBookings')
	    //     // クラス取得
	    //     await store.dispatch('getClass',{})
	    //   }
	    //   const processAll = async function() {
	    //     await processA()
	    //   }
	    //   processAll()
	    // },
	    moveSearch() {
	    	store.commit('SET_ISLOADING', true)
	    	this.$router.push({path: '/studiosearch'})
	    },
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
