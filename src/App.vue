<template>
  <v-app id="app">
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        color="blue"
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
      >
        <v-toolbar-title class="p-0" :style="{'color':'white'}">スタジオ予約</v-toolbar-title>
        <div class="text-left ml-1">
          <v-btn
            icon
            color="green"
            @click="refresh"
          >
            <v-icon>mdi-cached</v-icon>
          </v-btn>
        </div>
        <v-spacer></v-spacer>
        <!-- <v-btn
          :disabled="auth.username=='' || !auth.emailVerified"
          v-if="auth.isAdmissionFee"
          class="ma-1"
          text
          icon
          color="orange lighten-2"
          @click="openShop"
        >
          <v-icon>{{ mdiCartVariant }}</v-icon>
        </v-btn> -->
        <!-- <v-btn
          v-if="auth.username!=='' && !auth.isAdmissionFee && auth.emailVerified"
          class="ma-1"
          text
          icon
          color="red lighten-2"
          @click="checkoutAdmission"
        >
          <v-icon>{{ mdiCardAccountDetailsOutline }}</v-icon>
        </v-btn> -->
        <!-- <a v-if="auth.username!=='' && !auth.isAdmissionFee && auth.emailVerified" 
          class="text-decoration-underline sample" :style="{'color':'white !important'}" @click="checkoutAdmission">
          入会金
        </a> -->
        <!-- <v-tooltip v-if="auth.username && !auth.isAdmissionFee" top>
          <template v-slot:activator="{ on, attrs }" >
            <router-link class="nav-link" :to="{ name:'admission'}" active-class="active" exact>
              <v-icon class="mr-3"
              >{{ mdiCardAccountDetailsOutline }}</v-icon>
            </router-link>
          </template>
          <span>入会金</span>
        </v-tooltip> -->
        <a v-if="auth.username==''" class="text-decoration-underline sample" :style="{'color':'white !important'}" @click="openModal" :disabled="loading">
          電話番号ログイン
        </a>
        <!-- <router-link class="nav-link" :to="{ name:'account'}" active-class="active" exact>
          <a v-if="auth.username==''" class="text-decoration-underline sample" :style="{'color':'white !important'}">会員新規登録</a>
        </router-link> -->
        <v-menu
          :disabled="loading"
          bottom
          left
          :style="{'z-index':1008}"
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="outer">
              <div class="sample" :style="{'color':'white'}">
                <div v-if="auth.username!==''" class="d-flex align-items-start flex-column bd-highlight">
                  <div class="p-0 bd-highlight ml-auto">
                    <span v-if="auth.username==null"　class="text-decoration-underline" @click="editAccount">ユーザー</span>
                    <span v-else class="text-decoration-underline" @click="editAccount">{{ auth.username }}</span>
                    <span class="sample">さん</span>
                  </div>
                  <div class="p-0 bd-highlight">ポイント:<span class="ml-1">{{ auth.credit.toLocaleString() }}</span></div>
                </div>
              </div>
              <v-btn
                dark
                icon
                v-bind="attrs"
                v-on="on"
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </div>
          </template>
          <v-list class="text-left pl-2">
            <!-- <v-list-item>
              <v-list-item-title v-if="auth.username==''" @click="openModal">ログイン</v-list-item-title>
            </v-list-item> -->
            <!-- <v-list-item>
              <v-list-item-title v-if="auth.isLine" :style="{'color':'white'}">LINE友達</v-list-item-title>
            </v-list-item> -->
            <!-- <v-list-item>
              <v-list-item-title v-if="auth.username!=='' && auth.emailVerified" @click="editAccount">会員情報</v-list-item-title>
            </v-list-item> -->
            <!-- <v-list-item>
              <v-list-item-title @click="openMaster">管理者</v-list-item-title>
            </v-list-item> -->
            <v-list-item>
              <v-list-item-title v-if="(auth.username!=='' && auth.emailVerified) || auth.username==null" @click="logout">ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>
      <v-sheet
        id="scrolling-techniques-7"
        class="overflow-y-auto"
      >
        <v-container :style="{'margin-top':'55px', 'height':height+'px'}">
          <router-view v-loading="loading"/>
        </v-container>
      </v-sheet>
    </v-card>
    <!-- <transition name="fade">
      <v-btn 
        v-scroll="onScroll"
        v-show="fab"
        fab
        dark
        fixed
        bottom
        right
        color="primary"
        @click="toTop">
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </transition> -->
    <!-- チケット -->
   <!-- <modal-shop 
    ref="dialogCourse"
    :dialog-form-visible="modal_shop_visible" 
    :close-modal="close_modal"
    @reload="reload"
   /> -->
  </v-app>
</template>

<script>
  import store from './store/app';
  import axios from "axios"
  import { mdiAccount, mdiKey, mdiCartVariant, mdiCardAccountDetailsOutline } from '@mdi/js'
  import moment from 'moment-timezone'
  import Firebase from "Firebase";
  import firebase from "@firebase/app";
  // import ModalShop from './components/ModalShop'
  // import { loadStripe } from '@stripe/stripe-js';
  // const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');

export default {
  name: 'App',
  components: {
    // ModalShop,
    // VCard,
    // VCardText,
    // VCardMedia
  },
  data() {
    return {
      activeIndex: 'Home',
      tabs: null,
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      modal_login_visible: false,
      mdiAccount,
      mdiCartVariant,
      mdiCardAccountDetailsOutline,
      items: [
        {
          title: 'ログアウト',
        }
      ],
      fab: false,
      // modal_visible: false,
      modal_shop_visible: false
    }
  },
  computed: {
    // height () {
    //   switch (this.$vuetify.breakpoint.name) {
    //     case 'xs': return 220
    //     case 'sm': return 400
    //     case 'md': return 500
    //     case 'lg': return 600
    //     case 'xl': return 800
    //   }
    // },
    height() {
      return window.innerHeight;
    },
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
    info() {
      return store.state.info;
    },
    // supersass() {
    //   return store.state.auth.supersass;
    // }
  },
  beforeRouteUpdate (to, from, next) { // eslint-disable-line
      console.log('beforeRouteEnter /App');
      next();
  },
  beforeRouteEnter (to, from, next) {
    //ページの更新
    console.log('beforeRouteEnter /App');
  },
  mounted() {
    console.log('mute');
    // console.log("vm2",store.state.backuri);
    // LineLogin
    // let that = this;
    // DOM はまだ更新されていません
    // this.$nextTick(function () {
    //   console.log("vm3",store.state.backuri);
    //   // DOM が更新されています
    //   if(store.state.backuri=='/?mode=successLineLogin') {
    //     that.$router.push({path: '/successlinelogin'})
    //   }
    //   if(store.state.backuri=='/?mode=lineLogin') {
    //     that.$router.push({path: '/linelogin'});
    //   }
    // })
  },
  created: function () {
    var userAgent = window.navigator.userAgent.toLowerCase();
    let browser='';
    if(userAgent.indexOf('msie') != -1 ||
        userAgent.indexOf('trident') != -1) {
        browser='IE';
    } else if(userAgent.indexOf('edge') != -1) {
        browser='edge';
    } else if(userAgent.indexOf('chrome') != -1) {
        browser='chrome';
    } else if(userAgent.indexOf('safari') != -1) {
        browser='safari';
    } else if(userAgent.indexOf('firefox') != -1) {
        browser='firefox';
    } else if(userAgent.indexOf('opera') != -1) {
        browser='opera';
    } else {
        // console.log('そんなブラウザは知らん');
    }
    store.commit('SET_INFO_BROUSER', browser)
    // console.log("browser",browser);
    this.reload();
    
    // 今日の日付取得
    store.commit('SET_SELECT_DATE', this.$moment().format('YYYY-MM-DD'))
  },
  methods: {
    onScroll(e){
      if (typeof window === 'undefined') return
      const top = window.pageYOffset ||   e.target.scrollTop || 0
      // console.log(top)
      this.fab = top > 50
    },
    toTop() {
      this.$vuetify.goTo("#app")
    },
    close_login_modal: function() {
      this.modal_login_visible = false;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = this.$route.name;
      this.activeIndex = key;
    },
    logout: function () {
      if(this.auth.username=="") return;

      // ログアウト処理
      Firebase.logOut();
      this.$message({
        message: 'ログアウトに成功しました！',
        type: 'success'
      });
      
    },
    // login: function () {
    //   if(this.$route.path=='/login') return;
    //   this.$router.replace('/login')
    // },
    schedule: function () {
      if(this.$route.path=='/') return;
      this.$router.replace('/')
    },
    openModal(){
     // ログインチェック
     var that = this;
     let currentUserStatus = Firebase.auth().currentUser;
     if(currentUserStatus==null) {
       // ログイン未だの場合
       that.$router.push({path: '/login'});
       return;
     }
    },
    // openShop() {
    //   // チケット購入
    //   // this.modal_shop_visible = true;
    //   store.commit('SET_ISLOADING', true)
      
    //   let that = this;
    //   let parms = {
    //     price: 4000,
    //     email: that.auth.email
    //   }
    //   const processA = async function() {
    //     const stripe = await stripePromise;
    //     const response = await firebase.functions().httpsCallable('postStripe');
    //     await response({
    //       // path: '/create-checkout-session-ticket',
    //       method: 'POST',
    //       params: {
    //         price: "price_1IJdUsAXJN6gcxR4UbytacgS",
    //         quantity: 1,
    //       },
    //       mode: "payment",
    //       // success_url: "https://localhost:4006/?mode=stripeSuccessPoint",
    //       success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccessPoint",
    //       cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
    //       headers: {
    //         "Accept": "*/*",
    //         "Contsent-Type": "application/json; charset=utf-8",
    //         "Access-Control-Allow-Origin": "*",
    //       }
    //     }).then((res) => {
    //       console.log(res)
    //       const session = res.data;
    //       const sessionId = session.id;

    //       // 一旦保持
    //       Firebase.db().collection("sessions").doc(parms.email)
    //       .set({
    //         sessionId: sessionId,
    //         params: parms,
    //         status: 'checkout'
    //       });

    //       const result = stripe.redirectToCheckout({
    //         sessionId: sessionId,
    //       });
    //       if (result.error) {
    //         console.log(result.error.message);
    //       }
     
    //     });
    //   }
    //   const processAll = async function() {
    //     await processA()
    //   }
    //   processAll()

    // },
    openMaster() {
      this.$router.push({path: '/admin'});
    },
    editAccount() {
      // store.commit('SET_ISLOADING', true)
      this.$router.push({path: '/editaccount'});
    },
    close_modal: function() {
      console.log('close')
      this.modal_shop_visible = false;
    },
    reload() {
      // console.log('relo',this.$route.path);
      let that = this;
      const processA = async function() {
        await store.commit('SET_ISLOADING', true)
        await store.dispatch('getUsers',function(e){
          let currentUserStatus = Firebase.auth().currentUser;
          if(!currentUserStatus) console.log('no singin');
          else store.commit('SET_AUTH', currentUserStatus)
        });
        await store.commit('SET_EVENTS', []);
        // 予約取得
        await store.dispatch('getBookings',{
          callback: function(res){
            if(res) store.commit('SET_ISLOADING', false)
          }
        });
        // // クラス取得
        // await store.dispatch('getClass',{})
         // 自身の予約
        await store.dispatch('getUserAgenda',{
          params: {
            from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            user_email: that.auth.email
          },
        });
      }
      const processAll = async function() {
        await processA()
        if(that.$route.path!=='/') that.$router.push({path: '/'});
      }
      processAll()
    },
    refresh() {
      this.reload();
      store.commit('SET_BACK_URI', '');
    }
  }
};
</script>
