<template>
  <div>
    <v-card 
      class="text-center"
      :loading="loading"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">PayPay決済成功</h4>
        </v-row>
      </v-card-title>
      <v-icon 
        class="mb-2"
        large
        color="#03BFA5"
        :style="{'font-size':'50px'}"
      >mdi-check-circle</v-icon>
      <div class="ml-2 mr-2 pb-5">
        <el-alert
            class="text-left"
            type="success"
            description="PayPay決済に成功しました！予約処理中です、このままお待ち下さい..."
            show-icon>
        </el-alert>
      </div>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue';
import store from '../store/app';
import moment from "moment"
// import firebase from "@firebase/app";
import Firebase from "Firebase";

export default {
  data() {
    return {
      // loading: false,
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
  },
  // beforeRouteEnter (to, from, next) {
  //   console.log('beforeRouteEnter /paypay', to.fullPath);
  //   if(to.fullPath=='/successpaypay') {
  //     store.commit('SET_BACK_URI', '');
  //     next();
  //   }else{
  //     // next();
  //   }
  // },
  created: function () {
    // alert('paypay');
    store.commit('SET_ISLOADING', true);
  },
  mounted() {
    console.log('paypay mounted!', store.state.auth.paypaySession);
    store.commit('SET_ISLOADING', true);
    
    var that = this;

    // let session = store.state.auth.paypaySession;
    let isKey = Vue.$cookies.isKey("paypay-session");
    if(!isKey){
      alert('セッションエラー発生しました。管理者へお問い合わせください！');
      return;
    }
    let session = Vue.$cookies.get("paypay-session");
    if(session=="") {
      alert('セッションエラー不具合！');
      return;
    }

    // 2度実行される問題の対応
    if(session=="fin") {
      Vue.$cookies.set("paypay-session", "");
      return;
    }
    Vue.$cookies.set("paypay-session", "fin");
      
    // console.log('session', session);
    // alert('テスト中1');

    const merchantPaymentId = session.merchantPaymentId;
    const codeId = session.codeId;
    const params= session.params;

    // paypay支払状態を取得
    store.dispatch('getPayPayStatus',{
      params: {
        merchantPaymentId: merchantPaymentId
      },
      callback: function(res) {
        console.log('status!!', res);
        // console.log('params', params);
        // console.log('session??', session);
        // alert('テスト中2');

        store.commit('SET_ISLOADING', true);
        if(res.status=="COMPLETED") {

          // 20210628 change-start
          // params['booking[super_field]'] = res.paymentId;
          params['booking[super_field]'] = merchantPaymentId;
          // 20210628 change-end

          // スタジオ予約
          store.dispatch('addAppointmentPayPay', {
            params: params,
            callback: function(r){

              store.commit('SET_ISLOADING', true);

              setTimeout(function(){
                that.$message({
                  type: 'success',
                  message: 'PayPay決済確認・予約に成功しました！',
                });

                // // peypey削除
                // store.dispatch('deletePayPay', {
                //   params: {
                //     codeId: codeId
                //   },
                //   callback: function(res2){
                //     console.log('delete QR', res2);

                    // データ初期化
                    store.commit('RESET_DATA');
                    // 全ての予約
                    store.dispatch('getBookings',{
                      callback: function(err, res){
                        console.log('success paypay get booking.', res)

                        // あなたのクラス予約を取得
                        store.dispatch('getAgenda',{
                          params: {
                            resource_id: 563549,
                            // user_id: that.auth.user_id
                          },
                          callback: function(res3){
                            console.log('get!!!', res3)
                            store.commit('SET_IS_SEARCH', false);
                            store.commit('SET_ISLOADING', false);
                            store.commit('SET_BACK_URI', '/schedule');
                            if(that.$route.path!=='/schedule') {
                              that.$router.push({path: '/schedule'});
                              return;
                            }
                            that.$router.push('/');
                          }
                        });
                        
                      }
                    });

                //   }
                // });

              }, 600);

            }
          });

        }else{
          that.$message({
            type: 'error',
            message: 'PayPay支払確認に失敗しました。管理者にお問い合わせください。status:'+res.status,
          });
          store.commit('SET_ISLOADING', false);
          // that.goBack();
        }

      }
    });

  },
  methods: {
    // goBack() {
    //   store.commit('SET_BACK_URI', '');
    //   store.commit('SET_ISLOADING', false)
    //   // this.$router.push({path: '/'});
    //   window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    // }
  }
}
</script>
