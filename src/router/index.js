import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Account from '../views/Account.vue'
import store from "../store/app.js"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    // children: [
    //   {
    //     // /projects/:page がマッチした時に
    //     path: '/:page',
    //     component: () =>import("../components/StudioNago.vue")
    //   },
    // ],
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
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
    path: "/general1", 
    name: 'general1',   
    component: () =>import("../components/General1.vue")
  },
  {
    path: "/general2", 
    name: 'general2',   
    component: () =>import("../components/General2.vue")
  },
  {
    path: "/reservation", 
    name: 'reservation',   
    component: () =>import("../views/About.vue")
  },
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  // base: process.env.BASE_URL,
  routes: routes,
})

// // router gards
// router.beforeEach((to, from, next) => {
//   // NProgress.start()
//   console.log('start')
//   // トークンが存在、かつログイン有効期限を過ぎてない場合、またはログイン画面の場合
//   if ((store.state.auth.login.token && store.state.auth.login.expire > (new Date()).getTime()) || to.matched.some(page => {
//     store.commit('SET_ISLOADING', false)
//     // ログイン画面はリダイレクト対象外 (他にも404ページなどいくつか対象外にする必要があるかも)
//     return (page.path === '/login')

//   })) {
//     next()
//   } else {
//     // ログイン画面に飛ばす。ログイン後に元の画面に戻れるよう、backuriパラメーターにリダイレクト前のURLを入れる
//     next({path: '/login', query: {backuri: to.fullPath}})
//   }
// })

// router.afterEach((to, from) => {
//   // NProgress.done()
//   console.log('end')
// })


export default router
