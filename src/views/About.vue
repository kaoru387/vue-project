<template>
	<!-- Promo Slider -->
  <div class="g-bg-gray-light-v5">
    <div class="container p-1">
        <div class="row align-items-center g-bg-white">
        	<!-- <el-page-header @back="cancel" content="あなたの情報" title="戻る" class="p-2">
      		</el-page-header> -->

		 	<!-- Product Info -->
			<div class="col-md-4 g-mb-10 g-mb-0--md">
				<div class="text-center">
		          <div class="mb-4">
		            あなたのポイント：<span class="g-color-primary g-font-weight-300 g-font-size-20 mr-2">{{ auth.credit.toLocaleString() }}</span>
		          </div>
		        </div>
				<v-tabs
				  v-model="tab"
				  centered
				>
				  <v-tabs-slider></v-tabs-slider>
				  <v-tab href="#tab-1">予約</v-tab>
				  <v-tab href="#tab-2">履歴</v-tab>
				  <v-tab href="#tab-3">全体スケジュール</v-tab>
				</v-tabs>
				<v-tabs-items v-model="tab" :style="{'min-height':adjust+100+'px'}">
					<v-tab-item :value="'tab-1'">
				    	<div v-if="contens.length==0" class="p-0">
				          	<el-alert
						        class="text-left"
						        type="warning"
						        description="あなたの予約はありません。"
						        show-icon>
						    </el-alert>
						</div>
						<div v-else class="p-0">
							<my-reservation
							    v-for="(item, index) in contens"
								:key="'course-detail'+item.id" 
								:item="item"
								:ref="'courseDetail'+item.id"
								@apply="apply" />
						</div>
				  	</v-tab-item>
				  	<v-tab-item :value="'tab-2'">
				  		<v-card flat>
				          <!-- <v-card-text>{{ text }}</v-card-text> -->
				        </v-card>
				  	</v-tab-item>
				  	<v-tab-item :value="'tab-3'">
				  		<!-- <v-card flat>
				          <v-card-text>{{ text }}</v-card-text>
				        </v-card> -->
				        <!-- <my-full-calendar ref="calendar" 
							v-if="contens.length"
					    	:events="contens"
					    	:view-name="'dayGridMonth'"
					    	@close="cancel">
						</my-full-calendar> -->
				  	</v-tab-item>
				</v-tabs-items>

			</div>

          <!-- <div class="col-md-8 p-0">
          	<div class="d-flex justify-content-center">
		      <div class="media g-mb-15">
		        <div class="d-flex align-self-center mr-3">
		          <span class="u-icon-v2 g-color-purple g-bg-secondary rounded-circle">
		            <i class="fa fa-address-book u-line-icon-pro"></i>
		          </span>
		        </div>
		        <div class="media-body align-self-center">
		          <h3 class="h5 g-color-black mb-0">あなたのスケジュール</h3>
		          <span class="d-block g-color-gray-dark-v5">予約状況</span>
		        </div>
		      </div>
		    </div>

		    <my-full-calendar ref="calendar" 
				v-if="contens.length"
		    	:events="contens"
		    	:view-name="'dayGridMonth'"
		    	@close="cancel">
			</my-full-calendar>

			<div class="col-12 mb-3">
        		<div class="block">
					<el-button class="m-0" type="secondary" :style="{'width':'100%'}" @click="cancel">
		            	スタジオ予約へ戻る
		          	</el-button>
		        </div>
		    </div>
          </div> -->

        </div>
    </div>
</div>
<!-- End Promo Slider -->

  <!-- <div> --> 	
    <!-- <h1>スタジオ予約（会員専用）</h1> -->
    <!-- <el-alert
  		:closable="false"
  		class="text-left pt-1 pb-1 mt-1"
	    type="success"
	    description="ご登録いただき誠にありがとうございます。"
	    show-icon>
	</el-alert>
	<div class="text-darken-1 mb-2 text-left p-3 pb-0">
	  入会金お支払い完了で、正式にArts会員としてご利用いただけます！！
	</div>
	<div v-if="info.browser=='safari' && !info.isSafariLogin" class="mb-5">
	    <el-alert
	      class="mt-3 mb-3 text-left"
	      type="error"
	      description="申し訳ありません、ご使用のsafariブラウザでは再ログインが必要です。"
	      show-icon>
	    </el-alert>
	    <a :href='supersass.host+"/login?m=1&account="+supersass.account+"&after=/form/"+ supersass.account +"/login_form&user[name]="+auth.email+"&checksum="+auth.checksum' @click="onLinkClick" target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから再ログインお願いいたします。</a>
	  </div>
	<div v-else>
		<iframe :src='auth.supersass.host+"/login?account="+auth.supersass.account+"&after=/shop/buy/"+auth.supersass.account+"&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
	</div> -->
    <!-- <StudioReservation msg="スケジュール"/> -->
    <!-- <calendar ref="calendar" :events="events" @eventClick="removeEvent" @eventChange="changeEvent"></calendar> -->
  <!-- </div> -->
</template>

<script>
import store from '../store/app';
import firebase from "Firebase";
import axios from 'axios';
import _ from 'lodash';

import MyFullCalendar from '../components/MyFullCalendar.vue'
// import FullCalendar from '@fullcalendar/vue'
// import dayGridPlugin from '@fullcalendar/daygrid'
// import interactionPlugin from '@fullcalendar/interaction'
// import timeGridPlugin from "@fullcalendar/timegrid";
// import ja from "@fullcalendar/core/locales/ja";

import MyReservation from '../components/MyReservation'

export default {
	components: {
		MyReservation,
		MyFullCalendar,
  	},
	data: function () {
	    return {
	    	tab: null,
	    }
	},
	// props: {
	//     events: { 
	//     	type: Array,
	//     	default: () => {} 
	//     },
	// },
	computed: {
	    // height() {
     //    	// return window.screen.height;
     //    	return window.innerHeight;
     //  	},
      	auth() {
	        return store.state.auth;
	    },
	    adjust () {
	      switch (this.$vuetify.breakpoint.name) {
	        case 'xs': return 220
	        case 'sm': return 400
	        case 'md': return 500
	        case 'lg': return 600
	        case 'xl': return 800
	      }
	    },
	    contens() {
	      return store.state.result.my;
	    },
	},
	// beforeRouteUpdate (to, from, next) { // eslint-disable-line
	//     console.log('bru',to)
	//     next();
	// },
	beforeRouteEnter (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteEnter! /about')
	    store.commit('SET_BACK_URI', '');
	//     let that = this;
	//     next(vm => {
	//     	// console.log('入会金',store.state.auth.isAdmissionFee)
	//     	// // 入会金支払い済の場合、戻る
	//     	// if(store.state.auth.isAdmissionFee){
	//     	// 	vm.$router.push({path: '/'})
	//     	// 	return;
	//     	// }
	//     	// ログインチェック
	// 	    const processA = async function() {
	// 	      // ログインチェック
	// 	      await firebase.auth().onAuthStateChanged(function(user) {
	// 	        if (user) {	
	// 	          store.commit('SET_AUTH', user)
	// 	        } else {
	// 	          console.log('no singin')
	// 	        }
	// 	      });
	// 	    }
	// 	    const processAll = async function() {
	// 	      await processA()
	// 	    }
	// 	    processAll()
	//     });
	    next()
	},
	created () {
		// console.log('kai')
		// store.commit('SET_ISLOADING', true)
    	// // トークンが存在、かつログイン有効期限を過ぎてない場合、またはログイン画面の場合
	    // if (!store.state.auth.login.token) {
	    //     // ログイン画面に飛ばす。ログイン後に元の画面に戻れるよう、backuriパラメーターにリダイレクト前のURLを入れる
	    //     // next({path: '/login', query: {backuri: store.state.backuri}})
	    //     this.$router.push({path: '/login', query: {backuri: store.state.backuri}});
	    // }
	    setTimeout(function(){
	      store.commit('SET_ISLOADING', false);
	    },200);
	},
	methods: {
		apply: function(item){
	    	this.$refs.dialogCourse.ready(item);
	    	this.modal_course_visible=true;
	    },
	    handleDateClick(arg) {  // 日付選択
	      // 選択日付更新
	      store.commit('SET_SELECT_DATE', arg.dateStr);
	      // 表示切り替え
	      this.$refs.fullCalendar.getApi().gotoDate(arg.dateStr)
	      this.$refs.fullCalendar.getApi().changeView('timeGridDay');
	    },
	    cancel: function () {
	      store.commit('SET_ISLOADING', true)
	      store.commit('SET_SELECT_RESOURCES', []);
	      this.$router.replace('/schedule');
	    },
	    // addEvent: function() {
	    //   this.events.push({
	    //     id: String(this.events.length + 1),
	    //     ...this.eventForm
	    //   })
	    // },
	    // removeEvent: function(eventInfo) {
	    //   this.events = this.events.filter(event => {
	    //     return event.id != eventInfo.event.id
	    //   })
	    // },
	    // changeEvent: function(eventInfo) {
	    //   this.events = this.events.map(event => {
	    //     if(event.id === eventInfo.event.id) {
	    //       event = eventInfo.event.toJSON()
	    //     }
	    //     return event;
	    //   })
	    // },
	    // // onLinkClick() {
	    // //     // this.close()
	    // //     store.commit('SET_SAFARI_LOGIN', true)
	    // //     this.reLoad();
	    // // },
	    // reLoad() {
	    //   let that = this;
	    //   const processA = async function() {
	    //     await store.commit('SET_ISLOADING', true)
	    //     await store.commit('SET_EVENTS', []);
	    //     // 予約取得
	    //     await store.dispatch('getBookings',{
	    //         callback: function(res){
	    //           console.log(res)
	    //           store.commit('SET_ISLOADING', false)
	    //         }
	    //       });
	    //     // // クラス取得
	    //     // await store.dispatch('getClass',{})
	    //   }
	    //   const processAll = async function() {
	    //     await processA()
	    //   }
	    //   processAll()
	    // }
	}
}
</script>