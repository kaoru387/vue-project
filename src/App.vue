<template>
  <body>
    <main>
      <v-app 
        v-loading="loading || lineLogin!==''" 
        :class="bottomClass"
        :style="{'height':height+'px'}">

        <!-- Header -->
        <header id="js-header" class="u-header u-header--static u-shadow-v19">
          <!-- Top Bar -->
          <div class="u-header__section g-brd-bottom g-brd-gray-light-v4 g-transition-0_3">
            <div class="container">
              <div class="row justify-content-between align-items-center g-mx-0--lg">
                <div>
                  <!-- Social Icons -->
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                      <v-app-bar-nav-icon 
                        @click.stop="drawer = !drawer" class="float-left"
                        :disabled="auth.email=='' || auth.isNeedName"
                      ></v-app-bar-nav-icon>
                    </li>
                  </ul>
                  <!-- End Social Icons -->
                </div>
                <div v-if="auth.email!=='' && !auth.isNeedName" class="g-color-white-opacity-0_6 g-font-weight-400 g-pl-15 g-pl-0--sm">
                  <figure class="text-right m-0" :style="{'line-height':'15px'}">
                    <p class="g-color-gray-dark-v5 g-font-size-11">あなたのポイント</p>
                    <span class="g-color-primary g-font-size-14 pr-1">{{ auth.credit.toLocaleString() }}</span>
                  </figure>
                </div>
                <div class="g-pos-rel g-py-14">
                  <!-- List -->
                  <ul class="list-inline g-pt-1 g-mx-minus-4 mb-0  mr-4">
                    <li class="list-inline-item g-mx-4">
                      <v-icon :style="{color:'#05A72E'}" @click="refreshData">{{ mdiRestore }}</v-icon>
                    </li>
                    <li v-if="auth.email!==''" class="list-inline-item">
                      <a v-if="auth.isNeedName" href="#" class="text-decoration-underline" :style="{'color':'red'}" @click="editAccount">名前を変更してください</a>
                      <!-- <a v-else href="#" @click="editAccount" class="text-decoration-underline">
                        <div class="box-read" :style="{width:'50px'}">{{ auth.username }}</div>
                      </a> -->
                      <div v-else class="float-left">
                        <div class="box-read" :style="{'max-width':'70px'}">
                          <a href="#" @click="editAccount" class="text-decoration-underline">
                            {{ auth.username }}
                          </a>
                        </div>
                      </div><span class="sample pl-1 pt-1">さん</span>
                    </li>
                    <li v-else class="list-inline-item g-mx-4">
                      <a class="g-color-text g-color-primary--hover g-font-weight-400 g-text-underline--none--hover" href="#" @click="scrollLogin">ログインしてください</a>
                    </li>
                    <!-- <li v-if="auth.email!==''" class="list-inline-item">
                      <span v-if="!auth.isNeedName" class="sample pl-1 pt-1">さん</span>
                    </li> -->
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <!-- End Top Bar -->
        </header>
        <!-- <div id="recaptcha-container"></div> -->
    
        <!-- Promo Slider -->
        <v-container id="hide-on-scroll-example" :class="bottomContentClass">
          <!-- <v-row v-if="auth.email!=='' && !isSearch" justify="center" align-content="center" class="d-flex bd-highlight p-3">
            <span class="p-0 bd-highlight pr-2">
              <el-button :style="{'width':'100%'}" @click="drawerOpen" :disabled="auth.email==''" round>
                スタジオ予約
              </el-button>
            </span>
            <span class="p-0 bd-highlight">
              <el-button :style="{'width':'100%'}" @click="moveClass" :disabled="auth.email==''" round>
                クラス予約
              </el-button>
            </span>
          </v-row> 
          <router-view @drawerOpen="drawerOpen" />
          -->
          <router-view />

        </v-container>

        <a class="js-go-to u-go-to-v2" href="#"
           data-type="fixed"
           data-position='{
             "bottom": 15,
             "right": 15
           }'
           data-offset-top="400"
           data-compensation="#js-header"
           data-show-effect="zoomIn">
          <i class="hs-icon hs-icon-arrow-top"></i>
        </a>

        <!-- アカウント編集 -->
        <modal-edit-account 
          ref="dialogEditAccount"
          :dialog-form-visible="modal_editaccount_visible" 
          :close-modal="close_modal"
        />

        <!-- slide bar -->
        <v-navigation-drawer
          v-model="drawer"
          :style="{'z-index':1000, 'height': height+'px', 'min-width': '280px'}"
          absolute
          temporary
          left
          scroll-target="#scrolling-techniques-7">
          <v-card class="overflow-hidden">
            
            <v-sheet
              id="scrolling-techniques-7"
              class="overflow-y-auto"
              :max-height="height"
            >
              <v-container>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title class="text-center">
                      <h4 class="h4 pt-5 g-font-weight-700">スタジオ予約</h4>
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <div v-if="auth.email!==''" class="p-1 mb-2">
                  <el-alert
                    class="text-left"
                    type="warning"
                    description="スタジオ空き時間を検索して、予約時間を選択してください。"
                    show-icon>
                  </el-alert>
                  
                  <div class="text-center g-color-primary">
                    <h4 class="pt-6 pb-2 g-font-weight-600 g-font-size-20">空き時間検索</h4>
                  </div>
                  <search-studio 
                    ref="searchStudio"
                    @searchStudio="searchStudio"
                    @cancel="cancel"
                   />
                </div>
                <div v-else class="mt-5 g-color-primary">
                  <v-list-item-title class="pl-3 pt-4" @click="goSchedule">スタジオ予約状況</v-list-item-title>
                  <v-list-item-title class="pl-3 pt-4" @click="goReception">参加者募集</v-list-item-title>
                  <v-list-item-title class="pl-3 pt-4" @click="goLogin">ログイン</v-list-item-title>
                  <v-list-item-title class="pl-3 pt-4 pb-4" @click="goPrice">スタジオ利用料金表</v-list-item-title>
                  <!-- <el-alert
                    class="text-left mb-5"
                    type="warning"
                    description="ログインしてください"
                    show-icon>
                  </el-alert> -->
                </div>

                <v-divider></v-divider>
                <v-list class="g-pb-20" dense>
                  <v-list-item>
                    <v-btn
                      class="mb-3"
                      color="gray"
                      text
                      @click="goHomePage"
                    >
                      Flamencoartsホームページへ
                    </v-btn>
                  </v-list-item>
                  <v-list-item>
                    <!-- <v-list-item-title v-if="auth.email!==''" @click="logout" class="text-secondary">ログアウト</v-list-item-title> -->
                    <v-btn
                      v-if="auth.email!==''"
                      color="gray"
                      text
                      @click.stop="isLogout = true"
                    >
                      ログアウト
                    </v-btn>
                  </v-list-item>
                </v-list>
                <p class="text-right pr-1">ver 3.1</p>
                <!-- <p class="text-right pr-1">ver 3.1.β</p> -->
              </v-container>
            </v-sheet>
          </v-card>
        </v-navigation-drawer>
        <!-- End slide bar -->

        <!-- ログアウト確認 -->
        <v-dialog
          v-model="isLogout"
          max-width="290"
          :style="{'z-index':999}"
        >
          <v-card>
            <v-card-title class="headline">ログアウト確認</v-card-title>

            <v-card-text>
              本当にログアウトしてよろしいですか？
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                outlined
                text
                @click.stop="isLogout = false"
              >
                キャンセル
              </v-btn>
              <v-btn
                color="error"
                outlined
                text
                @click="logout"
              >
                ログアウトする
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-bottom-navigation
          v-if="$route.path=='/schedule' && !isSearch"
          absolute
          hide-on-scroll
          horizontal
          scroll-target="#hide-on-scroll-example"
          :height="50"
        >
          <v-btn
            color="deep-purple accent-4"
            text
            @click="drawerOpen"
          >
            <span class="g-font-size-13">スタジオ予約</span>

            <v-icon class="mr-0">mdi-magnify</v-icon>
          </v-btn>

          <v-btn
            color="deep-purple accent-4"
            text
            @click="moveClass"
          >
            <span class="g-font-size-13">クラス予約</span>

            <v-icon class="mr-0">mdi-arrow-right-bold</v-icon>
          </v-btn>
        </v-bottom-navigation>

      </v-app>
    </main>
  </body>
</template>
<!-- <style>
  .js-scrollable {
    width: 100%;
    overflow-x: scroll;
    width: 500px;
  }
  table {
    width: 800px;
  }
  th {
    font-size: 16px;
    font-weight: bold;
    padding: 20px;
  }
  td {
    font-size: 14px;
    padding: 20px;
    line-height: 1.4;
  }
</style> -->

<script>
  import store from './store/app';
  import axios from "axios"
  import { mdiRestore } from '@mdi/js'
  import moment from 'moment-timezone'

  import Firebase from "Firebase";
  import firebase from "@firebase/app";

  import SearchStudio from './components/SearchStudio';
  import ModalEditAccount from './components/ModalEditAccount'

export default {
  name: 'App',
  components: {
    SearchStudio,
    ModalEditAccount,
    // FullCalendar,
    // NormalReceptionClass,
  },
  data() {
    return {
      modal_editaccount_visible: false,
      // modal_loginconfirm_visible: false,
      drawer: false,
      scrollInvoked: 0,
      isLogout: false,
      // post: null,
      // error: null,
      items: [],
      group: [0],
      mdiRestore,
      activeClass: 'overflow-hidden mx-auto',
      normalClass: ''
    }
  },
  computed: {
    bottomClass: function() {
      // 下メニューバーのスクロール制御
      // console.log('oi', this.$route.path);
      if(this.$route.path!=='/schedule') return '';
      return 'overflow-hidden mx-auto';
    },
    bottomContentClass: function() {
      // 下メニューバーのスクロール制御
      if(this.$route.path!=='/schedule') return '';
      return 'overflow-y-auto';
    },
    adjust () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },
    height() {
      return window.innerHeight;
    },
    loading() {
      return store.state.isLoading;
    },
    events() {
      return store.state.result.events;
    },
    classes() {
      return store.state.result.classes;
    },
    auth() {
      return store.state.auth;
    },
    info() {
      return store.state.info;
    },
    lineLogin() {
      return store.state.lineLogin;
    },
    supersass() {
      return store.state.auth.supersass;
    },
    search() {
      return store.state.search;
    },
    isSearch() {
      return store.state.isSearch;
    },
  },
  // watch: {
  //   // ルートが変更されたらこのメソッドを再び呼び出します
  //   $route: 'fetchData'
  // },
  // beforeRouteUpdate (to, from, next) { // eslint-disable-line
  //     console.log('beforeRouteEnter /App');
  //     next();
  // },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter /App');
  // },
  mounted() {
    
    let that = this;
    console.log('app mount!!', store.state.backuri, '-', that.$route.path)
    // // 受付イベントの場合
    // if(store.state.backuri=='/reception') {
    //   that.$nextTick(function () {
    //     that.$router.push({path: '/reception'});
    //   });
    //   return;
    // }

    if(store.state.backuri=='/?mode=successLineLogin') {
      that.$router.push({path: '/successlinelogin'});
    }

    if(store.state.backuri=='/?mode=stripeCancel') {
      that.$nextTick(function () {
        store.commit('SET_ISLOADING', true);
        that.$message({
          type: 'error',
          message: 'カード決済をキャンセルしました。',
        });
        store.commit('SET_BACK_URI', '');
        setTimeout(function(){
          that.$router.push({path: '/schedule'});
        }, 500);
      });
      return;
    }else if(store.state.backuri=='/?mode=stripeSuccess') {
      that.$nextTick(function () {
        store.commit('SET_BACK_URI', '');
      });
      return;
    }else if(store.state.backuri=='/?mode=successPayPay') {
      store.commit('SET_ISLOADING', true);
      that.$nextTick(function () {
        store.commit('SET_BACK_URI', '');
      });
      return;
    }
    
    // LINEアカウント情報ありの場合
    if(store.state.backuri=='/line' && that.lineLogin!=='' && that.auth.email==''){
      // LINEアカウント取得
      that.$nextTick(function () {
        that.loginUser();
      });
      return;
    }

    // ログイン確認
    if(store.state.auth.email!=='') {
      // ログイン済の場合
      store.commit('SET_ISLOADING', true);
      console.log('login 1.')
      that.$nextTick(function () {
        console.log('login 2..')
        if(that.$route.path!=='/schedule') {
          store.commit('SET_BACK_URI', '/schedule');
          that.$router.push({path: '/schedule'});
          return;
        }
      });
    }else{
      console.log('none login', store.state.backuri, '|', that.$route.path);
      // ログイン未だの場合
      that.$nextTick(function () {
        if(that.$route.path!=='/' && that.$route.path!=='') {
          that.$router.push({path: '/'});
          store.commit('SET_ISLOADING', false);
          return;
        }
        store.commit('SET_BACK_URI', '/back');
      });
    }
  },
  created: function () {
    
    // 端末情報を取得
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
    store.commit('SET_USER_AGENT', userAgent);

    // 今日の日付取得
    store.commit('SET_SELECT_DATE', this.$moment().format('YYYY-MM-DD'));

  },
  methods: {
    refreshData() {
      store.commit('SET_IS_SEARCH', false);
      store.commit('SET_ISLOADING', true);
      if(this.$route.path!=='/') this.$router.replace({path: '/'});
      window.location.href = '/';
    },
    drawerOpen() {
      // this.$emit('drawerOpen');
      // store.commit('SET_ISLOADING', true);
    },
    moveClass() {
      if(this.$route.path=='/about') return;

      store.commit('SET_ISLOADING', true);
      this.$router.push({path: '/about'});
    },
    onScroll () {
      this.scrollInvoked++;
    },
    loginUser() {

      const code = this.lineLogin.code;
      const state = this.lineLogin.state;
      var that = this;
      try {
        store.commit('SET_ISLOADING', true);

        const url = this.supersass.baseHost+"/?mode=successLineLogin";
        store.dispatch('getLineUserInfo', {
          params: {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: url,
            client_id: '1655706276',
            client_secret: '7dfe0e67718d9989ba4024a9d1a15eea',
          },
          callback: function(res) {

            store.commit('SET_ISLOADING', true);
            if(!res) {
              console.log('エラー111。', res);
              alert('エラー111。恐れ入りますが、管理者までご連絡をお願いいたしますm(__)m');
              return;
            }

            // LINEアカウント取得
            if(!res.email){
              that.$message({
                type: 'error',
                message: 'LINEのメールアドレス取得に失敗しました！管理者へお問い合わせください。',
              });
              setTimeout(function(){
                store.commit('SET_LINE_LOGIN', '');
                store.commit('SET_ISLOADING', false);
              },1000);
            }else{
              
              // ログインする
              Firebase.signInWithEmailAndPassword(res.email, res.email);
              
              setTimeout(function() {
                // ユーザー情報取得
                store.dispatch('getUsers',function(e){
                  let currentUserStatus = Firebase.auth().currentUser;
                  if(!currentUserStatus) console.log('line no singin');
                  else store.commit('SET_AUTH', currentUserStatus)

                  // メッセージ
                  that.$message({
                    type: 'success',
                    message: 'LINEログイン成功しました！',
                  });

                  setTimeout(function() {
                    store.commit('SET_LINE_LOGIN', '');
                    store.commit('SET_IS_SEARCH', false);
                    store.commit('SET_ISLOADING', false);
                    store.commit('SET_BACK_URI', '/schedule');
                    // that.$router.push({path: '/'});
                    if(that.$route.path!=='/') that.$router.push({path: '/'});
                    window.location.href = '/';
                    // that.$router.push({path: '/schedule'});

                  }, 600);
                  
                });
              }, 800);
            }
            
          }
        });

       } catch(error){
        console.log(error)
      }
    },
    searchStudio() {
      store.commit('SET_ISLOADING', true);
      // const isValid = await this.$refs.observer.validate();
      // if (!isValid) {
      //   // ABORT!!
      //   return;
      // }
      
      // 利用可能時間を検索する
      var that = this;
      that.form = this.search;

      // 時間変換
      switch (that.form.time_zone_name) {
        case '1時間':
          that.form.time_zone='1:00'
          that.form.hour=1
          break;
        case '1.5時間':
          that.form.time_zone='1:30'
          that.form.hour=1.5
          break;
        case '2時間':
          that.form.time_zone='2:00'
          that.form.hour=2
          break;
      }

      // 一般価格
      let _documentName = "個人利用";
      if(that.form.use_type == "グループ") _documentName = "団体利用";
      // let _documentName = "スタジオレンタル（個人利用）";
      // if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";

      // フラメンコ練習
      let is_framenco = true;
      if(that.form.use_name !== "フラメンコ練習") is_framenco = false;
      that.form.is_framenco = is_framenco;

      // 会員の場合且つフラメンコれんしゅうのみ
      // if(that.auth.isLine && is_framenco) {
      if(is_framenco) {
        _documentName = "スタジオレンタル（個人利用）";
        if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";
      }
      that.form.document = _documentName;
      
      // スタジオコード取得
      that.form.resource_id = 794201;
      if(that.form.studio_name == "ナゴスタジオ") that.form.resource_id = 794202;

      // 料金取得
      let price = 0;
      Firebase.db().collection("schedules").doc(_documentName)
      .get().then(function(querySnapshot) {
        if (querySnapshot.exists) {

          let resource = querySnapshot.data()
          that.form.price = resource.resources[that.form.time_zone].price;

          // 決済以外（ポイント精算）
          let credit = store.state.auth.credit;
          if(credit<=that.form.price) that.form.is_stripe = true;
          store.commit('SET_SELECT_SEARCH', that.form);

          // 利用可能時間を取得
          store.dispatch('getFree', {
            params: that.form,
            callback: function(res) {
              store.commit('SET_SELECT_RESOURCES', res);
              if(that.$route.path!=='/schedule') that.$router.push({path: '/schedule'});
              store.commit('SET_ISLOADING', false);
              // 検索閉じる
              that.drawer = false;
            }
          });

        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
     
    },
    // onScroll(e){
    //   if (typeof window === 'undefined') return
    //   const top = window.pageYOffset ||   e.target.scrollTop || 0
    //   // console.log(top)
    //   this.fab = top > 50
    // },
    // toTop() {
    //   this.$vuetify.goTo("#app")
    // },
    close_login_modal: function() {
      this.modal_login_visible = false;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
      // this.activeIndex = this.$route.name;
      this.activeIndex = key;
    },
    logout: function () {
      if(this.auth.email=="") return;
      store.commit('SET_ISLOADING', true);

      // ログアウト処理
      Firebase.logOut();

      // セッション削除
      this.$cookies.remove("arts-auth");

      var that = this;
      // // 初期化
      // store.commit('RESET_DATA');
      setTimeout(function(){
        that.$message({
          message: 'ログアウトしました！',
          type: 'success'
        });
        store.commit('SET_BACK_URI', '/logout');
        that.refreshData();
        // that.$router.replace({path: '/'});
        // store.commit('SET_ISLOADING', false);

      },500);
        
    },
    schedule: function () {
      if(this.$route.path=='/') return;
      this.$router.replace('/')
    },
    openMaster() {
      this.$router.push({path: '/admin'});
    },
    editAccount() {
      // store.commit('SET_ISLOADING', true);
      this.modal_editaccount_visible = true;
    },
    close_modal: function() {
      console.log('close', store.state.backuri, this.$route.path);
      this.modal_editaccount_visible = false;
      store.commit('SET_ISLOADING', false);
    },
    cancel() {
      this.drawer = false;
      store.commit('SET_SELECT_RESOURCES', []);
      store.commit('SET_IS_SEARCH', false);
      store.commit('SET_ISLOADING', false);
    },
    myReserve() {
      // console.log(this.$route.path);
      // LINEログイン後、パス指定されている場合
      let that = this;
      if(this.$route.path == '/schedule'){
        // // 初期化後に、再パス指定
        // setTimeout(function(){
        //   // that.$router.push({path: '/about'});
        // },400);
        return;
      }
      if(store.state.backuri=="") window.location.reload();
      // if(this.$route.path=='/about') return;
      // // 通常パス指定
      // this.$router.push({path: '/about'});
    },
    scrollLogin() {
      let that = this;
      console.log('ログインクリック', that.$route.path);
      // if(that.$route.path!=='/'){
      //   // 別ページからログインをクリックされた場合
      //   store.commit('SET_BACK_URI', '/back');
      //   that.$router.replace({path: '/'});
      //   setTimeout(function(){
      //     store.commit('SET_ISLOADING', false);
      //     that.$vuetify.goTo("#login", { offset: 50 });
      //   },500);
      //   return;
      // }
      // ログインまでスクロール
      this.$vuetify.goTo("#login", { offset: 50 });
    },
    // goSchedule() {
    //   if(this.$route.path=='/schedule') return;
    //   this.$router.push({path: '/schedule'});
    // },
    drawerOpen() {
      this.drawer=true;
    },
    goHomePage() {
      window.location.href = 'https://flamencoarts.okinawa';
    },
    goSchedule() {
      if(this.$route.path!=='/') {
        this.$router.replace('/');
        return;
      }
      this.$vuetify.goTo("#schedule", { offset: 100 });
      this.drawer=false;
    },
    goReception() {
      if(this.$route.path!=='/') {
        this.$router.replace('/');
        return;
      }
      this.$vuetify.goTo("#reception", { offset: 40 });
      this.drawer=false;
    },
    goLogin() {
      if(this.$route.path!=='/') {
        this.$router.replace('/');
        return;
      }
      this.$vuetify.goTo("#login", { offset: 50 });
      this.drawer=false;
    },
    goPrice() {
      if(this.$route.path!=='/') {
        this.$router.replace('/');
        return;
      }
      this.$vuetify.goTo("#price", { offset: 50 });
      this.drawer=false;
    }
  }
};
</script>
