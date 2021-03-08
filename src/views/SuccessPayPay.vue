<template>
  <div>
    <v-card 
      :loading="loading"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">PayPay支払確認</h4>
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
            description="PayPay支払済の確認に成功しました。画面が切り替わるまで、しばらくこのままお待ち下さい..."
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
      loading: false,
    }
  },
  computed: {
  },
  created: function () {
    console.log('paypay');
    store.commit('SET_ISLOADING', true)

    var that = this;
    let session_timestamp = moment().format("YYYYMMDDHH");
    const processA = async function(docName) {
      var docRef = Firebase.db().collection("paypay").doc(docName);
      const docs = await docRef.get().then(function(doc) {
          if (doc.exists) {
              console.log("Document data success.");
              return doc.data();
          } else {
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
      const merchantPaymentId = await docs.merchantPaymentId;
      const codeId = await docs.codeId;
      const form= await docs.form;

      // paypay支払状態を取得
      store.dispatch('getPayPayStatus',{
        params: {
          merchantPaymentId: merchantPaymentId
        },
        callback: function(res) {
          console.log('res', res);
          if(res==null) that.goBack();
          if(res.status=="COMPLETED") {
            form.super_field = res.paymentId;
            store.dispatch('addAppointment',{
              params: form,
              callback: function(r){
                store.commit('SET_ISLOADING', true)
                setTimeout(function(){
                  // セッションデータ削除
                  docRef.delete().then(function() {
                    console.log("Document successfully deleted!");
                    setTimeout(function(){
                      that.$message({
                        type: 'success',
                        message: 'ご予約いただきありがとうございました。',
                      });
                      that.goBack();        
                    },1500);
                  }).catch(function(error) {
                      console.error("Error removing document: ", error);
                  });
                  // peypey削除
                  store.dispatch('deletePayPay',{
                    params: {
                      codeId: codeId
                    },
                    callback: function(res3){
                      console.log(res3);
                    }
                  });
                },1500);
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
    }
    const processAll = async function() {
      await processA(session_timestamp);
    }
    processAll();

  },
  mounted() {
  },
  methods: {
    goBack() {
      store.commit('SET_BACK_URI', '');
      store.commit('SET_ISLOADING', false)
      // this.$router.push({path: '/'});
      window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    }
  }
}
</script>
