<template>
  <div>
    <v-card 
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      class="pb-5"
      >
      <v-card-title class="text-left pt-4">
        <!-- <h4>ログインに成功しました！</h4> -->
        <v-row class="mt-2 pb-1" justify="center" align-content="center">
          <h4 class="pt-2">登録メール認証成功</h4>
        </v-row>
      </v-card-title>
      <el-alert
        class="text-left"
        type="success"
        description="メール認証に成功しました！ログインしてください"
        show-icon>
      </el-alert>
      <div id="firebaseui-auth-container"></div>
      <div id="loader">Loading...</div>
    </v-card>
  </div>
</template>

<script>
import store from '../store/app';
import firebase from "Firebase";
// import firebase from "@firebase/app";

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
    // store.commit('SET_ISLOADING', true)
    // let that = this;
    // firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     console.log(user)
    //     store.commit('SET_AUTH', user)
    //     setTimeout(function(){
    //       window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    //     },3000);
    //   }else{
    //     console.log('error')
    //     that.$router.push({path: '/login'});
    //   }
    //   store.commit('SET_ISLOADING', false)
    // })
  },
  mounted() {
    console.log("Login mounted");
    store.commit('SET_ISLOADING', true)
    let that = this;
    var ui = firebase.authUI();
    var uiConfig = {
      callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
          // サインイン成功時のコールバック関数
          // 戻り値で自動的にリダイレクトするかどうかを指定
          console.log('1',currentUser)
          return true;
        },
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
          console.log('OK')
          // 確認メールの有無
          const mailFlag = authResult.user.emailVerified;
          if(mailFlag){
            window.location.href = "https://www.fandangos-okinawa.com/reservation/"
          }
        },
        signInFailure: function(error) {
          console.log('not 3')
          return handleUIError(error);
        },
        uiChanged: function (fromPageId, toPageId) {
          console.log('uiChanged isPendingRedirect: ', ui.isPendingRedirect())
        },
        uiShown: function() {
          console.log('uiShown isPendingRedirect: ', ui.isPendingRedirect())
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      signInFlow: 'popup',
      queryParameterForWidgetMode: 'mode',
      queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
      signInSuccessUrl: 'https://www.fandangos-okinawa.com/reservation/',
      signInOptions: firebase.signInOptions(),
      credentialHelper: 'none'
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        ui.reset();
      }else{
        firebase.onAuth();
        ui.start("#firebaseui-auth-container", uiConfig);
      }
    })

    if (ui.isPendingRedirect()) {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
    
  },
  methods: {
    // reload() {
    //   store.commit('SET_ISLOADING', true)
    //   store.commit('SET_BACK_URI', '');
    //   window.location.href = "https://www.fandangos-okinawa.com/reservation/"
    //   // this.$router.push({path: '/'});
    // }
  }
}
</script>
