<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="text-left pt-4 pb-5">
        <h5 class="fill-width">登録メール送信済</h5>
      </v-card-title>
      <v-icon 
        large
        color="#03BFA5"
      >{{ svgPath }}</v-icon>
      <v-card-text class="pt-0 mt-5 text-left">
        登録メールが送信されました。 登録メールをチェックしてサインインを完了してください。
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
    // store.commit('SET_ISLOADING', false)
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  mounted() {
    // console.log(window.location.href)
  },
  methods: {
    
  }
}
</script>
