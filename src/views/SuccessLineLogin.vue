<template>
  <div>
    <v-card 
      class="text-center"
      :loading="!loading"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">LINEログイン成功</h4>
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
          description="LINEログインに成功しました！画面が切り替わるまでお待ち下さい。"
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
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
  },
  created: function () {
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter /LineLogin', to.fullPath);
    if(to.fullPath=='/successlinelogin') {
      store.commit('SET_BACK_URI', '/line');
      next();
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
