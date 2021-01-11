<template>
  <v-container class="about">
    <h1>スタジオ予約（会員専用）</h1>
    <StudioReservation msg="スケジュール"/>
    <!-- <calendar ref="calendar" :events="events" @eventClick="removeEvent" @eventChange="changeEvent"></calendar> -->
  </v-container>
</template>

<script>
import store from '../store/app';
// import calendar from '../components/Calendar'
import StudioReservation from '../components/StudioReservation'
import axios from 'axios';
import _ from 'lodash';

export default {
	components: {
		// calendar
		StudioReservation
  	},
	data: function () {
	    return {
	      post: null,
	      isActive: '1',
	      eventForm: {
	        title: "新しいイベント",
	        start: "2020-08-14"
	      },
	      info: [],
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
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    console.log('bru',to)
	    next();
	},
	beforeRouteEnter (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteEnter!')
	    next()
	},
	created () {
		console.log('kai')
		store.commit('SET_ISLOADING', true)
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
	}
}
</script>