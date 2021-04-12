import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
// import Home from '../views/Law.vue'
// import Home from '../components/HelloWorld.vue'

import ReservationStudio from '../views/ReservationStudio.vue'
import Login from '../views/Login.vue'
import SendEmail from '../views/SendEmail.vue'
// import CancelPayment from '../views/CancelPayment.vue'
import SuccessPayment from '../views/SuccessPayment.vue'
// import SuccessAdmission from '../views/SuccessAdmission.vue'
// import SuccessPaymentAddPoint from '../views/SuccessPaymentAddPoint.vue'
import VerifyEmailInvalid from '../views/VerifyEmailInvalid.vue'
// import Account from '../views/Account.vue'
import ResetPassword from '../views/ResetPassword.vue'
// import EditAccount from '../views/EditAccount.vue'
import Admin from '../views/Admin.vue'
import SuccessPayPay from '../views/SuccessPayPay.vue'
import LineLogin from '../views/LineLogin.vue'
import SuccessLineLogin from '../views/SuccessLineLogin.vue'

import store from "../store/app.js"
import Firebase from "../Firebase"
import firebase from "@firebase/app";
import moment from "moment"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {
        // /projects/:page がマッチした時に
        path: '/login',
        component: Login,
        redirect: { name: 'login', params: { param1: 200 } },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  // {
  //   path: '/account',
  //   name: 'account',
  //   component: Account,
  // },
  // {
  //   path: '/editaccount',
  //   name: 'editaccount',
  //   component: EditAccount,
  // },
  {
    path: '/sendemail',
    name: 'sendemail',
    component: SendEmail,
  },
  {
    path: '/resetpassword',
    name: 'resetpassword',
    component: ResetPassword,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    /* webpackChunkName: "about" */ 
    component: () => import('../views/About.vue')
  },
  {
    path: '/admin',
    name: 'admin',
    component: Admin,
  },
  // {
  //   path: "/admission", 
  //   name: 'admission',
  //   component: () =>import("../components/AdmissionCheckout.vue")
  // },
  {
    path: "/reservation", 
    name: 'reservation',   
    component: () =>import("../views/Home.vue")
  },
  {
    path: "/verifyemail", 
    name: 'verifyemail',   
    component: () =>import("../views/VerifyEmail.vue")
  },
  {
    path: "/schedule", 
    name: 'schedule',   
    component: ReservationStudio
  },
  // {
  //   path: "/cancelpayment", 
  //   name: 'cancelpayment',   
  //   component: CancelPayment,
  // },
  {
    path: "/successpayment", 
    name: 'successpayment',
    component: SuccessPayment,
  },
  {
    path: "/successpaypay", 
    name: 'successpaypay',
    component: SuccessPayPay,
  },
  {
    path: "/verifyinvalid", 
    name: 'verifyinvalid',
    component: VerifyEmailInvalid,
  },
  {
    path: "/linelogin", 
    name: 'linelogin',
    component: LineLogin,
  },
  {
    path: "/successlinelogin", 
    name: 'successlinelogin',
    component: SuccessLineLogin,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  // base: process.env.BASE_URL,
  routes: routes,
})

// router gards
router.beforeEach((to, from, next) => {

  store.commit('SET_ISLOADING', true);

  // // LINE LOGINチェック
  // let session_timestamp = moment().format("YYYYMMDDHH");
  // var docRef = Firebase.db().collection("signIn").doc(session_timestamp);
  // docRef.get().then(function(doc) {
  //   if (doc.exists) {
  //     console.log("db sign in!!!", doc.data());
  //     let lineUser = doc.data();
  //     Firebase.signInWithEmailAndPassword(lineUser.email, lineUser.email);
  //     // ログイン後、削除。
  //     docRef.delete().then(function() {
  //       console.log("Document successfully deleted!");
  //     }).catch(function(error) {
  //         console.error("Error removing document: ", error);
  //     });
  //   }else{
  //     store.commit('SET_ISLOADING', false);
  //   }
  // }).catch(function(error) {
  //   console.log("error!?", error);
  //   store.commit('SET_ISLOADING', false);
  // });

  // console.log(store.state.auth.username);


  // 通常処理
  Firebase.onAuth();

  var auth = Firebase.auth();
  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode');
  // (Optional) Get the continue URL from the query parameter if available.
  var continueUrl = getParameterByName('continueUrl');
  var lang = getParameterByName('lang') || 'en';

  // LineLogin成功
  var code = getParameterByName('code');
  var state = getParameterByName('state');
  if(code!=='') {
    let lineLogin = {
      code: code,
      state: state,
    };
    console.log('line login.');
    store.commit('SET_LINE_LOGIN', lineLogin);
    // store.commit('SET_BACK_URI', '/?mode=logined')

  // //   let lineLogin = {
  // //     code: code,
  // //     state: state,
  // //   };
  // //   console.log('line login.');
  // //   // store.commit('SET_BACK_URI', '/?mode=successLineLogin')

  // //   // // 一旦保持
  // //   // let session_timestamp = moment().format("YYYYMMDDHH");
  // //   // Firebase.db().collection("linelogin").doc(session_timestamp)
  // //   // .set({
  // //   //   code: code,
  // //   //   state: state,
  // //   // });
  }
  
  switch (mode) {
    case 'resetPassword':
      // 
      if(to.fullPath !== '/resetpassword'){
        store.commit('SET_BACK_URI', '/?mode=resetPassword');
        handleResetPassword(auth, actionCode, continueUrl, lang);
        // handleResetPassword(auth, actionCode, continueUrl, lang);
      }else{
        console.log('test',to.fullPath)
        // store.commit('SET_BACK_URI', '');
      }
      break;
    case 'verifyEmail':
      console.log('verify',to.fullPath)
      if(to.fullPath !== '/verifyemail'){
        store.commit('SET_BACK_URI', '')
        // email認証完了
        handleVerifyEmail(auth, actionCode, continueUrl, lang, next);  
      }
      break;
    case 'signedIn':
      // ログイン後
      console.log('sign')
      var currentUser = Firebase.auth().currentUser;
      store.commit('SET_AUTH', currentUser);
      if(to.fullPath !== '/login'){
        store.commit('SET_BACK_URI', '')
      }else{
        next();
      }
      break;
    case 'stripeSuccess':
      // if(to.fullPath !== '/successpayment'){
      //   store.commit('SET_BACK_URI', to.fullPath)
      // }else{
      //   next();
      // }
      console.log('stripeSuccess', store.state.auth.session, to.fullPath);
      if(to.fullPath == '/?mode=stripeSuccess'){
        store.commit('SET_BACK_URI', to.fullPath);
        // store.commit('STRIPE_SESSION', '');
      }else{
        // next();
      }
      break;
    case 'stripeCancel': 
      console.log('stripeCancel', store.state.auth.session, to.fullPath);
      if(to.fullPath == '/?mode=stripeCancel'){
        store.commit('SET_BACK_URI', to.fullPath);
        store.commit('STRIPE_SESSION', '');
      }else{
        next();
      }
      break;
    case 'successPayPay':
      // console.log('p', to.fullPath)
      if(to.fullPath !== '/successpaypay'){
        store.commit('SET_BACK_URI', to.fullPath)
      }else{
        next();
      }
      break;
    case 'successLineLogin':
      console.log('successLineLogin?', to.fullPath);
      if(to.fullPath !== '/successlinelogin'){
        store.commit('SET_BACK_URI', '/?mode=successLineLogin');
      }else{
        next();
      }
      break;
    case 'lineLogin':
      console.log('lineLogin?', to.fullPath);
      if(to.fullPath !== '/linelogin'){
        store.commit('SET_BACK_URI', to.fullPath);
      }else{
        // 
        next();
      }
      break;
    default:
      // Error: invalid mode.
  }
  next();
})

// router.afterEach((to, from) => {
//   // NProgress.done()
//   console.log('end')
// })

// URLよりパラメータ取得
function getParameterByName( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( window.location.href );
  if( results == null )
    return "";
  else
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

// email認証
function handleVerifyEmail(auth, actionCode, continueUrl, lang,next) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  // Try to apply the email verification code.
  var that = this;
  auth.applyActionCode(actionCode).then(function(resp) {
    console.log('code',resp,auth.currentUser)
    store.commit('SET_ACTIONCODE', actionCode)
    // store.commit('SET_ACTIONEMAIL', store.state.auth.email)
    // Email address has been verified.
    // TODO: Display a confirmation message to the user.
    // You could also provide the user with a link back to the app.

    // TODO: If a continue URL is available, display a button which on
    // click redirects the user back to the app via continueUrl with
    // additional state determined from that URL's parameters.
    next('/verifyemail');
  }).catch(function(error) {
    console.log('error',error.code)
    if(error.code=="auth/invalid-action-code"){
      console.log('already')
      next('/verifyinvalid');
    }
  });
}

// パスワードリセット
function handleResetPassword(auth, actionCode, continueUrl, lang) {
  console.log('??')
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  var accountEmail;

  // Verify the password reset code is valid.
  auth.verifyPasswordResetCode(actionCode).then(function(email) {
    console.log('resetpassword', email)
    store.commit('SET_ACTIONCODE', actionCode)
    store.commit('SET_ACTIONEMAIL', store.state.auth.email)
    // var accountEmail = email;
    // TODO: Show the reset screen with the user's email and ask the user for
    // the new password.

    // // Save the new password.
    // auth.confirmPasswordReset(actionCode, newPassword).then(function(resp) {
    //   console.log('resp',resp)
    //   // Password reset has been confirmed and new password updated.

    //   // TODO: Display a link back to the app, or sign-in the user directly
    //   // if the page belongs to the same domain as the app:
    //   // auth.signInWithEmailAndPassword(accountEmail, newPassword);

    //   // TODO: If a continue URL is available, display a button which on
    //   // click redirects the user back to the app via continueUrl with
    //   // additional state determined from that URL's parameters.
    // }).catch(function(error) {
    //   // Error occurred during confirmation. The code might have expired or the
    //   // password is too weak.
    // });
  }).catch(function(error) {
    // Invalid or expired action code. Ask user to try to reset the password
    // again.
  });
}

function handleRecoverEmail(auth, actionCode, lang) {
  // Localize the UI to the selected language as determined by the lang
  // parameter.
  var restoredEmail = null;
  // Confirm the action code is valid.
  auth.checkActionCode(actionCode).then(function(info) {
    console.log('11111');
    // Get the restored email address.
    restoredEmail = info['data']['email'];
    // Revert to the old email.
    return auth.applyActionCode(actionCode);
  }).then(function() {
    // Account email reverted to restoredEmail
    console.log('2222');
    // TODO: Display a confirmation message to the user.
    alert('Display a confirmation message to the user');

    // You might also want to give the user the option to reset their password
    // in case the account was compromised:
    auth.sendPasswordResetEmail(restoredEmail).then(function() {
      // Password reset confirmation sent. Ask user to check their email.
    }).catch(function(error) {
      // Error encountered while sending password reset code.
    });
  }).catch(function(error) {
    // Invalid code.
  });
}

export default router
