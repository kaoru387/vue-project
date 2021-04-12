<template>
	<div class="align-items-center g-bg-white">
        <el-page-header 
        	@back="cancel" 
        	content="クラス受付予約" 
        	title="戻る" 
        	class="p-1 pt-2">
      	</el-page-header>
      	<reception-class 
      		:items="items" 
      		@payoff="payoff"
      		@paypay="paypay"
      		@reserve="reserve" />
	</div>
</template>

<script>
import store from '../store/app';
import firebase from "Firebase";
import axios from 'axios';
import _ from 'lodash';
import moment from "moment"
import ReceptionClass from '../components/ReceptionClass'

export default {
	components: {
		ReceptionClass,
  	},
	data: function () {
	    return {
	    	items: [],
	    	item: [],
	    	resource_id: 563549,
	    }
	},
	computed: {
		loading() {
	      return store.state.isLoading;
	    },
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
	    supersass() {
	      return store.state.auth.supersass;
	    },
	},
	created () {
		store.commit('SET_ISLOADING', true)
		 // 日付取得
	    let _date = this.$moment().format('YYYY-MM-DD');
	    let that = this;
	    store.dispatch('getClass',{
	      params: {
	        date: _date,
	        time: '09:00'
	      },
	      callback: function(res){
	        // that.items=res.data.slots;
	        _.forEach(res.data.slots, function(v, k) {
	        	// console.log(v)
	        	let _date = moment(v.start).format("MM月DD日");
			    let _start = moment(v.start).format("HH:mm");
			    let _finish = moment(v.finish).format("HH:mm");

			    // ポイント有効か
			    let isPoint=false;
			    let _price=0;
			    if(3<v.price.length) _price = Number(v.price.replace(/,/, ''));
				else _price = Number(v.price);
				if(that.auth.credit < _price) isPoint=true;
				// console.log(that.auth.credit, _price);
	        	that.items.push({
	        		id: v.id,
	        		title: v.title,
	        		price: v.price,
	        		date: _date,
	        		start: _start,
	        		finish: _finish,
	        		description: v.description,
	        		location: v.location,
	        		isClass: true,
	        		isPoint: isPoint,
	        	});
	        });
	        store.commit('SET_IS_SEARCH', true);
	        store.commit('SET_ISLOADING', false);
	      }
	    });
	},
	methods: {
	    cancel: function () {
			store.commit('SET_ISLOADING', true)
			store.commit('SET_IS_SEARCH', false);
			store.commit('SET_SELECT_RESOURCES', []);
			this.$router.replace('/schedule');
	       	setTimeout(function(){
		      	store.commit('SET_ISLOADING', false);
		    },1000);
	    },
	   	payoff(item) {
	   		// 予約・ポイント精算
	      	store.commit('SET_ISLOADING', true);

	      	// 金額を数値変換
	    	let _price = 0;
	    	if(3<item.price.length){
	    		_price = Number(item.price.replace(/,/, ''));
	    	}else{
	    		_price = Number(item.price);
	    	}
	    	
			const that = this;
			let credit = that.auth.credit;
			credit = that.auth.credit - _price;
			let params = {
				'schedule_id': that.resource_id,
				'user_id': that.auth.user_id,
				'booking[full_name]': that.auth.username,
				'booking[email]': that.auth.email,
				'booking[slot_id]': item.id,
				'booking[field_1]': _price,
				'booking[field_2]': item.title,
				'booking[address]': 'ポイント精算',
			}
			// ユーザ情報更新
			store.dispatch('saveUser',{
				params: {
				  credit: credit,
				},
				callback: function(res){
					// ポイント更新
			    	store.commit('UPDATE_USER_CREDIT', credit);
					// 予約
					that.saveAppointment(params, '予約・ポイント支払い完了しました。');
				}
			});

	  	},
	  	reserve(item) {
	  		// 予約のみ
	  		store.commit('SET_ISLOADING', true);
	  		const that = this;
			let params = {
				'schedule_id': that.resource_id,
				'user_id': that.auth.user_id,
				'booking[full_name]': that.auth.username,
				'booking[email]': that.auth.email,
				'booking[slot_id]': item.id,
				'booking[field_1]': 0,
				'booking[field_2]': item.title,
				'booking[address]': '予約のみ',
			}
			// 予約
			that.saveAppointment(params, '予約のみ完了しました。');
	  	},
	  	paypay(item) {
	  		
	  		let url = this.supersass.baseHost;
	  		// let url = 'https://localhost:4006';
	  		let _price = 0
	  		if(3<item.price.length) _price = Number(item.price.replace(/,/, ''));
  			else _price = Number(item.price);

      		let that = this;
      		let params = {
				'schedule_id': that.resource_id,
				'user_id': that.auth.user_id,
				'booking[full_name]': that.auth.username,
				'booking[email]': that.auth.email,
				'booking[slot_id]': item.id,
				'booking[field_1]': _price,
				'booking[field_2]': item.title,
				'booking[address]': 'PayPay決済',
				'booking[super_field]': '',
			}
			// console.log(params);
		    store.dispatch('getPayPay', {
		        params: {
		          merchantPaymentId: '',
		          amount: {
		            amount: _price,
		            currency: "JPY"
		          },
		          codeType: "ORDER_QR",
		          orderDescription: that.item.title,
		          description: that.item.title,
		          isAuthorization: false,
		          redirectUrl: url+"/?mode=successPayPay",
		          redirectType: "WEB_LINK",
		        },
		        callback: function(res){
		          console.log(res);

		          // 支払ID取得
		          let session = {
		            merchantPaymentId: res.merchantPaymentId,
		            codeId: res.codeId,
		            params: params
		          };
		          store.commit('PAYPAY_SESSION', session);
		          console.log('session!!!')
		          window.location.href = res.url;		          
		        }
		    });

	  	},
	  	saveAppointment(params, msg) {

			// 予約
			const that = this;
			store.dispatch('addClass', {
			    params: params,
			    callback: function(res){
				    // データ取得
				    setTimeout(function() {

				        that.$message({
				          type: 'success',
				          message: msg,
				        });

				        // 閉じる
				        that.payconfirm=false;

			          	// データ初期化
			          	store.commit('RESET_DATA');
			            // 予約取得
			            store.commit('SET_EVENTS', []);

			            // 予約取得
			            store.dispatch('getBookings',{
			              callback: function(res2){

			              	// 自身の予約
			                store.dispatch('getAgenda',{
			                  params: {
			                    from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
			                    user_id: that.auth.user_id,
			                    resource_id: that.resource_id,
			                  },
			                  callback: function(res3) {
			                  	// 検索終了
				            	store.commit('SET_IS_SEARCH', false);
				                store.commit('SET_ISLOADING', false);
			                    that.$router.push({path: '/schedule'});
			                  }
			                });

			              }
			            });

			      	}, 1000);
			    }
			});
	  	}
	}
}
</script>