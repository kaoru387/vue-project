<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <div class="text-center pt-5 pb-0 text-primary">
        <h4><strong>{{selectDate}}</strong>の予約</h4>
      </div> 
      <div class="text-center p-3">
        <el-alert
          :closable="false"
          type="info"
          description="ご利用タイプをお選びください。"
          show-icon>
        </el-alert>
        <div class="mt-5">
          <b-button block variant="outline-success" @click="general1">個人で利用する</b-button>
        </div>
        <div class="mt-5">
          <b-button block variant="outline-info" @click="general2">グループで利用する</b-button>
        </div>
      </div>
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
      title: ''
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
  computed: {
    selectDate() {
      return store.state.selectDate;
    },
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  mounted() {
    this.title = this.selectDate+'の予約';
  },
  methods: {
    general1(){
      this.$router.push({path: '/general1'});
    },
    general2(){
      this.$router.push({path: '/general2'});
    },
    cancel: function () {
      this.$router.replace('/')
    }
  }
}
</script>
