<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <v-card-title class="text-left pt-4 pb-5">
        <!-- <h4>ログインに成功しました！</h4> -->
        <el-alert
            type="success"
            description="ログインメール認証に成功しました！"
            show-icon>
        </el-alert>
      </v-card-title> 
      <div class="text-center p-3">
        <!-- <router-link to="/login" class="text-primary">ログイン画面</router-link> -->
        <!-- <router-link to="https://dev2.fandangos-okinawa.com/reservation/" class="text-primary">ログイン画面</router-link> -->
        <a href='https://dev2.fandangos-okinawa.com/reservation/' target="_blank" @rel="noreferrer" class="text-primary mb-3">ログイン画面</a>
      </div>
    </v-card>
    
  </div>
</template>

<script>
import store from '../store/app';
// import axios from "axios"
// import firebase from "../Firebase";

// import { mdiAccount,mdiKey } from '@mdi/js'
export default {
  data() {
    return {
    }
  },
  computed: {
    auth() {
      return store.state.auth
    },
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>
