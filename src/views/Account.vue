<template>
  <!-- <div class="login">
    <form method="post" action="https://www.supersaas.com/api/users">
      <input type="hidden" name="account" value="susture"/>
      <input type="hidden" name="id" value="1234fk"/> 
      <input type="hidden" name="user[name]" value="A@susture.com"/>
      <input type="hidden" name="user[full_name]" value="生徒A"/>
      <input type="hidden" name="user[email]" value="A@susture.com"/>
      <input type="hidden" name="user[mobile]" value=""/>
      <input type="hidden" name="user[address]" value=""/>
      <input type="hidden" name="checksum" value="1e5dcff50bb5f9a5273602b25a2f0d41"/>
      <input type="hidden" name="after" value="experience"/>
      <input type="submit" value="Book now"/>
    </form>
  </div> -->
  <div>
    <div id="firebaseui-auth-container"></div>
    <div id="loader">Loading...</div>
    <!-- <v-card 
      :tile="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs"
      >
      <v-card-title class="text-left pt-4 pb-5">
        <h5 class="fill-width">アカウント作成</h5>
      </v-card-title> 
      <v-card-text class="pt-0">
        <v-form ref="loginForm">
          <v-text-field
            name="email"
            label="メールアドレス"
            type="text"
            v-model="model.email"
            :rules="emailRules"
            required
          ></v-text-field>
          <el-alert
            class="mt-0 mb-1"
            v-if="Validation.loginReult"
            type="error"
            :description="Validation.loginReult"
            show-icon>
          </el-alert>
          <v-text-field
            name="password"
            label="パスワード"
            id="password"
            type="password"
            v-model="model.password"
            :rules="passwordRules"
            required
          ></v-text-field>
          <v-text-field
            name="username"
            label="ユーザー名"
            type="text"
            v-model="model.username"
            required
          ></v-text-field>
        </v-form>
      </v-card-text> 
      <v-card-actions>
        <v-btn
          class="fill-width caption"
          color="#FFCB00"
          depressed
          height="48px"
          tile
          @click="login" 
        >
          ログイン
        </v-btn>
      </v-card-actions>
    </v-card> -->
    <v-divider></v-divider>
    <div class="pt-4 pb-1">
      <router-link to="/">キャンセル</router-link>
    </div>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import firebase from "../Firebase";
import { mdiAccount,mdiKey } from '@mdi/js'

export default {
  data() {
    return {
      loading: false,
      emailRules: [
        v => !!v || "メールアドレスは必須項目です。",
        v => (v && v.length <= 128) || "メールアドレスは128文字以内で入力してください。",
        v => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || "メールアドレスの形式が正しくありません。",
        // v => {
        //   if(v=='') return '';
        //   firebase.auth().createUserWithEmailAndPassword(v, 'check9028163840').then(
        //     (err) => {
        //       if(err.code=="auth/email-already-in-use") return "メールアドレスは既に存在しています。";
        //     }
        //   )
        //   return ''

        // }
      ],
      passwordRules: [
        v => !!v || "パスワードは必須項目です。",
        v => (v && v.length <= 32) || "パスワードは32文字以内で入力してください。"
      ],
      model: {
        email: "",
        password: "",
        username: ""
      },
      person: mdiAccount,
      lock: mdiKey,
      passwordShow: false,
      Validation:{
        loginReult: "",
      }
    }
  },
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
  created: function () {
    store.commit('SET_ISLOADING', false)
  },
  mounted() {
    console.log("account! muted");
    
    var ui = firebase.authUI();
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccess: function(currentUser, credential, redirectUrl) {
          // サインイン成功時のコールバック関数
          // 戻り値で自動的にリダイレクトするかどうかを指定
          return true;
        },
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {

          // // 認証種類判定
          // if (authResult.additionalUserInfo.providerId === 'twitter.com') {
          //     return true;
          // } else {
          //     // 確認メールの有無
          //     const mailFlag = authResult.user.emailVerified;
          //     if (mailFlag === false) {

          //         // 確認メール未時に確認メール送信
          //         firebase.auth().currentUser.sendEmailVerification()
          //         .then(function() {
          //             alert('登録メールを送信しました。ご確認ください。');
          //             // URLリロード
          //             root.$router.go()
          //         })
          //         .catch(function(error) {
          //         });

          //     } else {
          //         // 確認メール済時にメイン画面へ移動
          //         return true;
          //     }
          // }

        },
        signInFailure: function(error) {
          console.log('signin error')
          // Some unrecoverable error occurred during sign-in.
          // Return a promise when error handling is completed and FirebaseUI
          // will reset, clearing any UI. This commonly occurs for error code
          // 'firebaseui/anonymous-upgrade-merge-conflict' when merge conflict
          // occurs. Check below for more details on this.
          return handleUIError(error);
        },
        uiShown: function() {
          // The widget is rendered.
          // ログイン画面が出たときに行う作業
          // Hide the loader.
          document.getElementById('loader').style.display = 'none';
        }
      },
      autoUpgradeAnonymousUsers: true,
      signInFlow: 'popup',
      signInSuccessUrl: 'verifyemail',
      signInOptions: firebase.signInOptions(),
      // Terms of service url.
      tosUrl: '<your-tos-url>',
      // Privacy policy url.
      privacyPolicyUrl: '<your-privacy-policy-url>'
    });

      
  },

  methods: {
    login() {

      // バリデーションが通った場合
      if (this.$refs.loginForm.validate()) {

        let that = this;
        firebase.auth().createUserWithEmailAndPassword(this.model.email, this.model.password).then(
          (user) => {
            console.log('OK',user,firebase.auth().currentUser);

            let currentUser = firebase.auth().currentUser;
            currentUser.updateProfile({
              displayName: this.model.username,
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(function() {
              // Update successful.
              that.$router.replace('/')
            }).catch(function(error) {
              // An error happened.
            });
           
            currentUser.sendEmailVerification()
            .then(() => {
              alert('登録メールを送信しました。ご確認ください。');
              // alert('アカウントの新規作成が完了しました！', user.email)
            }).catch((err) => {
              alert('EmailVerificationでerrが発生しました。', err)
            })
            // that.$router.replace('/')
          },
          (err) => {
            let errorCode = err.code
            let errorMessage = err.message
            // console.log(errorCode)
            if(errorCode=='auth/email-already-in-use') {
              // alert('emailは既に存在しています！');
              this.Validation.loginReult="emailは既に存在しています！"
            }
            
            // alert()
            // console.log(errorCode,errorMessage)
          }
        )


      }
    }
  }
}
</script>
