<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="pt-4 pb-3">
        <v-row justify="center" align-content="center">
          <h4 class="pt-2">登録認証メール送信済</h4>
        </v-row>
      </v-card-title>
      <v-icon 
          class="mb-2"
          large
          color="#03BFA5"
          :style="{'font-size':'50px'}"
        >mdi-check-circle</v-icon>
      <div class="ml-2 mr-2">
        <el-alert
          class="text-left"
          type="warning"
          description="登録認証メールを送信しました。メールが届いているかをご確認ください。"
          show-icon>
        </el-alert>
      </div>
      <!-- <v-card-text class="pt-0 mt-5 text-left">
        登録メールを送信しました。ご自身のメールボックスをご確認いただき、リンクURLをクリックでメール認証は完了します。
      </v-card-text>  -->
      <v-card-text class="pt-0 mt-5 text-left" :style="{'color':'tomato'}">
        登録認証メールが届いていない場合、再度ご登録いただくか、事務局へお問い合わせください。
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import { mdiCheckCircle } from '@mdi/js'

export default {
  data() {
    return {
      loading: false,
      svgPath: mdiCheckCircle
    }
  },
  computed: {
  },
  created: function () {
    store.commit('SET_ISLOADING', false)
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  mounted() {
    // console.log(window.location.href)
  },
  methods: {
    
  }
}
</script>
