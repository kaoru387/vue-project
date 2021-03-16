<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      class="pb-5"
      >
      <v-card-title class="text-left pt-4">
        <v-row class="mt-2 pb-1" justify="center" align-content="center">
          <h4 class="pt-2">ログインしてください</h4>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-3">
        LINEアカウントを利用してログインを行います。<br />
        <hr />
        <div class="text-left">
          本Webサービスでは、ログイン時の認証画面にて許可を頂いた場合のみ、あなたのLINEアカウントに登録されているメールアドレスを取得します。<br />
          取得したメールアドレスは、以下の目的以外では使用いたしません。また、法令に定められた場合を除き、第三者への提供はいたしません。
        </div>
        <ul class="pt-1 text-left">
          <li>ユーザーIDとしてアカウントの管理に利用</li>
          <li>パスワード再発行時の本人確認に利用</li>
        </ul>
        <hr/>
      </v-card-text>
      <p class="text-center">
        <a @click="getLineUrl">
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

      let that = this;
      that.$confirm('<strong class="text-left">LINEアカウント情報にメールアドレスが設定されていない場合、失敗いたします。また、情報共有をご許可いただけないお客様も失敗いたしますので、電話番号ログインをご利用ください。</strong>', 'LINEアカウント情報共有確認', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '承諾',
          type: 'warning',
          center: true,
        }).then(() => {
          // console.log(res)
          store.commit('SET_ISLOADING', true);
          // const url = "https://localhost:4006";
          const url = "https://vue-authentification-b7a7a.firebaseapp.com";
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
        }).catch(() => {
      });

   
    },
  }
}
</script>
