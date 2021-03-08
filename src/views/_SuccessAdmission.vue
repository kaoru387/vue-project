<template>
  <div>
    <v-card 
        tile
        max-width="360px"
        :style="{'margin':'0 auto'}"
        >
        <v-card-title class="pt-4 pb-3">
          <v-row justify="center" align-content="center">
            <h4 class="pt-2">入会申込み完了</h4>
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
            class="text-left caption"
            type="success"
            description="会員登録いただき誠にありがとうございました。画面が切り替わるまで、しばらくこのままお待ち下さい..."
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
import firebase from "Firebase";

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
  },
  created: function () {
    console.log('admission!',store.state.backuri)
    store.commit('SET_ISLOADING', true)

    let that = this;
    store.dispatch('saveUserAdmission',{
      params: {
        group_id: 1,
      },
      callback: function(res){
        console.log(res)
        setTimeout(function(){
          store.commit('SET_ISLOADING', false)
          window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
        },1500);
      }
    });
  },
  mounted() {
  },
  methods: {
    reload() {
      store.commit('SET_ISLOADING', true)
      store.commit('SET_BACK_URI', '');
      let currentUser = firebase.auth().currentUser;
      if(!currentUser){
        // ログインなしの場合
        window.location.href = "https://vue-authentification-b7a7a.firebaseapp.com/"
      }else{
        // ログインありの場合
        store.dispatch('getUsers',function(e){
          setTimeout(function(){
            window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
            store.commit('SET_ISLOADING', false)
           },1000);
        })
      }
    }
  }
}
</script>
