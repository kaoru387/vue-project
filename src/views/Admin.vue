<template>
  <v-container>
    <div class="text-center pt-3 pb-3 text-primary">
    	<h4>管理者</h4>
  	</div>
  	<customers ref="customers">

	</customers>
  	
  </v-container>
</template>

<script>
import store from '../store/app';
import firebase from "Firebase";
import axios from 'axios';
import _ from 'lodash';

import Customers from "components/Customers";

export default {
	components: {
		Customers
  	},
	data: function () {
	    return {
	    	search: '',
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