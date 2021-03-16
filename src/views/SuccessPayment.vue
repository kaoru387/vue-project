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
          <h4 class="pt-2">カード決済成功</h4>
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
          description="ご予約いただきありがとうございました。OKボタンをクリックしてください。"
          show-icon>
        </el-alert>
      </div>
      <div class="p-2 pb-6">
        <v-btn
          block
          elevation="4"
          large
          color="cyan"
          @click="submit" 
        ><span :style="{'color':'white'}">OK</span></v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import Firebase from "Firebase";
import firebase from "@firebase/app";

export default {
  data() {
    return {
      // loading: false,
      // isWait: false,
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
  },
  created: function () {
    console.log('payment!')
  },
  mounted() {
  },
  methods: {
    submit() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      let docName = "";
      let currentUser = Firebase.auth().currentUser;
      docName = currentUser.email;
      if(docName==null) docName = currentUser.phoneNumber;
      console.log('key', docName);
      // if(!currentUser){
      //   // ログインなしの場合
      //   docName = "stripe@dummy.com";
      // }else{
      //   // ログインありの場合、ポイント精算なので決済不要
      //   store.commit('SET_ISLOADING', false)
      //   return;
      // }
      const processA = async function(docName) {
        store.commit('SET_ISLOADING', true)
        // Stripe Checkout
        var docRef = Firebase.db().collection("sessions").doc(docName);
        const docs = await docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data().sessionId);
                return doc.data();
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
        const sessionId = await docs.sessionId;
        const params= await docs.params;
        const response = await firebase.functions().httpsCallable('getStripe');
        await response({
          sessionId: sessionId
        }).then((res) => {
          const session = res.data
          if(session.payment_status=='paid'){
            // params.email=session.customer_details.email;

            console.log('params', params);

            // Sucpersass予約
            store.dispatch('addAppointment', {
              params: params,
              callback: function(res2){
                store.commit('SET_ISLOADING', true)
                console.log('save',res2)
                
                // セッションデータ削除
                docRef.delete().then(function() {
                    console.log("Document successfully deleted!");
                    setTimeout(function(){
                      window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
                      store.commit('SET_ISLOADING', false)
                    },1000);
                }).catch(function(error) {
                    console.error("Error removing document: ", error);
                });
              }
            });
          }
        });
      }
      const processAll = async function() {
        await processA(docName);
      }
      processAll();

    },
    // reload() {
    //   store.commit('SET_ISLOADING', true)
    //   store.commit('SET_BACK_URI', '');

    //   let currentUser = Firebase.auth().currentUser;
    //   if(!currentUser){
    //     // ログインなしの場合
    //     window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    //   }else{
    //     // ログインありの場合、ポイント精算なので決済不要
    //     let that = this;
    //     // ユーザ情報更新
    //     store.dispatch('getUsers',function(e){
    //       store.commit('SET_AUTH', currentUser);
    //       that.$router.push({path: '/'});
    //       setTimeout(function(){
    //           store.commit('SET_ISLOADING', false)
    //       },1000);
    //     })
    //     return;
    //   }
    // }
  }
}
</script>
