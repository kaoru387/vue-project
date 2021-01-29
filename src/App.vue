<template>
  <v-app id="app">
    <v-card class="overflow-hidden">
      <v-app-bar
        absolute
        color="blue"
        elevate-on-scroll
        scroll-target="#scrolling-techniques-7"
      >
        <!-- <v-app-bar-nav-icon></v-app-bar-nav-icon> -->
        <v-toolbar-title class="p-0" :style="{'color':'white'}">スタジオ予約</v-toolbar-title>
        <!--  -->
        <div class="text-left ml-1">
            <v-btn
              icon
              color="green"
              @click="reLoad"
            >
              <v-icon>mdi-cached</v-icon>
            </v-btn>
        </div>
        <v-spacer></v-spacer>
        <v-btn
          v-if="auth.username"
          class="ma-2"
          text
          icon
          color="orange lighten-2"
          @click="openShop"
        >
          <v-icon>{{ mdiCartVariant }}</v-icon>
        </v-btn>
        <v-tooltip v-if="auth.username==''" top>
          <template v-slot:activator="{ on, attrs }" >
            <v-icon class="mr-3"
              v-bind="attrs"
              v-on="on"
            >{{ mdiCartVariant }}</v-icon>
          </template>
          <span>会員様のみ</span>
        </v-tooltip>

        <v-menu
          bottom
          left
        >
          <template v-slot:activator="{ on, attrs }">
            <div class="outer">
              <div class="sample" :style="{'color':'white'}">
                <!-- <v-icon color="darken-2">{{ mdiAccount }}</v-icon> -->
                <!-- <span class="mr-2" v-if="auth.username">{{ auth.username }}さん</span>
                <span class="mr-2" v-if="auth.username">{{ auth.credit }}</span> -->
                <div v-if="auth.username" class="d-flex align-items-start flex-column bd-highlight">
                  <div class="p-0 bd-highlight ml-auto">{{ auth.username }}</div>
                  <div class="p-0 bd-highlight ml-auto"><span class="sample ml-1">さん</span></div>
                  <div class="p-0 bd-highlight">ポイント:</div>
                  <div class="p-0 bd-highlight ml-auto"><span class="ml-1">{{ auth.credit.toLocaleString() }}</span></div>
                </div>
                <a v-else class="text-decoration-underline" :style="{'color':'white !important'}" @click="openModal">
                  会員登録
                </a>
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

          <!-- <v-icon color="darken-2">mdi-cart-variant</v-icon> -->

          <v-list class="text-left pl-2">
            <!-- <v-list-item
              v-for="(item, i) in items"
              :key="i"
            >
              <v-list-item-title class="p-2" @click="logout">{{ item.title }}</v-list-item-title>
            </v-list-item> -->
            <v-list-item>
              <v-list-item-title class="p-2" @click="openModal">ログイン</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title class="p-2" @click="logout">ログアウト</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-app-bar>
      <v-sheet
        id="scrolling-techniques-7"
        class="overflow-y-auto"
      >
        <v-container :style="{'margin-top':'55px','height':height+'px'}">
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
   <modal-shop 
    ref="dialogCourse"
    :dialog-form-visible="modal_shop_visible" 
    :close-modal="close_modal"
    @reLoad="reLoad"
   />
  </v-app>
</template>

<script>
  import store from './store/app';
  import { mdiAccount, mdiKey, mdiCartVariant } from '@mdi/js'
  import firebase from "Firebase";
  import ModalShop from './components/ModalShop'

export default {
  name: 'App',
  components: {
    ModalShop,
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
  },
  mounted() {
    // console.log('mute',window.screen.height)
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
    console.log("browser",browser);
    store.commit('SET_ISLOADING', true)

    let that = this;
    const processA = async function() {
      // ログインチェック
      await firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          store.commit('SET_AUTH', user)
        } else {
          console.log('no singin')
        }
        that.reLoad();
      });
    }
    const processAll = async function() {
      await processA()
    }
    processAll()
    
    // 状態ストレージ保有
    // console.log('state!',store.state)
    localStorage.setItem('state', JSON.stringify(store.state));
    // store.commit('SET_ISLOADING', false)
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
      firebase.logOut();
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
     let currentUserStatus = firebase.auth().currentUser;
     // console.log('current',currentUserStatus)
     if(currentUserStatus===null) {
       // ログイン未だの場合
       that.$router.push({path: '/login'});
       return;
     }
    },
    openShop() {
      this.modal_shop_visible = true;
    },
    close_modal: function() {
      console.log('close')
      this.modal_shop_visible = false;
    },
    reLoad() {
      let that = this;
      const processA = async function() {
        await store.commit('SET_ISLOADING', true)
        await store.commit('SET_EVENTS', []);
        // 予約取得
        await store.dispatch('getBookings')
        // クラス取得
        await store.dispatch('getClass',{})
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    }
  }
};
</script>
