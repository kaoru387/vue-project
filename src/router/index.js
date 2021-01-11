import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
// import Account from '../views/Account.vue'
import SendEmail from '../views/SendEmail.vue'
import UseConfirm from '../views/UseConfirm.vue'

import store from "../store/app.js"

import Firebase from "../Firebase"

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
  {
    path: '/sendemail',
    name: 'sendemail',
    component: SendEmail,
  },
  // {
  //   path: '/account',
  //   name: 'account',
  //   component: Account,
  // },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    /* webpackChunkName: "about" */ 
    component: () => import('../views/About.vue')
  },
  // {
  //   path: "/general1", 
  //   name: 'general1',   
  //   component: () =>import("../components/General1.vue")
  // },
  // {
  //   path: "/general2", 
  //   name: 'general2',   
  //   component: () =>import("../components/General2.vue")
  // },
  {
    path: "/member1", 
    name: 'member1',   
    component: () =>import("../components/StudioReservation.vue")
  },
  // {
  //   path: "/member2", 
  //   name: 'member2',   
  //   component: () =>import("../components/General2.vue")
  // },
  {
    path: "/reservation", 
    name: 'reservation',   
    component: () =>import("../views/About.vue")
  },
  {
    path: "/verifyemail", 
    name: 'verifyemail',   
    component: () =>import("../views/VerifyEmail.vue")
  },
  {
    path: "/useconfirm", 
    name: 'useconfirm',   
    component: () =>import("../views/About.vue"),
    beforeEnter(to, from, next) {　//追記
      // ログイン確認
      var currentUser = Firebase.auth().currentUser;
      if (!currentUser) {  
        // 未だの場合
        next("/");
      } else {  
        next();
      }
    },
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

  // NProgress.start()
  // console.log('start',to.fullPath)

  Firebase.onAuth();

  var auth = Firebase.auth();
  // Get the action to complete.
  var mode = getParameterByName('mode');
  // Get the one-time code from the query parameter.
  var actionCode = getParameterByName('oobCode');
  // (Optional) Get the continue URL from the query parameter if available.
  var continueUrl = getParameterByName('continueUrl');
  var lang = getParameterByName('lang') || 'en';

  switch (mode) {
    case 'resetPassword':
      // Display reset password handler and UI.
      // handleResetPassword(auth, actionCode, continueUrl, lang);
      break;
    case 'recoverEmail':
      // Display email recovery handler and UI.
      // handleRecoverEmail(auth, actionCode, lang);
      break;
    case 'verifyEmail':
     　// email認証完了
      handleVerifyEmail(auth, actionCode, continueUrl, lang, next);
      break;
    case 'signedIn':
      // ログイン後
      let currentUserStatus = Firebase.auth().currentUser;
      if(to.fullPath !== '/useconfirm'){
        store.commit('SET_BACK_URI', to.fullPath)
        // next({ name: 'useconfirm' });
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
    // Email address has been verified.

    // TODO: Display a confirmation message to the user.
    // You could also provide the user with a link back to the app.

    // TODO: If a continue URL is available, display a button which on
    // click redirects the user back to the app via continueUrl with
    // additional state determined from that URL's parameters.
    next('/verifyemail');
  }).catch(function(error) {
    console.log('error',error)
  });

}


export default router
