<template>
  <div>
    <el-page-header @back="backHome" content="LINEログイン" title="戻る" class="mt-2 mb-3">
    </el-page-header>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      class="p-2"
      >
      <!-- <v-card-title class="text-center pt-4">
        <v-row class="mt-2 pb-1" justify="center" align-content="center">
          <h4 class="pt-2">LINEログイン</h4>
        </v-row>
      </v-card-title> -->
      <div class="d-flex justify-content-center mt-4 mb-3">
        <div class="align-self-center">
          <h3 class="h5 g-color-black mb-0">LINEログインについて</h3>
        </div>
      </div>
      <v-card-text class="pt-3">
        LINEアカウントを利用してログインを行います。<br />
        <hr />
        <div class="text-left">
          本Webサービスでは、ログイン時の認証画面にて許可を頂いた場合のみ、あなたのLINEアカウントに登録されているメールアドレスを取得します。<br />
          取得したメールアドレスは、以下の目的以外では使用いたしません。また、法令に定められた場合を除き、第三者への提供はいたしません。
        </div>
        <ul class="pl-3 pt-3 text-left">
          <li>ユーザーIDとしてアカウントの管理に利用</li>
          <li>パスワード再発行時の本人確認に利用</li>
        </ul>
        <hr/>
      </v-card-text>
      <p class="text-center mb-5">
        <a @click="getLineUrl" :style="{'cursor': 'pointer'}">
          <img width="148" height="44" src="/images/btn_login_base.png"/>
        </a>
      </p>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import Firebase from "Firebase";
// import moment from "moment";

export default {
  components: {
  },
  data() {
    return {
      use_type: '',
      time_zone: '',
      displayName: '',
      userId: '',
      statusMessage: '',
      pictureUrl: '',
    }
  },
  computed: {
    auth() {
      return store.state.auth;
    },
    lineLogin() {
      return store.state.lineLogin;
    },
    supersass() {
      return store.state.auth.supersass;
    },
  },
  created: function () {

  },
  mounted() {
  },
  methods: {
    result(res) {
      console.log(res)
    },
    getLineUrl: async function(){
      console.log('OK', this.lineLogin);
          
      store.commit('SET_ISLOADING', true);
      // const url = "https://localhost:4006";
      const url = this.supersass.baseHost;
      store.dispatch('getLineLogin',{
        params: {
          channel_id: '1655706276',
          redirect_uri: url+'/?mode=successLineLogin',
        },
        callback: function(res){
          console.log('success linelogin.', res);
          store.commit('SET_ISLOADING', false);
          window.location.href = res.data;
        }
      });
    },
    backHome() {
      store.commit('SET_BACK_URI', '/back');
      this.$router.replace('/');
    }
  }
}
</script>
