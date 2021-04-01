<template>
  <div>
    <!-- <div class="mx-auto pb-3" :style="{'max-width':'360px'}">
    </div> -->
    <!-- <v-app class="p-2">
      <el-page-header @back="backHome" content="ログイン" title="戻る" class="mt-2 mb-3">
      </el-page-header>
    </v-app> -->
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
    <v-divider></v-divider>
    <!-- <div class="pt-8 pb-4">
      <span>アカウントをお持ちですか？</span>
      <router-link to="/account" class="text-primary">新規アカウント作成</router-link>
    </div> -->
    <!-- <div class="pt-4 pb-1">
      <button type="button" class="btn btn-light" @click="cancel">キャンセル</button>
    </div> -->
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import firebase from "../Firebase";
import firebaseapp from "@firebase/app";
// import firebaseui from "firebaseui-ja";

// import { mdiAccount,mdiKey } from '@mdi/js'
export default {
  data() {
    return {
      loading: false,
      isFirst: true,
      // emailRules: [
      //   v => !!v || "メールアドレスは必須項目です。",
      //   v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
      //   v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
      // ],
      // passwordRules: [
      //   v => !!v || "パスワードは必須項目です。",
      //   v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
      // ],
      model: {
        username: "",
        password: ""
      },
      // person: mdiAccount,
      // lock: mdiKey,
      passwordShow: false,
      // companies: [],
    }
  },
  // beforeRouteEnter (to, from, next) {
  //     //ページの更新
  //     console.log('beforeRouteEnter login');
  //     next()
  // },
  // data: () => ({
  //   loading: false,
  //   emailRules: [
  //     v => !!v || "メールアドレスは必須項目です。",
  //     v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
  //     v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。"
  //   ],
  //   passwordRules: [
  //     v => !!v || "パスワードは必須項目です。",
  //     v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
  //   ],
  //   model: {
  //     email: "",
  //     password: ""
  //   },
  //   person: mdiAccount,
  //   lock: mdiKey,
  // }),
  computed: {
    // username() {
    //   return this.$store.actions.email
    // },
    // userStatus() {
    //   //return true in login state
    //   return this.$store.actions.isSignedIn
    // },
    // ui() {
    //   return store.state.firebaseui;
    // }
  },
  created: function () {
    // store.commit('SET_ISLOADING', false)
    // this.ui = new firebaseui.auth.AuthUI(firebase.auth());
  },
  mounted() {
    console.log("Login mounted");
    console.log(this.$route.path);
    
    store.commit('SET_ISLOADING', false);

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
          console.log('providerId',authResult.additionalUserInfo.providerId)
          // // 認証種類判定
          // if (authResult.additionalUserInfo.providerId === 'twitter.com') {
          //     return true;
          // } else {
          //   // 確認メールの有無
          //   const mailFlag = authResult.user.emailVerified;
          //   if (mailFlag === false) {
              
          //     // 確認メール未時に確認メール送信
          //     firebase.auth().currentUser.sendEmailVerification()
          //     .then(function() {
          //       // alert('登録メールを送信しました。メールが届いているかをご確認ください。');
          //       // URLリロード
          //       that.$router.replace('/sendemail')
          //     })
          //     .catch(function(error) {
          //       console.log('error!',error)
          //       // alert('登録に失敗しました!');
          //       // that.$router.replace('/')
          //     });

          //   } else {
          //     // 確認メール済時にメイン画面へ移動
          //     console.log('error')
          //     return true;
          //   }

          // }
          // alert('管理者に通知されました。登録メールが届くまで、しばらくお待ち下さい...');
          // that.$router.replace('/')
        },
        signInFailure: function(error) {
          console.log('not 3')

          // alert('signin error')
          // Some unrecoverable error occurred during sign-in.
          // Return a promise when error handling is completed and FirebaseUI
          // will reset, clearing any UI. This commonly occurs for error code
          // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
          // occurs. Check below for more details on this.
          return handleUIError(error);
        },
        uiChanged: function (fromPageId, toPageId) {
          console.log('uiChanged isPendingRedirect: ', ui.isPendingRedirect())
          // console.log('uiChanged fromPageId:', fromPageId)
          // console.log('uiChanged toPageId:', toPageId)

          // // キャンセルボタン非表示
          // var kesu = document.getElementsByClassName('firebaseui-id-secondary-link');
          // for(var i = 0; i < kesu.length; i++) {
          //   // kesu[i].style.display = "none";
          //   kesu[i].type = "button";
          //   kesu[i].onclick = function() {
          //     // ここに#buttonをクリックしたら発生させる処理を記述する
              
          //     firebase.onAuth();
          //     ui.reset();
          //     that.$router.replace('/about');
          //   };
          // }
        },
        uiShown: function() {
          console.log('uiShown isPendingRedirect: ', ui.isPendingRedirect())
          // The widget is rendered.
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      // autoUpgradeAnonymousUsers: true,
      signInFlow: 'redirect',
      // signInFlow: 'popup',
      // Query parameter name for mode.
      queryParameterForWidgetMode: 'mode',
      // Query parameter name for sign in success url.
      queryParameterForSignInSuccessUrl: 'signInSuccessUrl',
      signInSuccessUrl: '/?mode=signedIn',
      // signInOptions: firebase.signInOptions(),
      signInOptions: [
        // firebaseapp.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseapp.auth.PhoneAuthProvider.PROVIDER_ID,
      ],
      // tosUrl: '<your-tos-url>',
      // privacyPolicyUrl: '<your-privacy-policy-url>',
      // credentialHelper: firebase.credential()
      credentialHelper: 'none'
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        ui.reset();
        that.isFirst=false;
        // 最新取得
        store.dispatch('getUsers',function(e){
          setTimeout(function(){
            store.commit('SET_AUTH', user)
            store.commit('SET_ISLOADING', false)
          },200);
        });
        // store.commit('SET_ISLOADING', false)
      }else{
        firebase.onAuth();
        ui.start("#firebaseui-auth-container", uiConfig);
      }
    })

    if (ui.isPendingRedirect()) {
      ui.start("#firebaseui-auth-container", uiConfig);
    }
    
    // // This can also be done via:
    // // console.log(window.location.href)
    // if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
      // ui.start('#firebaseui-auth-container', uiConfig);
    // }

  },
  methods: {
    cancel: function () {
      store.commit('SET_BACK_URI', '/');
      this.$router.replace('/')
    },
    backHome() {
      store.commit('SET_BACK_URI', '/back');
      this.$router.replace('/');
    }
  }
}
</script>
