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
  created: function () {
    // console.log('paypay');
    store.commit('SET_ISLOADING', true);
  },
  mounted() {
    // console.log(store.state.auth.paypaySession);
    store.commit('SET_ISLOADING', true);

    let session = store.state.auth.paypaySession;

    var that = this;
    const merchantPaymentId = session.merchantPaymentId;
    const codeId = session.codeId;
    const params= session.params;

    // paypay支払状態を取得
    store.dispatch('getPayPayStatus',{
      params: {
        merchantPaymentId: merchantPaymentId
      },
      callback: function(res) {
        // console.log('res', res);
        if(res.status=="COMPLETED") {

          params['booking[super_field]'] = res.paymentId;
          store.dispatch('addAppointmentPayPay',{
            params: params,
            callback: function(r){
              // console.log(r);
              store.commit('SET_ISLOADING', true);

              setTimeout(function(){

                that.$message({
                  type: 'success',
                  message: '予約に成功しました。',
                });

                // peypey削除
                store.dispatch('deletePayPay', {
                  params: {
                    codeId: codeId
                  },
                  callback: function(res3){

                    // データ再取得
                    store.dispatch('getUsers', 
                      function(e){
                        // 初期化
                        store.commit('RESET_DATA');
                        // 予約取得
                        store.dispatch('getBookings',{
                          callback: function(res){
                            // 自身の予約
                            store.dispatch('getAgenda',{
                              params: {
                                from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                                user_id: that.auth.user_id,
                                resource_id: params.resource_id,
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
                    });

                  }
                });

              },1200);
            }
          });
        }else{
          that.$message({
            type: 'error',
            message: 'PayPay支払確認に失敗しました。管理者にお問い合わせください。',
          });
          that.goBack();
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
