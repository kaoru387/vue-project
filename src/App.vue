<template>
  <v-app>
    <v-card flat>
      <v-card-title>
        <span class="headline">スタジオ予約</span>
        <v-spacer></v-spacer>
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <span v-if="auth.username">{{ auth.username }}さん</span>
            <v-icon color="darken-2">{{ mdiAccount }}</v-icon>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item @click.native="login">ログイン</el-dropdown-item> -->
            <el-dropdown-item @click.native="logout">ログアウト</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="test">テスト</el-dropdown-item> -->
            <!-- <el-dropdown-item icon="el-icon-circle-plus">Action 2</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus-outline">Action 3</el-dropdown-item>
            <el-dropdown-item icon="el-icon-check">Action 4</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-check">Action 5</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </v-card-title>
      <!-- <v-card-text>Lorem Ipsum</v-card-text> -->
    </v-card>
    <v-main>
      <!-- <v-container fluid> -->
      <router-view v-loading="loading"/>  

      <!-- </v-container> -->
    </v-main>
  
  </v-app>
</template>

<script>
  import store from './store/app';
  import { mdiAccount,mdiKey } from '@mdi/js'
  import firebase from "Firebase";

export default {
  name: 'App',
  components: {
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
      // username:'',
    }
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
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
    

    let that = this;
    // ログインチェック
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // console.log('singin',user.displayName)
        // that.username = user.displayName;
        store.commit('SET_AUTH', user)
      } else {
        console.log('no singin')
        // that.username='';
      }
    });

    // // サービスリソース取得
    // store.dispatch('getServiceResources')
    // // 一般会員取得
    // store.dispatch('getNonMembers')

    // 初期化
    store.commit('SET_EVENTS', [])

    // 予約取得
    store.dispatch('getDatas')
    // store.dispatch('getDatas', function(e){
    //     let books = _.forEach(e.data, function(v, key) {
    //       store.dispatch('getBookings',{ 
    //         schedule_id: v.id,
    //         name: v.name,
    //         slot: true
    //       });
    //     });
    // });

    // 状態ストレージ保有
    // console.log('state!',store.state)
    localStorage.setItem('state', JSON.stringify(store.state));
    store.commit('SET_ISLOADING', false)
    // 今日の日付取得
    store.commit('SET_SELECT_DATE', this.$moment().format('YYYY-MM-DD'))
    
  },
  methods: {
    close_login_modal: function() {
        this.modal_login_visible = false;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = this.$route.name;
      this.activeIndex = key;
    },
    logout: function () {
      if(this.username=="") return;

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
  }
};
</script>
