import firebase from "@firebase/app";
import "@firebase/auth";
import "@firebase/functions";
import router from "./router"
import store from "./store/app";
import { firebaseConfig } from './config/firebase-config'
import "firebaseui-ja/dist/firebaseui.css";
import firebaseui from "firebaseui-ja";

// var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var usersRef = '';
// const authUi=new firebaseui.auth.AuthUI(firebase.auth());

export default {
  //読み込み時に、firebase機能の設定をする
  init() {
    firebase.initializeApp(firebaseConfig);
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    // usersRef = firebase.database().ref("users");
  },
  auth(){
    return firebase.auth();
  },
  authUI(){
    return firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(firebase.auth())
    // return new firebaseui.auth.AuthUI(firebase.auth())
  },
  accountUI(){
    return firebaseui.auth.AuthUI.getInstance()
      .createSignInIntentBuilder()
      .build() || new firebaseui.auth.AuthUI(firebase.auth())
  },
  // validation(newUser) {
  //   return {
  //     password: !!newUser.password,
  //     email: emailRE.test(newUser.email)
  //   };
  // },
  //emailとパスワードでログインする。
  //firebase認証の結果、JWT Tokenが返ってくる。JWTは、localstrageに保存する。
  //ここで、記載しているrouterは、vue-routerの機能で、'/'へルーティングしている
  signInWithEmailAndPassword(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(res => {
        res.user.getIdToken().then(idToken => {
          localStorage.setItem('jwt', idToken);
          router.push('/').catch(err => {
            console.log("router push /");
          });
        })
      }, err => {
        console.log(err.message);
      })
  },
  //emailとパスワードでアカウント作成する
  //アカウント作成後は、'/signin'へルーティング
  signUpWithEmailAndPassword(email, password) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(res => {
        router.push('/signin');
      }).catch(err => {
        console.log(err.message);
      })
  },
  //ログアウト
  //ログアウト後は、保存しているjwtを削除して、vuexのmutationに実装した状態の更新処理でユーザーをログアウト状態にする。
  logOut() {
    firebase.auth().signOut()
      .then(() => {
        localStorage.removeItem("jwt")
        store.commit('onAuthEmailChanged', "");
        store.commit('onUserStatusChanged', false);
        // ストレージ初期化
        store.commit('RESET_VUEX_STATE');
        router.push('/')
        .then(function() {
          console.log("logout ok");
          router.go({ path: '/' })
        })
        .catch(err => {
          console.log("router push /",err);
        });
        this.onAuth()
        // store.commit('SET_ISLOADING', false);

        // セッションクリア
        localStorage.clear()
      })
      .catch((err) => {
        console.log("err",err);
        //console.log(`fail logout (${error}) `);
      })
  },
  //状態管理
  //jwtの状態、ユーザーの状態を更新する。
  onAuth() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // console.log('onAuth!!!',user)
        if (user.ma) {
          localStorage.setItem('jwt', user.ma);
        } 
        store.commit('onAuthEmailChanged', user.email);
        if (user.uid) {
          store.commit('onUserStatusChanged', true); 
        } else {
          store.commit('onUserStatusChanged', false);
        }
      } else {
        store.commit('onAuthEmailChanged', "");
        store.commit('onUserStatusChanged', false);
      }
    })
  },
  credential(){
    return firebaseui.auth.CredentialHelper.NONE;
  },
  signInOptions() {
    let options = [
      // {
      //   provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //   requireDisplayName: false
      // }
    // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      // firebase.auth.PhoneAuthProvider.PROVIDER_ID,

    ]

    // let options = [
    //   {
    //     provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
    //     signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
    //     // Allow the user the ability to complete sign-in cross device,
    //     // including the mobile apps specified in the ActionCodeSettings
    //     // object below.
    //     forceSameDevice: false,
    //     // Used to define the optional firebase.auth.ActionCodeSettings if
    //     // additional state needs to be passed along request and whether to open
    //     // the link in a mobile app if it is installed.
    //     emailLinkSignIn: function() {
    //       return {
    //         // Additional state showPromo=1234 can be retrieved from URL on
    //         // sign-in completion in signInSuccess callback by checking
    //         // window.location.href.
    //         // url: 'https://localhost:4005/completeSignIn?showPromo=1234',
    //         url: 'https://localhost:4005/login?mode=verifyEmail',
    //         // Custom FDL domain.
    //         dynamicLinkDomain: 'https://localhost:4005',
    //         // Always true for email link sign-in.
    //         handleCodeInApp: true,
    //         // Whether to handle link in iOS app if installed.
    //         iOS: {
    //           bundleId: 'com.example.ios'
    //         },
    //         // Whether to handle link in Android app if opened in an Android
    //         // device.
    //         android: {
    //           packageName: 'com.example.android',
    //           installApp: true,
    //           minimumVersion: '12'
    //         }
    //       };
    //     }
    //   }
    // ]
    return options;
  },
  // createUserWithEmailAndPassword(email,password) {
  //   firebase.auth().createUserWithEmailAndPassword(email, password)
  //     .then(
  //       // 成功時の処理
  //     )
  //     .catch(
  //       // エラー時の処理 
  //     )
  // }
}