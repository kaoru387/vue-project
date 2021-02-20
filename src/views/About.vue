<template>
  <v-container class="about">
    <!-- <h1>スタジオ予約（会員専用）</h1> -->
    <el-alert
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
	</div>
    <!-- <StudioReservation msg="スケジュール"/> -->
    <!-- <calendar ref="calendar" :events="events" @eventClick="removeEvent" @eventChange="changeEvent"></calendar> -->
  </v-container>
</template>

<script>
import store from '../store/app';
import firebase from "Firebase";
import axios from 'axios';
import _ from 'lodash';

export default {
	components: {
		// calendar
		// StudioReservation
  	},
	data: function () {
	    return {
	      post: null,
	      isActive: '1',
	      eventForm: {
	        title: "新しいイベント",
	        start: "2020-08-14"
	      },
	      // info: [],
	    }
	},
	// props: {
	//     events: { 
	//     	type: Array,
	//     	default: () => {} 
	//     },
	// },
	computed: {
	    events() {
	      return store.state.result.events;
	    },
	    height() {
        	return window.screen.height;
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
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    console.log('bru',to)
	    next();
	},
	beforeRouteEnter (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteEnter! /about')
	    let that = this;
	    next(vm => {
	    	
	    	// console.log('入会金',store.state.auth.isAdmissionFee)
	    	// // 入会金支払い済の場合、戻る
	    	// if(store.state.auth.isAdmissionFee){
	    	// 	vm.$router.push({path: '/'})
	    	// 	return;
	    	// }
	    	// ログインチェック
		    const processA = async function() {
		      // ログインチェック
		      await firebase.auth().onAuthStateChanged(function(user) {
		        if (user) {	
		          store.commit('SET_AUTH', user)
		        } else {
		          console.log('no singin')
		        }
		      });
		    }
		    const processAll = async function() {
		      await processA()
		    }
		    processAll()
	    });
	    // next()
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
	},
	methods: {
	    addEvent: function() {
	      this.events.push({
	        id: String(this.events.length + 1),
	        ...this.eventForm
	      })
	    },
	    removeEvent: function(eventInfo) {
	      this.events = this.events.filter(event => {
	        return event.id != eventInfo.event.id
	      })
	    },
	    changeEvent: function(eventInfo) {
	      this.events = this.events.map(event => {
	        if(event.id === eventInfo.event.id) {
	          event = eventInfo.event.toJSON()
	        }
	        return event;
	      })
	    },
	    onLinkClick() {
	        // this.close()
	        store.commit('SET_SAFARI_LOGIN', true)
	        this.reLoad();
	    },
	    reLoad() {
	      let that = this;
	      const processA = async function() {
	        await store.commit('SET_ISLOADING', true)
	        await store.commit('SET_EVENTS', []);
	        // 予約取得
	        await store.dispatch('getBookings',{
	            callback: function(res){
	              console.log(res)
	              store.commit('SET_ISLOADING', false)
	            }
	          });
	        // // クラス取得
	        // await store.dispatch('getClass',{})
	      }
	      const processAll = async function() {
	        await processA()
	      }
	      processAll()
	    }
	}
}
</script>