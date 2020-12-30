<template>
  <div class="home">
  	
		<v-alert
	      text
	      type="info"
	    >
	      <span class="sample">予約日：</span><strong class="mr-2">{{ selectDate }}</strong>
		  <v-btn
		    depressed
		    color="error"
		    @click="openModal"
		    >予約する</v-btn>
	    </v-alert>
	    <el-alert
		    type="success"
		    description="カレンダー日付を選択して予約日をご指定ください。"
		    show-icon>
		</el-alert>
	    <!-- <v-alert
		  v-if="!loading"
		  dense
		  type="success"
		  text
		  class="mb-0"
		  v-model="alert"
	      dismissible
		>
		　　予約する日付を選択してください。
		</v-alert> -->

	    <!-- <el-button type="primary mr-5" @click="reservationNago">ナゴスタジオ予約の登録・編集</el-button> -->
	    
	    <!-- <el-row class="mt-2">
	    <h1 class="mt-2 mb-2">スケジュール</h1>
	      <el-button type="success" @click="reservationKoza">コザスタジオ予約の登録・編集</el-button>
	      <el-button type="primary" @click="reservationNago">ナゴスタジオ予約の登録・編集</el-button>
	    </el-row> -->

	    <!-- <a href="https://www.supersaas.com/api/login?account=susture&after=experience&user[name]=A%40susture.com&checksum=1e5dcff50bb5f9a5273602b25a2f0d41">Log in</a>
	 	-->
 	<v-container fluid>
	    <calendar ref="calendar" v-if="events.length" :events="events" @reservationEvent="dayEvent" @eventChange="changeEvent" :event-sources="eventSources"></calendar>
	</v-container>

    <!-- <modal-experience ref="dialog_supersass" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" /> -->

    <!-- <modal-studio-koza ref="dialog_koza" :dialog-form-visible="modal_koza_visible" :close-modal="close_modal_koza" />
    <modal-studio-nago ref="dialog_nago" :dialog-form-visible="modal_nago_visible" :close-modal="close_modal_nago" /> -->
    <!-- <modal-experience ref="dialog_supersass" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" /> -->

    <modal-non-member ref="dialogNonMember" :dialog-form-visible="modal_experience_visible" :close-modal="close_experience_modal" />
    <modal-fullscreen ref="dialogFullscreen" :dialog-form-visible="modal_visible" :close-modal="close_modal" />
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
import ModalFullscreen from '../components/ModalFullscreen'
import axios from 'axios';
import _ from 'lodash';
// import moment from 'moment-timezone'


export default {
	components: {
	    Calendar,
	    ModalNonMember,
	    ModalFullscreen,
	},
	data() {
    	return {
    		v0: true,
    		alert: true,
    		selectDate: '',
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
	  }
	},
	computed: {
		loading() {
	      return store.state.isLoading;
	    },
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
	    store.commit('SET_BACK_URI', to.fullPath)

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
		this.selectDate=this.$moment().format('YYYY-MM-DD');
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
			console.log('wa')
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
	    close_modal: function() {
	      this.modal_visible = false;
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
	    	// console.log('ok',dateStr)
	    	this.selectDate = dateStr;
	    	// this.modal_experience_visible = true;
	    	// this.$refs.dialogNonMember.setDate(dateStr);
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
	    openModal(){
	      this.modal_visible = true;
	      this.$refs.dialogFullscreen.setDate(this.selectDate);
	    }
	}
}
</script>
