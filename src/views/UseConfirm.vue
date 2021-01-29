<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <!-- <div class="text-center pt-5 pb-0 text-primary">
        <h3><strong>{{ selectDate | moment('YYYY-MM-DD') }}</strong>の予約</h3>
      </div> --> 
      <!-- <div class="text-center p-3">
        <el-alert
          :closable="false"
          type="info"
          description="ご利用タイプをお選びください。"
          show-icon>
        </el-alert>
      </div> -->
      <div class="pt-4 pb-3">
        <button type="button" class="btn btn-light" @click="cancel">キャンセル</button>
      </div>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"

export default {
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    selectDate() {
      return store.state.selectDate;
    },
    isGeneral() {
      return store.state.auth.general;
    },
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  mounted() {
  },
  methods: {
    general1(){
      this.$router.push({path: '/general1'});
    },
    general2(){
      this.$router.push({path: '/general2'});
    },
    member1(){
      this.$router.push({path: '/member1'});
    },
    member2(){
      this.$router.push({path: '/member2'});
    },
    cancel: function () {
      this.$router.replace('/')
    }
  }
}
</script>
