<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">予約完了</h4>
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
          description="ご予約いただきありがとうございました。画面が切り替わるまで、しばらくこのままお待ち下さい..."
          show-icon>
        </el-alert>
      </div>
      <!-- <div class="pt-4 pb-5">
        <v-btn
          outlined
          rounded
          text
          @click="reload"
        >
          OK
        </v-btn>
      </div> -->
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import Firebase from "Firebase";
import firebase from "@firebase/app";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');


export default {
  data() {
    return {
      loading: false,
      isWait: false,
    }
  },
  computed: {
  },
  created: function () {
    console.log('payment!')
    store.commit('SET_ISLOADING', true)

    let that = this;
    let docName = "";
    let currentUser = Firebase.auth().currentUser;
    if(!currentUser){
      // ログインなしの場合
      docName = "stripe@dummy.com";
    }else{
      // ログインありの場合、ポイント精算なので決済不要
      store.commit('SET_ISLOADING', false)
      return;
    }
    const processA = async function(documentName) {
      store.commit('SET_ISLOADING', true)
      // Stripe Checkout
      const stripe = await stripePromise;
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
          params.email=session.customer_details.email;
          // Sucpersass予約
          store.dispatch('addAppointment', {
            params: params,
            callback: function(res2){
              console.log('save',res2)
              // セッションデータ削除
              docRef.delete().then(function() {
                  console.log("Document successfully deleted!");
                  setTimeout(function(){
                      store.commit('SET_ISLOADING', false)
                      window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
                  },1500);
              }).catch(function(error) {
                  console.error("Error removing document: ", error);
              });
            }
          });
        }
      });
    }
    const processAll = async function() {
      await processA();
    }
    processAll();
      
  },
  mounted() {
  },
  methods: {
    reload() {
      store.commit('SET_ISLOADING', true)
      store.commit('SET_BACK_URI', '');

      let currentUser = Firebase.auth().currentUser;
      if(!currentUser){
        // ログインなしの場合
        window.location.href = "https://www.fandangos-okinawa.com/reservation/"
      }else{
        // ログインありの場合、ポイント精算なので決済不要
        // window.location.href = "https://kdev.page/"
        let that = this;
        // ユーザ情報更新
        store.dispatch('getUsers',function(e){
          store.commit('SET_AUTH', currentUser);
          that.$router.push({path: '/'});
          setTimeout(function(){
              store.commit('SET_ISLOADING', false)
          },1000);
        })
        return;
      }
    }

  }
}
</script>
