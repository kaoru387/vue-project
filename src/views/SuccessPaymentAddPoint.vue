<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">レンタルチケット購入</h4>
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
            description="ご購入いただきありがとうございました。画面が切り替わるまで、しばらくこのままお待ち下さい..."
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
import Firebase from "Firebase";
import firebase from "@firebase/app";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
  },
  created: function () {
    console.log('add point!!!',store.state.auth.email)
    store.commit('SET_ISLOADING', true)

    let currentUserStatus = Firebase.auth().currentUser;
    if(!currentUserStatus) console.log('no singin！！！')

    const processA = async function(documentName) {
      // Stripe Checkout
      const stripe = await stripePromise;
      var docRef = Firebase.db().collection("sessions").doc(store.state.auth.email);
      const docs = await docRef.get().then(function(doc) {
          if (doc.exists) {
            console.log("Document data:", doc.data().sessionId);
            return doc.data();
          } else {
            alert("購入に失敗しました！")
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
        console.log('get!', res)
        const session = res.data
        if(session.payment_status=='paid'){

          let credit = store.state.auth.credit.replace(/,/, '');
          credit = Number(credit) + Number(params.price);
          // console.log('credit',credit)
          store.dispatch('saveUser',{
            params: {
              credit: credit,
            },
            callback: function(res){
              console.log('save',res)

              // 再取得
              setTimeout(function(){
                store.dispatch('getUsers',function(e){  
                  store.commit('SET_AUTH', currentUserStatus);
                })
              },1000);

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
      store.commit('SET_ISLOADING', true)
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

      setTimeout(function(){
        window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
        store.commit('SET_ISLOADING', false)
      },1000);
      
    }

  }
}
</script>
