<template>
  <div class="home">

  	<!-- {{auth.checksum}} -->
  	<!-- <a :href='"https://www.supersaas.com/api/login?account=susture&after=experience&user[name]=susture387@gmail.com&checksum="+auth.checksum'>Log in</a> -->
  	<v-tooltip top>
      	<template v-slot:activator="{ on, attrs }" >
	  		<v-btn
	  			v-if="auth.username==''"
			    class="mb-2"
			    elevation="2"
			    color="error"
			    v-bind="attrs" 
			    v-on="on"
			    @click="openModal"
			    >ログインする</v-btn>
		</template>
		<span>はじめてのお客様もお気軽にご登録ください。</span>
    </v-tooltip>

	<v-tooltip top v-if="auth.username!==''">
      <template v-slot:activator="{ on, attrs }">
        <strong class="ml-2">{{ selectDate }}<v-icon class="mb-1" color="#40B883" v-bind="attrs" v-on="on">{{ mdiInformation }}</v-icon></strong>
		    <el-dropdown>
			  <el-button type="primary">
			    + 新規予約<i class="el-icon-arrow-down el-icon--right"></i>
			  </el-button>
			  <el-dropdown-menu slot="dropdown">
			    <el-dropdown-item @click.native="presonal">個人で利用する</el-dropdown-item>
			    <el-dropdown-item @click.native="group">グループで利用する</el-dropdown-item>
			  </el-dropdown-menu>
			</el-dropdown>
      </template>
      <span>カレンダー日付を選択して予約日をご指定ください。</span>
    </v-tooltip>

 	<v-container fluid>
	    <calendar ref="calendar" v-if="events.length" :events="events" @eventChange="changeEvent" :event-sources="eventSources"></calendar>
	</v-container>

   <!--  <modal-non-member ref="dialogNonMember" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" />-->
    <modal-reservation-studio ref="dialogFullscreen" :dialog-form-visible="modal_visible" :close-modal="close_modal" />
  </div>
</template>

<script>
import store from '../store/app';
import Calendar from '../components/FullCalendar.vue'
import ModalReservationStudio from '../components/ModalReservationStudio'
import axios from 'axios';

import firebase from "../Firebase";
import _ from 'lodash';
import { mdiInformation,mdiHospital } from '@mdi/js'

export default {
	components: {
	    Calendar,
	    ModalReservationStudio,
	},
	data() {
    	return {
    		v0: true,
    		alert: true,
    		modal_visible: false,
      		modal_koza_visible: false,
      		modal_nago_visible: false,
      		modal_experience_visible: false,
      		isInit: false,
      		isSignIn: false,
      		filters: {
      			start: '',
      			end: ''
      		},
      		items: [],
      		modal_shop_visible: false,
      		mdiInformation,
      		mdiHospital
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
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    console.log('beforeRouteUpdate');
	    next();
	},
	beforeRouteEnter (to, from, next) {
	    //ページの更新
	    console.log('beforeRouteEnter /Home');
	    // // ログイン後か判定
	    // let that = this;
	    // next(vm => {
	    // 	if(store.state.backuri=='/?mode=signedIn') {
		   //    // ログイン後フラグを初期化
		   //    store.commit('SET_BACK_URI', '');
		   //    vm.$router.push({path: '/useconfirm'})
		   //    // vm.$router.push({path: '/'})
		   //  }
	    // });
	    next()
	},
	created: function () {
	},
	watch: {
	  
	},
	methods: {
		close_shop_modal: function() {
	        this.modal_shop_visible = false;
	    },
		eventSources(){
			console.log('wa')
		},
	    reservationNonMember(){
	      this.modal_experience_visible = true;
	    },
	    close_experience_modal: function() {
	      this.modal_experience_visible = false;
	    },
	    close_modal: function() {
	    	this.modal_visible = false;

	    	store.commit('SET_ISLOADING', true)
	    	// 初期化
    		store.commit('SET_EVENTS', [])
    		// 予約取得
		    store.dispatch('getDatas', function(e){
		        let books = _.forEach(e.data, function(v, key) {
		          store.dispatch('getBookings',{ 
		            schedule_id: v.id,
		            name: v.name,
		            slot: true
		          });
		        });
		        if(books) store.commit('SET_ISLOADING', false)
		    });
	    },
	    changeEvent: function(eventInfo) {
	    	this.modal_experience_visible = true;
	    	this.$refs.dialogNonMember.setDate(eventInfo.start);
	    },
	    openModal(){

	    	// ログインチェック
	    	var that = this;
	    	let currentUserStatus = firebase.auth().currentUser;
	    	// console.log('current',currentUserStatus)
	    	if(currentUserStatus===null) {
	    		// ログイン未だの場合
	    		that.$router.push({path: '/login'});
	    		return;
	    	}

	    	// ログイン済の場合
  			// this.modal_visible = true;
  			// this.$refs.dialogFullscreen.setDate(this.selectDate);

  			// if(store.state.auth.general){
  			// 	// 一般の場合
  			// 	that.$router.push({path: '/useconfirm'});
  			// }else{
  			// 	// 会員の場合
  			// 	that.$router.push({path: '/member1'});
  			// }

	    },
	    presonal(){
	    	// 個人利用
	    	store.state.info.isPersonal=true;
	    	this.$refs.dialogFullscreen.ready();
	    	this.modal_visible = true;
	    },
	    group(){
	    	// グループ利用
	    	store.state.info.isPersonal=false;
	    	this.$refs.dialogFullscreen.ready();
	    	this.modal_visible = true;
	    }
	}
}
</script>
