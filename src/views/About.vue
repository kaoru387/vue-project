<template>
	<div class="align-items-center g-bg-white">
    <el-page-header 
    	@back="cancel" 
    	content="クラス予約" 
    	title="戻る" 
    	class="pb-2 pt-2">
  	</el-page-header>
  	<!-- <reception-class 
  		:items="classes" 
  		@payoff="payoff"
  		@paypay="paypay"
  		@reserve="reserve" /> -->
  	<reception-class 
  		v-for="item in classes"
      	:key="item.id"
      	:item="item"
      @setItem="setItem" />

    <el-dialog
      title="申込み内容の確認"
      custom-class="dialog_category"
      :visible="dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      @close="dialog = false"
      :loading="loading"
      width="98%"
      :style = "{'max-width':'375px','margin': '20px auto'}"
      center
    >
      <v-card class="mx-auto text-left p-0 mb-3" outlined>
      	<v-card-title class="pb-0" :style="{'line-height':'1.2em'}">{{ item.title }}</v-card-title>
        <v-divider class="mx-3 m-2"></v-divider>
        <v-card-text class="justify-content-between pt-0 pb-3">
          <div class="subtitle-1 g-font-size-14">
            <span>{{ item.date }}</span>
            {{ item.start + '-' + item.finish }}
          </div>
          <p class="mt-1 g-font-size-12">{{item.location}}</p>
          <div class="g-font-size-12">{{ item.description }}</div>
        </v-card-text>
        <v-list-item class="text-right">
          <v-list-item-subtitle class="g-font-size-18 font-weight-bold g-color-primary pr-4">支払合計：¥{{ item.price }}</v-list-item-subtitle>
        </v-list-item>
        <!-- <v-divider class="mx-4"></v-divider> -->
        <v-divider class="mx-3 m-2"></v-divider>

         <v-card-actions class="justify-content-center p-3">
          <div class="d-flex bd-highlight">
            <div class="p-0 flex-fill bd-highlight text-center pt-0 pb-2">

              <div class="p-0 bd-highlight mb-2">
                <el-button class="p-3" :style="{'width':'100%'}" type="success" 
                  @click="confirmExecute('ポイント精算')"
                  :disabled="item.isPoint" 
                  :loading="loading">
                  ポイント精算する
                </el-button>
              </div>

              <span v-if="!auth.isPhoneNumber" class="p-0 bd-highlight">
                <!-- <span class="sample" :style="{'color':'red'}">PayPay決済メンテナンス中、誠に申し訳ありません。</span> -->
                <el-button class="mb-2" :style="{'width':'100%'}" type="secondary" 
                  @click="confirmExecute('PayPay決済')" >
                  <img
                    width="88" height="25"
                    src="/images/Paypay_logo.png"
                    alt="PayPay">
                    <span class="ml-1">PayPay決済する</span>
                </el-button>
              </span>
              
              <div class="p-0 bd-highlight mb-2">
                <el-button class="p-3" :style="{'width':'100%'}"
                  @click="confirmExecute('現地払い')" 
                  :loading="loading">
                  現地払い
                </el-button>
              </div>
              <!-- <span class="p-0 bd-highlight">
                <el-button class="p-3" :style="{'width':'100%'}"
                  outlined
                  @click.stop="dialog = false">
                  キャンセル
                </el-button>
              </span> -->
            </div>
          </div>
        </v-card-actions>
      </v-card>
    </el-dialog>

    <!-- 実行確認 -->
    <v-dialog
      v-model="isExecute"
      max-width="360"
    >
      <v-card class="pb-3">
       <v-card-title>{{ title }}の確認</v-card-title>

        <v-card-text class="justify-content-between">
          参加申込みありがとうございます。{{ title }}実行してよろしいですか？
        </v-card-text>

        <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="isExecute = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            v-if="title=='現地払い'"
            color="indigo"
            outlined
            text
            @click="reserve"
          >
            はい
          </v-btn>
          <v-btn
            v-if="title=='ポイント精算'"
            color="indigo"
            outlined
            text
            @click="payoff"
          >
            はい
          </v-btn>
          <v-btn
            v-if="title=='PayPay決済'"
            color="indigo"
            outlined
            text
            @click="paypay"
          >
            はい
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

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
	    	// items: [],
	    	item: [],
	    	resource_id: 563549,
	    	isExecute: false,
      	dialog: false,
      	title: '',
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
	    classes() {
	      return store.state.result.classes;
	    },
	    userAgent() {
	      return store.state.info.userAgent;
	    },
	},
	beforeRouteEnter (to, from, next) {
	    console.log('beforeRouteEnter /about', to.fullPath, store.state.backuri);
	    if(to.fullPath=='/about' && store.state.backuri!=='/back') {
	      store.commit('SET_LINE_LOGIN', '');
	      next(vm => {
	        store.commit('SET_ISLOADING', false);
	      });
	    }
	},
	created () {
		store.commit('SET_ISLOADING', true)
		 // 日付取得
	    let _date = this.$moment().format('YYYY-MM-DD HH:mm:ss');
	    let that = this;
	    store.dispatch('getClass',{
	      params: {
	        date: _date,
	        time: '09:00'
	      },
	      callback: function(res){
	        store.commit('SET_ISLOADING', false);
	      }
	    });
	},
	mounted() {
	    // トップへ
	    this.$vuetify.goTo(0);
	  },
	methods: {
		confirmExecute(title) {
      // 対象データ保持
      this.title = title;
      this.isExecute = true;
      this.dialog = false;
    },
		setItem: function (item) {
			this.item = item;
			this.dialog=true;
		},
	  cancel: function () {
			store.commit('SET_ISLOADING', true)
			store.commit('SET_IS_SEARCH', false);
			store.commit('SET_SELECT_RESOURCES', []);
			this.$router.replace('/schedule');
	       	setTimeout(function(){
		      	store.commit('SET_ISLOADING', false);
		    },1000);
	  },
	  payoff() {	// 予約・ポイント精算
      store.commit('SET_ISLOADING', true);

      const that = this;

      // 金額を数値変換
    	let _price = 0;
    	if(3<that.item.price.length){
    		_price = Number(that.item.price.replace(/,/, ''));
    	}else{
    		_price = Number(that.item.price);
    	}	
			
			let credit = that.auth.credit;
			credit = that.auth.credit - _price;
			let params = {
				'schedule_id': that.resource_id,
				'user_id': that.auth.user_id,
				'booking[full_name]': that.auth.username,
				'booking[email]': that.auth.email,
				'booking[slot_id]': that.item.id,
				'booking[field_1]': _price,
				'booking[field_2]': that.item.title,
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

					setTimeout(function() {
						that.$router.push('/schedule');
					}, 1000);

				}
			});
	  	},
	  	reserve() {	// 現地払い（予約のみ）
	  		store.commit('SET_ISLOADING', true);
	  		const that = this;
				let params = {
					'schedule_id': that.resource_id,
					'user_id': that.auth.user_id,
					'booking[full_name]': that.auth.username,
					'booking[email]': that.auth.email,
					'booking[slot_id]': that.item.id,
					'booking[field_1]': 0,
					'booking[field_2]': that.item.title,
					'booking[address]': '現地払い',
				}
				// 予約
				that.saveAppointment(params, '現地払い完了しました。');
	  	},
	  	paypay() {	//PayPay決済
	  		store.commit('SET_ISLOADING', true);

	  		let url = this.supersass.baseHost;
    		let that = this;

    		let _price = 0
	  		if(3<that.item.price.length) _price = Number(that.item.price.replace(/,/, ''));
  			else _price = Number(that.item.price);

    		let params = {
					'schedule_id': that.resource_id,
					'user_id': that.auth.user_id,
					'booking[full_name]': that.auth.username,
					'booking[email]': that.auth.email,
					'booking[slot_id]': that.item.id,
					'booking[field_1]': _price,
					'booking[field_2]': that.item.title,
					'booking[address]': 'PayPay決済',
					'booking[super_field]': '',
				}

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
	          userAgent: that.userAgent
	        },
	        callback: function(res){
	          console.log('get pay!!!!', res);
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

				    	// メッセージ表示
			        that.$message({
			          type: 'success',
			          message: msg,
			        });

			        // 閉じる
			        that.payconfirm=false;

              store.commit('SET_IS_SEARCH', false);
              store.commit('SET_BACK_URI', '/schedule');
              that.$router.push('/schedule');

		      	}, 200);
			    }
				});

	  	}
	}
}
</script>