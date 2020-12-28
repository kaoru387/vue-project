<template>
  <div class="home">

    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <!-- <HelloWorld msg="スケジュール"/> -->
    <!-- <v-row class="mt-5 mb-5">
      <v-col sm="4" cols="12" class="p-1">
        <v-btn color="success" @click="reservationKoza" block>コザスタジオ予約の登録・編集</v-btn>
      </v-col>
      <v-col sm="4" cols="12" class="p-1">
      	<v-btn color="primary" @click="reservationNago" block>ナゴスタジオ予約の登録・編集</v-btn>
      </v-col>
      <v-col sm="4" cols="12" class="p-1">
      	<v-btn color="error" @click="reservationNonMember" block>体験レッスンの予約はこちらから</v-btn>
      </v-col>
    </v-row> -->

    <!-- <el-button type="primary mr-5" @click="reservationNago">ナゴスタジオ予約の登録・編集</el-button> -->
    
    <!-- <el-row class="mt-2">
    <h1 class="mt-2 mb-2">スケジュール</h1>
      <el-button type="success" @click="reservationKoza">コザスタジオ予約の登録・編集</el-button>
      <el-button type="primary" @click="reservationNago">ナゴスタジオ予約の登録・編集</el-button>
    </el-row> -->

    <a href="https://www.supersaas.com/api/login?account=susture&after=experience&user[name]=A%40susture.com&checksum=1e5dcff50bb5f9a5273602b25a2f0d41">Log in</a>

    <calendar ref="calendar" v-if="events.length" :events="events" @reservationEvent="dayEvent" @eventChange="changeEvent" :event-sources="eventSources"></calendar>

    <!-- <modal-experience ref="dialog_supersass" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" /> -->

    <!-- <modal-studio-koza ref="dialog_koza" :dialog-form-visible="modal_koza_visible" :close-modal="close_modal_koza" />
    <modal-studio-nago ref="dialog_nago" :dialog-form-visible="modal_nago_visible" :close-modal="close_modal_nago" /> -->
    <!-- <modal-experience ref="dialog_supersass" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" /> -->
    <modal-non-member ref="dialogNonMember" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" />
  </div>
</template>

<script>
import store from '../store/app';
// import HelloWorld from '../components/HelloWorld.vue'
// import Calendar from '../components/Calendar.vue'
import Calendar from '../components/FullCalendar.vue'

// import ModalExperience from '../components/ModalExperience'
// import ModalStudioKoza from '../components/ModalStudioKoza'
// import ModalStudioNago from '../components/ModalStudioNago'
import ModalNonMember from '../components/ModalNonMember'
// import ModalShopTicket from './ModalShopTicket'
import axios from 'axios';
import _ from 'lodash';
// import moment from 'moment-timezone'


export default {
	components: {
	    Calendar,
	    ModalNonMember,
	    // ModalShopTicket
	    // ModalExperience,
	    // ModalStudioKoza,
	    // ModalStudioNago
	},
	data() {
    	return {
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
	  }
	},
	computed: {
	    events() {
	      return store.state.result.events;
	    },
	},
	beforeRouteUpdate (to, from, next) { // eslint-disable-line
	    //
	    console.log('beforeRouteUpdate');
	    //store.dispatch('getProjectItems',{});
	    next();
	},
	beforeRouteEnter (to, from, next) {
	    //ページの更新
	    console.log('beforeRouteEnter');
	    store.dispatch('getServiceResources')
	    store.dispatch('getNonMembers')
    	
	    // 初期化
	    store.commit('SET_EVENTS', [])

	    let that = this
	    store.dispatch('getDatas', function(e){
	      // console.log('success',e);
	      // that.bookLoaded(e.data)
	      	let books = _.forEach(e.data, function(v, key) {
		        store.dispatch('getBookings',{ 
		          schedule_id: v.id,
		          name: v.name,
		          slot: true
		        });
	        });
	        store.commit('SET_ISLOADING', false);
	    });
	    next();
	    
	  },
	created: function () {

	},
	watch: {
	    // 'events': function() {
	    	// this.$refs.calendar.fullCalendar( 'rerenderEvents' );
	    	// this.$refs.calendar.rerenderEvents();
		    //  if(newVal == true){
		    //     this.loadingInstance = this.$loading({target: this.$el});
		    //   }else{
		    //     this.loadingInstance.close();
		    //   }
	    // },
	},
	methods: {
		close_shop_modal: function() {
	        this.modal_shop_visible = false;
	    },
		eventSources(){
			// console.log('wa')
		},
	    reservationNonMember(){
	      this.modal_experience_visible = true;
	    },
	 //    close_modal_koza: function() {
	 //      this.modal_koza_visible = false;
	 //    },
	 //    close_modal_nago: function() {
	 //      this.modal_nago_visible = false;
	 //    },
	    close_experience_modal: function() {
	      this.modal_experience_visible = false;
	    },
	 //    addEvent: function() {
	 //      this.events.push({
	 //        id: String(this.events.length + 1),
	 //        ...this.eventForm
	 //      })
	 //    },
	 	// weekEvent: function() {	// 
	  //   	this.modal_experience_visible = true;
	  //   },
	    dayEvent: function(dateStr) {	// 
	    	this.modal_experience_visible = true;
	    	this.$refs.dialogNonMember.setDate(dateStr);
	    },
	    changeEvent: function(eventInfo) {
	    	this.modal_experience_visible = true;
	    	this.$refs.dialogNonMember.setDate(eventInfo.start);
	    	// this.$refs.dialogNonMember.setDate(eventInfo.dateStr);
	      // this.events = this.events.map(event => {
	      //   if(event.id === eventInfo.event.id) {
	      //     event = eventInfo.event.toJSON()
	      //   }
	      //   return event;
	      // })
	    },
	}
}
</script>
