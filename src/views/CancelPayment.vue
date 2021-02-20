<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="text-left pt-4 pb-5">
        <h4 class="pt-2 mb-5">予約キャンセル</h4>
        <el-alert
          type="info"
          description="キャンセルしました。"
          show-icon>
        </el-alert>
      </v-card-title> 
      <div class="pt-4 pb-3">
        <v-btn
          outlined
          rounded
          text
          @click="cancel"
        >
          OK
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
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
    console.log('cancel',store.state.backuri)
    // store.commit('SET_ISLOADING', false)
  },
  mounted() {
  },
  methods: {
    cancel: function () {
      store.commit('SET_ISLOADING', true)
      store.commit('SET_BACK_URI', '');
      setTimeout(function(){
        var currentUser = Firebase.auth().currentUser;
        if(!currentUser){
          // ログインなしの場合
          window.location.href = "https://kdev.page/"
        }else{
          // ログインありの場合
          window.location.href = "https://www.fandangos-okinawa.com/reservation/" 
        }
        store.commit('SET_ISLOADING', false)
      },2000);
    }
  }
}
</script>
