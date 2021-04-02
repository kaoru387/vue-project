<template>
  <div class="d-flex justify-content-center">
    <v-container class="fill-height g-bg-gray-light-v5 p-0 g-pt-10">
      <!-- <v-app> -->
        <!-- <el-page-header v-if="isSearch" @back="drawer = !drawer" content="検索結果" title="再検索" class="m-2">
        </el-page-header> -->
        <!-- <div v-if="auth.email!=='' && !isSearch" >
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-app-bar-nav-icon 
                v-bind="attrs"
                v-on="on"
                @click.stop="drawer = !drawer" class="float-left m-1 mr-4"></v-app-bar-nav-icon>
            </template>
            <span>空き時間検索</span>
          </v-tooltip>
          <span class="d-block g-color-text g-font-weight-200 g-py-5 g-px-10 mt-1" href="#">← 空き時間を検索する</span>
          <el-alert
            class="text-left m-1"
            type="warning"
            description="スタジオ空き時間を検索して、予約時間を選択し予約してください。"
            show-icon>
          </el-alert>
        </div> -->

        <!-- <div class="block">
          <v-app-bar-nav-icon v-if="auth.email!=='' && !isSearch" @click.stop="drawer = !drawer" class="float-left m-1 mr-2"></v-app-bar-nav-icon><span class="d-block g-color-text g-font-weight-300 g-py-5 g-px-10 mt-1" href="#">空き時間を検索</span>
        </div> -->
        <!-- <el-page-header v-if="auth.email==''" @back="backHome" content="予約スケジュール" title="戻る" class="m-2">
        </el-page-header> -->
        <div class="container">
          <div class="row align-items-center g-bg-white g-py-10">
            <div v-if="auth.email!=='' && !isSearch" @click="drawerOpen" class="p-4 pt-2 pb-3">
              <el-alert
                class="text-left"
                type="warning"
                description="空き時間を検索して、予約時間を選択し予約してください。"
                show-icon>
              </el-alert>
            </div>
            <div class="col-md-12 g-pl-20 g-mb-5 g-mb-0--md p-0 d-flex justify-content-center">

              <!-- Product Info -->
              <div @click="drawerOpen">
                <div v-if="!isSearch" class="media">
                  <div class="d-flex align-self-center mr-3">
                    <span class="u-icon-v2 g-color-primary g-bg-secondary rounded-circle">
                      <i class="fa fa-group u-line-icon-pro"></i>
                    </span>
                  </div>
                  <div class="media-body align-self-center">
                    <h3 class="h5 g-color-black mb-0">スタジオ予約</h3>
                    <span class="d-block g-color-gray-dark-v5">全体予約スケジュール</span>
                  </div>
                </div>
                <div v-else class="d-flex justify-content-center">
                  <div class="media">
                    <div class="d-flex align-self-center mr-3">
                      <span class="u-icon-v2 g-color-white g-bg-primary rounded-circle">
                        <i class="icon-education-141 u-line-icon-pro"></i>
                      </span>
                    </div>
                  </div>
                  <div class="media-body align-self-center">
                    <h3 class="h5 g-color-black mb-0">検索結果</h3>
                    <span class="d-block g-color-gray-dark-v5">スタジオ空き時間</span>
                  </div>
                </div>
              </div>

              <!-- Accordion -->
              <!-- <div id="accordion-01" role="tablist" aria-multiselectable="true">
                <div id="accordion-01-heading-01" class="g-brd-y g-brd-gray-light-v3 py-3" role="tab">
                  <h5 class="g-font-weight-400 g-font-size-default mb-0">
                    <a class="d-block g-color-gray-dark-v5 g-text-underline--none--hover" href="#accordion-01-body-01" data-toggle="collapse" data-parent="#accordion-01" aria-expanded="false" aria-controls="accordion-01-body-01">スタジオ予約する
                      <span class="float-right g-pos-rel g-top-3 mr-1 fa fa-angle-down"></span></a>
                  </h5>
                </div>
                <div id="accordion-01-body-01" class="collapse" role="tabpanel" aria-labelledby="accordion-01-heading-01">
                  <div class="g-py-10">
                    <search-studio
                      :is-search="isSearch"
                      @searchStudio="searchStudio" />
                  </div>
                </div>
              </div> -->
              <!-- End Accordion -->

              <!-- Buttons -->
              <!-- <div class="text-center">
                <button class="btn u-btn-primary g-font-size-12 text-uppercase g-py-12 g-px-25" type="button">
                  Add to Cart <i class="align-middle ml-2 icon-finance-100 u-line-icon-pro"></i>
                </button>
              </div> -->
              <!-- <div class="d-flex bd-highlight justify-content-center pt-2 pb-2" v-loading="loading">
                <span class="p-0 bd-highlight pr-2">
                  <el-button :style="{'background-color':'#3bb18f', 'border-color':'#3bb18f', 'color':'white'}" @click="searchStudioNago">
                    + 名護スタジオ予約
                  </el-button>
                </span>
                <span class="p-0 bd-highlight">
                  <el-button :style="{'background-color':'#FFA611', 'border-color':'#FFA611', 'color':'white'}" @click="searchStudioKoza">
                      + コザスタジオ予約
                  </el-button>
                </span>
              </div> -->
              <!-- End Buttons -->
            </div>
            <!-- <div v-else class="col-md-4 g-mb-5 g-mb-0--md">
              <el-alert
                class="text-left"
                type="warning"
                description="ログインしてください。"
                show-icon>
              </el-alert>
            </div> -->

            <div class="col-md-12 p-0">
              <!-- <div v-if="auth.email!=''" class="text-center">
                <div class="mb-2">
                  あなたのポイント：<span class="g-color-primary g-font-weight-300 g-font-size-20 mr-2">{{ auth.credit.toLocaleString() }}</span>
                </div>
              </div> -->
              <full-calendar ref="calendar" 
                v-if="!isSearch"
                :events="events"
                :view-name="'dayGridMonth'">      
              </full-calendar>
              <div class="p-3 pt-5">
                <el-alert
                  v-if="isSearch && items.length==0"
                  class="text-left"
                  type="error"
                  description="予約可能な空き時間はありません。"
                  show-icon>
                </el-alert>
              </div>
              <free-time-full-calendar
                v-if="isSearch && 0<items.length"
                :events="items"
                :initialDate="search.date"
                @confirm="confirm"
                @cancel="cancel" />
              </free-time-full-calendar>
            </div>
            
            <!-- <div v-if="!isSearch" class="col-12 pt-5">
              <div class="block">
                <el-button class="m-0" type="warning" :style="{'width':'100%'}" @click="searchStudio">
                  スタジオ空き時間を検索する
                </el-button>
              </div>
            </div> -->
            <div v-if="isSearch" class="col-12 pt-5">
              <div class="block">
                <el-button class="m-0" type="secondary" :style="{'width':'100%'}" @click="cancel">
                  検索を中止する
                </el-button>
              </div>
            </div>
          </div>
        </div>
      <!-- </div> -->
      <!-- End Promo Slider -->


      <!-- </v-app> -->
    </v-container>
    <!-- <studio-resource
      :item="item"
      :dialog-form-visible="modal_visible"
      :close-modal="close_modal"
      @confirm="confirm"
      @payment="payment"
      @paypay="paypay"> -->
    <studio-resource
      :item="item"
      :dialog-form-visible="modal_visible"
      :close-modal="close_modal"
      @confirmPay="confirmPay"
      @payment="payment">
    </studio-resource>


    <v-dialog
      v-model="dialog"
      append-to-body
      max-width="290"
    >
    <v-card>
      <v-card-title class="headline">{{ confirm_name }}の確認</v-card-title>

      <v-card-text>
        本当に支払い・予約の処理を開始してもよろしいですか？
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          outlined
          text
          @click="dialog = false"
        >
          キャンセル
        </v-btn>
        <v-btn
          v-if="confirm_name=='カード決済'"
          color="green darken-1"
          outlined
          @click="payment"
        >
          カード決済する
        </v-btn>
        <v-btn
          v-else
          color="green darken-1"
          outlined
          @click="payoff"
        >
          ポイント精算する
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import axios from "axios"
  import moment from "moment"

  // import DatePicker from "components/DatePicker";
  // import DateTimePicker from "components/DateTimePicker";
  import StudioResource from "../components/StudioResource";
  import FullCalendar from '../components/FullCalendar.vue'
  import FreeTimeFullCalendar from "../components/FreeTimeFullCalendar";
  import SearchStudio from '../components/SearchStudio';
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VeeValidate, { localize } from'vee-validate'
  import ja from 'vee-validate/dist/locale/ja.json';
  localize('ja',ja);
  Vue.use(localize)

  import Firebase from 'Firebase'
  import firebase from "@firebase/app";
  import { loadStripe } from '@stripe/stripe-js';
  const stripePromise = loadStripe('pk_live_51I1LTfAXJN6gcxR4hNyT76w1LVnMGtnUEmrLgyURu6JRIg8niYPpCjn5XSmrjY9TSZg83XdZ4jt4iX7F88nOkeaN00kzBXdjQa');

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    // DatePicker,
    // DateTimePicker,
    FullCalendar,
    FreeTimeFullCalendar,
    StudioResource,
    SearchStudio
  },
  data() {
    return {
      type_options: ['個人','グループ'],
      options: ['1時間','1.5時間','2時間'],
      studio_options: ['ナゴスタジオ','コザスタジオ'],
      use_options: ['フラメンコ練習', 'その他の利用'],
      form: {
        // full_name: '',
        // email: '',
        // start: '',
        // finish: '',
        resource_id: '',
        price: 0,
        date: '',
        time: '',
        use_type: '個人',
        time_zone_name: '1時間',
        time_zone: '',
        hour: 1,
        studio_name: 'ナゴスタジオ',
        is_stripe: false,
        is_framenco: 1,
        use_name: 'フラメンコ練習'
      },
      // isShort: false,
      // shortPoint: 0,
      targetDate: '',
      datetime: '',
      modal_visible: false,
      item: {},
      search_visible: false,
      activeName: '',
      // isSearch: false,
      // drawer: false,
      dialog: false,
      confirm_name: '',
      message: 'You loaded this page on ' + new Date().toLocaleString()
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
  computed: {
    textState: function (e) {
      if (this.count <= 150) {
        return true;
      } else {
        return false;
      }
    },
    count: function () {
      return 2;
      // return this.$store.state.TweetDialog.message.length;
    },
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
    items() {
      return store.state.result.resources;
    },
    search() {
      return store.state.search;
    },
    events() {
      return store.state.result.events;
    },
    isSearch() {
      return store.state.isSearch;
    },
    
    // height() {
    //   return window.screen.height;
    // },
    adjust () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 220
        case 'sm': return 400
        case 'md': return 500
        case 'lg': return 600
        case 'xl': return 800
      }
    },
    supersass() {
      return store.state.auth.supersass;
    },
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter /sche', to.fullPath, store.state.backuri);
    if(to.fullPath=='/schedule') {
      store.commit('SET_LINE_LOGIN', '');
      next();
    }

    // let that = this;
    // next(vm => {
    //   if(store.state.backuri=='/?mode=stripeCancel') {
    //     that.$message({
    //       type: 'error',
    //       message: 'カード決済をキャンセルしました。',
    //     });
    //     store.commit('SET_BACK_URI', '');
    //   }
    // })

  },
  created: function () {
    // this.form.date = this.search.date;
    // this.form.time = this.search.start;
    // this.form.studio_name = this.search.studio_name;

    // this.$message({
    //   type: 'success',
    //   message: 'スタジオの空き時間を検索しています。検索結果よりご希望の時間をお選びください。',
    //   duration: 3000
    // });

    // this.isSafariLogin = localStorage.getItem('isSafariLogin');
    // 日付初期値
    // this.form.date = this.$moment().format('YYYY-MM-DD');
    // this.$nextTick(function() {
    //   store.commit('SET_ISLOADING', false)
    // });
    // store.commit('SET_SELECT_RESOURCES', [])
  },
  mounted() {
    var that = this;
    setTimeout(function(){
      // that.$message({
      //   type: 'warning',
      //   message: '空き時間を検索して、予約時間を選択し予約してください。',
      // });
      store.commit('SET_ISLOADING', false);
    },500);
  },
  methods: {
    drawerOpen() {
      this.$emit('drawerOpen');
    },
    searchStudio() {
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
            console.log('free doc', that.form.price);

            // 決済以外（ポイント精算）
            let credit = store.state.auth.credit;
            if(credit<=that.form.price) that.form.is_stripe = true;
            store.commit('SET_SELECT_SEARCH', that.form);

            // 利用可能時間を取得
            store.dispatch('getFree', {
              params: that.form,
              callback: function(res) {
                // store.commit('SET_SELECT_RESOURCES', res);
                // that.isSearch = true;
                // store.commit('SET_IS_SEARCH', true);
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
    // ready: function(){
    //   // // 選択日付
    //   // this.year = this.$moment(this.selectDate).format('yyyy');
    //   // this.month = this.$moment(this.selectDate).format('MM');
    //   // this.day = this.$moment(this.selectDate).format('DD');
    // },
    // close () {
    //   this.closeModal();
    //   this.$el.scrollTo(0,0);
    // },
    // onLinkClick() {
    //   this.close()
    //   store.commit('SET_SAFARI_LOGIN', true)
    //   this.$emit('reLoad');
    // },
    cancel: function () {
      store.commit('SET_ISLOADING', true)
      store.commit('SET_IS_SEARCH', false);
      // this.isSearch = false;
      // this.drawer = false;
      let that = this;
      setTimeout(function(){
        store.commit('SET_SELECT_RESOURCES', []);
        store.commit('SET_ISLOADING', false);
      },500);
    },
    close_modal(){
      this.modal_visible=false;
      // this.$emit('reLoad');
    },
    confirmPay(confirm_name, item) { //支払い・予約の確認
      this.confirm_name = confirm_name;
      this.modal_visible=false;
      this.dialog=true;
      this.item = item;
      // console.log(item)
    },
    payment() { //カード決済

      store.commit('SET_ISLOADING', true)
      
      // var currentUser = Firebase.auth().currentUser;
      let url = this.supersass.baseHost;
      // let url = 'https://localhost:4006';
      // alert(url);

      let that = this;
      // let _start = moment(item.start).format("YYYY-MM-DD HH:mm:ss");
      // let _finish = moment(_start).add(Number(item.hour), 'h').format("YYYY-MM-DD HH:mm:ss");
      
      // スタジオコード取得
      let _resource_id = 794201;
      if(that.item.studioName == "ナゴスタジオ") _resource_id = 794202;

      let parms = {
        full_name: that.auth.username,
        start: that.item.start_datetime,
        finish: that.item.finish_datetime,
        resource_id: _resource_id,
        price: that.item.price,
        email: that.auth.email,
        product_name: that.item.product_name,
        super_field: " card"
      }

      const processA = async function(documentName) {
        const _price_data = {
          currency: "jpy",
          product_data: {
            name: that.search.use_type,
          },
          unit_amount: that.search.price,
        };

        // Stripe Checkout
        const stripe = await stripePromise;
        const response = await firebase.functions().httpsCallable('postStripe');
        await response({
          // path: '/create-checkout-session-ticket',
          method: 'POST',
          params: {
            price_data: _price_data,
            quantity: 1,
          },
          mode: "payment",
          success_url: url+"/?mode=stripeSuccess",
          cancel_url: url+"/?mode=stripeCancel",
        }).then((res) => {
          const session = res.data;
          const sessionId = session.id;

          parms.session_id=sessionId;
          parms.session_data=session;

          // // 一旦保持
          // Firebase.db().collection("sessions").doc(parms.email)
          // .set({
          //   sessionId: sessionId,
          //   params: parms,
          //   status: 'checkout'
          // });
          
          store.commit('STRIPE_SESSION', parms);

          const result = stripe.redirectToCheckout({
            sessionId: sessionId,
          });
          if (result.error) {
            console.log(result.error.message);
          }
        });
      }
      const processAll = async function() {
        await processA();
      }
      processAll();
    },
    payoff() { // ポイント精算

      store.commit('SET_ISLOADING', true);
      
      let that = this;
      // console.log('pay', this.auth, that.item);

      // this.$confirm('<strong class="text-left">レンタル料金をポイント精算してもよろしいですか？？</strong>', 'ポイント精算の確認', {
      //     dangerouslyUseHTMLString: true,
      //     confirmButtonText: 'OK',
      //     type: 'info',
      //     center: true,
      //   }).then(() => {
          // store.commit('SET_ISLOADING', true);

          // var currentUser = Firebase.auth().currentUser;
      if(that.auth.email=='') {
        alert('ポイント精算エラー');
        return;
      }

      // スタジオコード取得
      let _resource_id = 794201;
      if(that.item.studioName == "ナゴスタジオ") _resource_id = 794202;

      // let parms = {
      //   full_name: that.auth.username,
      //   start: that.item.start_datetime,
      //   finish: that.item.finish_datetime,
      //   resource_id: _resource_id,
      //   price: that.item.price,
      //   email: that.auth.email,
      //   product_name: that.item.use_name+' '+that.item.use_type,
      // };
      let parms = {
        full_name: that.auth.username,
        start: that.item.start_datetime,
        finish: that.item.finish_datetime,
        resource_id: _resource_id,
        price: that.item.price,
        email: that.auth.email,
        product_name: that.item.product_name,
      }

      let credit = that.auth.credit;
      credit = that.auth.credit - that.item.price;
      const supersass = async function() {
        await store.dispatch('saveUser',{
          params: {
            credit: credit,
          },
          callback: function(res){
            console.log('save', res);

            // 予約
            store.dispatch('addAppointment', {
              params: parms,
              callback: function(res2){
                // ポイント更新
                store.commit('UPDATE_USER_CREDIT', credit);
                that.isPoint=true;
                if(credit<that.item.price) that.isPoint=false;

                
                // データ取得
                setTimeout(function() {

                  that.$message({
                    type: 'success',
                    message: 'ポイント精算・予約に成功しました。',
                  });

                  // データ再取得
                  store.dispatch('getUsers', 
                    function(e){
                      store.commit('SET_EVENTS', []);
                      // 予約取得
                      store.dispatch('getBookings',{
                        callback: function(res){
                          if(res) store.commit('SET_ISLOADING', false);
                          that.$router.push({path: '/about'});
                        }
                      });
                  });

                  // // 予約
                  // store.commit('SET_EVENTS', []);
                  // store.dispatch('getBookings', {
                  //   callback: function(res){
                  //     store.dispatch('getUsers',function(e) {
                  //       // store.commit('SET_AUTH', currentUser);
                  //       if(that.$route.path!=='/') that.$router.push({path: '/'});
                  //       that.$router.push({path: '/schedule'});
                  //       // that.closeModal();
                  //       that.dialog=false;
                  //       store.commit('SET_ISLOADING', false);
                  //     });
                  //   }
                  // });

                  // // 自身の予約
                  // store.dispatch('getUserAgenda',{
                  //   params: {
                  //     from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                  //     user_email: that.auth.email
                  //   },
                  // });
                }, 2000);
              }
            });

          }
        });
      }
      const all = async function() {
        await supersass()
      }
      all();
      // }).catch(() => {
      // });
    },
    backHome() {
      store.commit('SET_BACK_URI', '/back');
      this.$router.replace('/');
    },
    confirm(item) {
      // console.log('confirm', item)
      this.item = item;
      this.modal_visible=true;
    },
    // searchStudio(val) {
    //   this.isSearch = val;
    //   store.commit('SET_ISLOADING', false);
    // },
    // paypay(item) {
    //   console.log(item, this.search);
    //   this.modal_visible = false;
    //   store.commit('SET_ISLOADING', true);

    //   let that = this;
    //   // 選択条件
    //   that.form.start = item.start_datetime;
    //   that.form.finish = item.finish_datetime;
    //   that.form.price = item.price;
    //   that.form.email = that.auth.email;
    //   that.form.full_name = that.auth.username;
    //   that.form.product_name = item.product_name;
    //   that.form.super_field = '';
    //   if(that.auth.username=='') that.form.full_name = '一般';
    //   let session_timestamp = moment().format("YYYYMMDDHH");
    //   console.log(session_timestamp);
      
    //   store.dispatch('getPayPay', {
    //     params: {
    //       merchantPaymentId: '',
    //       amount: {
    //         amount: that.form.price,
    //         currency: "JPY"
    //       },
    //       codeType: "ORDER_QR",
    //       orderDescription: that.form.product_name,
    //       isAuthorization: false,
    //       redirectUrl: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=successPayPay",
    //       redirectType: "WEB_LINK",
    //     },
    //     callback: function(res){
    //       // 支払ID取得
    //       // that.form.merchantPaymentId = res.merchantPaymentId;
    //       // that.form.codeId = res.codeId;
    //       // store.commit('SET_FORM', that.form);
    //       that.$confirm('<strong class="text-left">PayPay支払を開始してよろしいですか？</strong>', 'PayPayで支払う', {
    //           dangerouslyUseHTMLString: true,
    //           confirmButtonText: 'OK',
    //           type: 'info',
    //           center: true,
    //         }).then(() => {
    //           console.log(res)

    //           // 一旦保持
    //           Firebase.db().collection("paypay").doc(session_timestamp)
    //           .set({
    //             merchantPaymentId: res.merchantPaymentId,
    //             codeId: res.codeId,
    //             form: that.form,
    //             status: 'create'
    //           });
    //           window.open(res.url, '_blank');
    //           store.commit('SET_ISLOADING', false);
    //         }).catch(() => {
    //       });
          
    //     }
    //   });
    // },
  }
}
</script>
