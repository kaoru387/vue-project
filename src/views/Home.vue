<template>
  <div id="home">
  	<!-- <b-badge class="sample mr-1 badge-success" pill>スタジオ予約</b-badge>個人利用 -->
  	<!-- 再読み込み -->
  	<el-alert
  		:closable="false"
  		class="text-left pt-1 pb-1 mt-1"
	    type="success"
	    description="どなたでもお気軽にご予約ください。会員登録いただくとお得なチケット購入できます！"
	    show-icon>
	</el-alert>
 	<v-container class="pt-1">
	    <calendar ref="calendar" 
	    	v-if="events.length" :events="events" 
		    @date-selected="dateSelected"
		    @eventChange="eventChange">    	
		</calendar>
	</v-container>
	<el-dropdown @command="storeFunc" trigger="click">
	  <el-button v-if="auth.username==''" type="warning">
	    + ログインなしで新規予約する<i class="el-icon-arrow-down el-icon--right"></i>
	  </el-button>
	  <el-button v-else type="primary">
	    + 新規予約する<i class="el-icon-arrow-down el-icon--right"></i>
	  </el-button>
	  <el-dropdown-menu slot="dropdown">
	  	<el-dropdown-item :command="presonal">
	  		<span>個人利用</span>
	  		<!-- <el-badge value="スタジオ予約" class="item" type="success">
	  			<span>個人利用</span>
			</el-badge> -->
		</el-dropdown-item>
	  	<el-dropdown-item :command="group">
	  		<span>グループ利用</span>
	  		<!-- <el-badge value="スタジオ予約" class="item" type="success">
	  			<span>グループ利用</span>
			</el-badge> -->
	  	</el-dropdown-item>
	  	<!-- <el-dropdown-item :command="experience">
	  		<el-badge value="体験レッスン" class="item">
	  			<span>コザフラメンコ</span>
			</el-badge>
	  	</el-dropdown-item>
	  	<el-dropdown-item :command="experience">
	  		<el-badge value="体験レッスン" class="item">
	  			<span>ナゴフラメンコ</span>
			</el-badge>
	  	</el-dropdown-item> -->
	  </el-dropdown-menu>
	</el-dropdown>

	<v-container v-if="!loading">
		<h4 class="mt-1 mb-4" ref="courseContents">{{ selectDate }}</h4>
		<course-detail 
			    v-for="(item, index) in contens"
				:key="'course-detail'+item.id" :item="item"
				:ref="'courseDetail'+item.id"
				@apply="apply"
				@reLoad="reLoad" />
		<el-alert
			v-if="contens.length==0"
	  		:closable="false"
	  		class="text-left"
		    type="warning"
		    description="選択日付の予定はありません。"
		    show-icon>
		</el-alert>
	</v-container>

	<!-- 予約 -->
	<modal-reservation-studio 
		ref="dialogFullscreen"
		:dialog-form-visible="modal_visible" 
		:close-modal="close_modal"
		@reLoad="reLoad"
	 />
	 <!-- 申込み -->
	 <modal-reservation-course 
		ref="dialogCourse"
		:dialog-form-visible="modal_course_visible" 
		:close-modal="close_modal"
		@reLoad="reLoad"
	 />
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
import ModalReservationStudio from '../components/ModalReservationStudio'
import ModalReservationCourse from '../components/ModalReservationCourse'
import CourseDetail from '../components/CourseDetail'

// import firebase from "../Firebase";
import firebase from "@firebase/app";
import _ from 'lodash';
import moment from "moment"

export default {
	components: {
	    Calendar,
	    ModalReservationStudio,
	    ModalReservationCourse,
	    CourseDetail,
	},
	data() {
    	return {
    		v0: true,
    		alert: true,
    		modal_visible: false,
    		modal_course_visible: false,
      		// modal_koza_visible: false,
      		// modal_nago_visible: false,
      		// modal_experience_visible: false,
      		// isInit: false,
      		// isSignIn: false,
      		items: [],
      		modal_shop_visible: false,
      		presonal: { name: 'presonal'},
      		group: { name: 'group'},
      		experience: { name: 'ex'},
      		contens: []
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
	    height() {
	    	return window.innterHeight;
	    }
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
	    	// console.log("vm",store.state.backuri)
	    	if(store.state.backuri=='/?mode=signedIn') {
		      // ログイン後フラグを初期化
		      store.commit('SET_BACK_URI', '');
		      vm.$router.push({path: '/useconfirm'})
		      // vm.$router.push({path: '/'})
		    }
	    });
	    // next()
	},
	created: function () {
		// console.log('mute',this.selectDate)
		// 予約詳細
		let that = this;
		setTimeout(function(){
			// console.log('set')
			that.filterContents(that.selectDate);
	    },3000);
	},
	watch: {
	  
	},
	methods: {
		storeFunc(param) {
			// console.log(param.name)
			// if(param.name=='ex'){	// 体験レッスン
		 //    	this.modal_course_visible = true;
		 //    	return;
		 //    }
		    if(param.name=='presonal'){ // 個人利用
		    	store.state.info.isPersonal=true;
		    }else if(param.name=='group'){ // グループ利用
		    	store.state.info.isPersonal=false;
		    }
		    this.$refs.dialogFullscreen.ready();
		    this.modal_visible = true;
		    
	    },
	    dateSelected(select_date){

	    	////////////////////////////////
	    	// 選択された日付のイベントを表示する
	    	////////////////////////////////
	    	// let date = moment(select_date).utc().format('YYYY-MM-DD')
			this.filterContents(select_date);

        	// データなしの場合、日付までスクロール移動
        	if(this.contens.length==0) {
        		this.$refs.courseContents.scrollIntoView({block: "center"});
        		return;
        	}
            
            let that = this;
            this.$nextTick(function() {
            	// 先頭へ移動
            	that.$refs['courseDetail'+that.contens[0].id][0].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
            });
		},
		eventChange(eventInfo){	
			
			////////////////////////////////
			// イベント選択
			////////////////////////////////

			let date = moment(eventInfo.start).utc().format('YYYY-MM-DD')
			var result = eventInfo.start.indexOf('Z');
			if(result==-1) date = moment(eventInfo.start).format('YYYY-MM-DD')	
			this.filterContents(date);

            let that = this;
            this.$nextTick(function() {

            	// 初期化
            	_.forEach(that.contens, function(v, k) {
		      		that.$refs['courseDetail'+v.id][0].$el.style.border='thin solid rgba(0,0,0,0.12)';
		      		that.$refs['courseDetail'+v.id][0].$el.classList.remove('shadow-lg');
	        	});
	      		
            	// イベント取得
            	let index = _.findIndex(store.state.result.events, function(o){
	        		return o.id==eventInfo.id;
	        	});
	        	if(index==-1) return;
	        	let e = store.state.result.events[index]

            	//移動
            	that.$refs['courseDetail'+e.id][0].$el.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})

            	// 選択枠線変更
            	that.$refs['courseDetail'+eventInfo.id][0].$el.style.borderColor=e.iconColor;
            	that.$refs['courseDetail'+eventInfo.id][0].$el.classList.add('shadow-lg');

            	// 背景色までいいかな・・保留
       //      	that.$refs['courseDetail'+eventInfo.id][0].$el.style.backgroundColor=e.iconColor;
       //      	setTimeout(() => {
			    //     that.$refs['courseDetail'+eventInfo.id][0].$el.style.backgroundColor="white";
			    // }, 1000);
            	
            });

		},
		filterContents(select_date) {	// 対象データ抽出
			// 初期化
			this.contens = [];
   			let contens=[];
      		_.forEach(store.state.result.events, function(v, k) {
      			let _d = moment(v.start).format('YYYY-MM-DD');
      			var result = v.start.indexOf('Z');
      			if(result!==-1) _d = moment(v.start).utc().format('YYYY-MM-DD');
	      		if(select_date==_d) contens.push(v);
        	});
            this.contens=contens;
            // console.log(contens)
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

	    	// this.reLoad();
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
			//     // that.reLoad();
			//     // 予約詳細
			//     that.filterContents(that.selectDate);
			//     // store.commit('SET_ISLOADING', false)
		 //    });
	    },
	    apply: function(item){
	    	// alert('yaho'+item.id)
	    	this.$refs.dialogCourse.ready(item);
	    	this.modal_course_visible=true;
	    },
	    reLoad() {
	      let that = this;
	      const processA = async function() {
	        await store.commit('SET_ISLOADING', true)
	        await store.commit('SET_EVENTS', []);
	        // 予約取得
	        await store.dispatch('getBookings')
	        // クラス取得
	        await store.dispatch('getClass',{})
	      }
	      const processAll = async function() {
	        await processA()
	      }
	      processAll()
	    }
	}
}
</script>
