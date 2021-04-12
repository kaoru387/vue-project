<template>
  <div class="row align-items-center g-bg-white">
    <el-page-header v-if="isSearch" @back="drawerOpen" content="空き時間検索" title="スタジオ予約" class="p-3 pb-2"></el-page-header>
    <!-- <div class="col-md-12 d-flex justify-content-center">
      <div class="mb-0">
        あなたのポイント：<span class="g-color-primary g-font-weight-500 g-font-size-20 mr-2">{{ auth.credit.toLocaleString() }}</span>
      </div>
    </div> -->
    <!-- <div class="col-md-12 g-pl-20 g-mb-5 g-mb-0--md p-0 d-flex justify-content-center"> -->
    <div class="col-md-12 g-mb-10 g-mb-0--md p-2 pt-0" :style="{'min-height':adjust+100+'px', 'width': '100%'}">
      <!-- Product Info -->
      <v-tabs
        v-if="!isSearch"
        v-model="tab"
        centered
      >
        <v-tabs-slider></v-tabs-slider>
        <v-tab href="#tab-1"" class="pl-3 pr-3">
          <figure class="text-center m-0" :style="{'line-height':'17px'}">
            <p class="g-font-size-11">全体</p>                        
            <span class="g-color-gray-dark-v3 g-font-weight-500">
              スケジュール
            </span>
          </figure>
        </v-tab>
        <v-tab href="#tab-2" class="pl-3 pr-3">
          <figure class="text-center m-0" :style="{'line-height':'17px'}">
            <p class="g-font-size-11">あなたの</p>
            <!-- <span class="g-color-gray-dark-v3 g-font-weight-500">スタジオ予約</span> -->
            <span class="d-inline-block g-pos-rel">
              <span v-if="0<countMyStudio" class="u-badge-v2 g-font-size-10 g-bg-deeporange g-color-white">
                {{ countMyStudio }}
              </span>
              <span class="g-color-gray-dark-v3 g-font-weight-500 pr-1">
                スタジオ予約
              </span>
            </span>
          </figure>
        </v-tab>
        <v-tab href="#tab-3" class="pl-3 pr-3">
          <figure class="text-center m-0" :style="{'line-height':'17px'}">
            <p class="g-font-size-11">あなたの</p>
            <!-- <span class="g-color-gray-dark-v3 g-font-weight-500">クラス予約</span> -->
            <span class="d-inline-block g-pos-rel">
              <span v-if="0<countMyClass" class="u-badge-v2 g-font-size-10 g-bg-yellow g-color-white">
                {{ countMyClass }}
              </span>
              <span class="g-color-gray-dark-v3 g-font-weight-500 pr-1">
                クラス予約
              </span>
            </span>
          </figure>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-if="!isSearch" v-model="tab">
        <v-tab-item :value="'tab-1'">
          <v-card flat>
            <full-calendar ref="calendar" 
              v-if="!isSearch"
              :events="events"
              :view-name="'dayGridMonth'">      
            </full-calendar>
            <!-- <div class="p-3 pt-0">
              <el-alert
                v-if="isSearch && items.length==0"
                class="text-left"
                type="error"
                description="予約可能な空き時間はありません。"
                show-icon>
              </el-alert>
            </div> -->
            <!-- <my-full-calendar ref="calendar" 
          v-if="contens.length"
            :events="contens"
            :view-name="'dayGridMonth'"
            @close="cancel">
        </my-full-calendar> -->
          </v-card>
        </v-tab-item>
        <v-tab-item :value="'tab-2'">
          <div v-if="contens.length==0" class="p-0">
            <el-alert
              class="text-left"
              type="warning"
              description="あなたのスタジオ予約はありません。"
              show-icon>
            </el-alert>
          </div>
          <div v-else class="p-0 ml-2 mr-2">
            <my-reservation />
          </div>
          <!-- <div v-if="0<classes.length" class="p-0">
            <my-class
              v-for="(item, index) in classes"
              :key="'class-detail'+item.id" 
              :item="item" />
          </div> -->
        </v-tab-item>
        <v-tab-item :value="'tab-3'">
          <div v-if="classes.length==0" class="p-0">
            <el-alert
              class="text-left"
              type="warning"
              description="あなたのクラス予約はありません。"
              show-icon>
            </el-alert>
          </div>
          <div v-else class="p-0 ml-2 mr-2">
            <my-class />
          </div>
          
        </v-tab-item>
      </v-tabs-items>

      <!-- 利用可能時間 -->
      <free-time-full-calendar
        v-if="isSearch && 0<items.length"
        :events="items"
        :initialDate="search.date"
        @confirm="confirm"
        @cancel="cancel" />
      </free-time-full-calendar>

      <div v-if="isSearch" class="col-12 pt-5">
        <div class="block">
          <el-button class="m-0" type="danger" :style="{'width':'100%'}" @click="cancel" round>
            検索を中止する
          </el-button>
        </div>
      </div>
    </div>

    <!-- <studio-resource
      :item="item"
      :dialog-form-visible="modal_visible"
      :close-modal="close_modal"
      @confirm="confirm"
      @payment="payment"
      @paypay="paypay"> -->
    <studio-resource
      ref="studio_resource" 
      :dialog-form-visible="modal_visible"
      :close-modal="close_modal"
      @confirmPay="confirmPay"
      @payment="payment">
    </studio-resource>

    <!-- 予約・支払い実行の確認 -->
    <v-dialog
      v-model="dialog"
      append-to-body
      max-width="290"
      class="pb-2"
    >
      <v-card>
        <v-card-title class="headline">{{ confirm_name }}の確認</v-card-title>

        <div class="text-center">
          <v-list-item-title class="headline mb-2 g-color-primary">
            ¥ {{ item.price+item.amount }}
          </v-list-item-title>
        </div>

        <v-card-text>
          予約・{{ confirm_name }}を実行してよろしいですか？
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
            はい
          </v-btn>
          <v-btn
            v-if="confirm_name=='PayPay決済'"
            color="green darken-1"
            outlined
            @click="paypay"
          >
            はい
          </v-btn>
          <v-btn
            v-if="confirm_name=='ポイント精算'"
            color="green darken-1"
            outlined
            @click="payoff"
          >
            はい
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
  import MyReservation from '../components/MyReservation';
  // import MyReservationHistory from '../components/MyReservationHistory';
  import MyClass from '../components/MyClass';

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
    SearchStudio,
    MyReservation,
    // MyReservationHistory,
    MyClass
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
        use_name: 'フラメンコ練習',
        is_option: false,
      },
      // isShort: false,
      // shortPoint: 0,
      targetDate: '',
      datetime: '',
      modal_visible: false,
      item: [],
      search_visible: false,
      activeName: '',
      // isSearch: false,
      // drawer: false,
      dialog: false,
      confirm_name: '',
      message: 'You loaded this page on ' + new Date().toLocaleString(),
      // isTimeout: false,
      tab: null,
      // scrollInvoked: 0,
      // dialogDetail: false,
    }
  },
  watch: {
    // 'isSearch': function (val) {
    //   // 検索中の場合、タブ3を表示
    //   if(!val) return;
    //   let that = this;
    //   setTimeout(function(){
    //     that.tab = 'tab-3';
    //   },500);
    // },
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
  computed: {
    // textState: function (e) {
    //   if (this.count <= 150) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
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
    contens() {
      return store.state.result.my;
    },
    history() {
      return store.state.result.history;
    },
    classes() {
      return store.state.result.myClass;
    },
    countMyClass() {
      return store.state.info.countMyClass;
    },
    countMyStudio() {
      return store.state.info.countMyStudio;
    },
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter /sche', to.fullPath, store.state.backuri);
    if(to.fullPath=='/schedule') {
      store.commit('SET_LINE_LOGIN', '');
      setTimeout(function(){
          store.commit('SET_ISLOADING', false);
      }, 4000);
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

    // // 日付取得
    // let _date = this.$moment().format('YYYY-MM-DD');
    // // クラス受付を取得
    // let that = this;
    // store.dispatch('getAgenda',{
    //   params: {
    //     from_date: _date,
    //     time: '09:00',
    //     resource_id: 563549,
    //     user_id: that.auth.user_id
    //   },
    //   callback: function(res){
    //     console.log('hi', res)
    //     // that.items=res.data.slots;
    //   }
    // });

  },
  mounted() {
    // var that = this;
    // setTimeout(function(){
    // //   // that.$message({
    // //   //   type: 'warning',
    // //   //   message: '空き時間を検索して、予約時間を選択し予約してください。',
    // //   // });
    // //   store.commit('SET_ISLOADING', false);
    // },500);
  },
  methods: {
    drawerOpen() {
      this.$emit('drawerOpen');
    },
    backHome() {
      store.commit('SET_BACK_URI', '/back');
      this.$router.replace('/');
    },
    confirm(item) {
      this.$refs.studio_resource.setItem(item);
      this.modal_visible=true;
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
          // console.log('free doc', that.form.price);

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
      console.log(item)
    },
    payment() { //カード決済
      store.commit('SET_ISLOADING', true)
      
      let url = this.supersass.baseHost;
      // let url = 'https://localhost:4006';
      let that = this;
 
      // スタジオコード取得
      let _resource_id = 794201;
      if(that.item.studioName == "ナゴスタジオ") _resource_id = 794202;

      let params = {
        full_name: that.auth.username,
        start: that.item.start_datetime,
        finish: that.item.finish_datetime,
        resource_id: _resource_id,
        price: that.item.price,
        email: that.auth.email,
        product_name: that.item.product_name,
        description: "カード決済",
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

          params.session_id=sessionId;
          params.session_data=session;

          store.commit('STRIPE_SESSION', params);

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
    paypay() {  // PayPay決済
      console.log('paypay', this.item);

      store.commit('SET_ISLOADING', true);

      let url = this.supersass.baseHost;
      // let url = 'https://localhost:4006';
      let that = this;

      // スタジオコード取得
      let _resource_id = 794201;
      if(that.item.studioName == "ナゴスタジオ") _resource_id = 794202;

      // let params = {
      //   user_id: that.auth.user_id,
      //   full_name: that.auth.username,
      //   start: that.item.start_datetime,
      //   finish: that.item.finish_datetime,
      //   resource_id: _resource_id,
      //   price: that.item.price,
      //   email: that.auth.email,
      //   product_name: that.item.product_name,
      //   amount: that.item.amount,
      //   description: "PayPay決済",
      // };
      let params = {
        'schedule_id': that.supersass.resourceId,
        'user_id': that.auth.user_id,
        'booking[full_name]': that.auth.username,
        'booking[email]': that.auth.email,
        'booking[start]': that.item.start_datetime,
        'booking[finish]':that.item.finish_datetime,
        'booking[resource_id]': _resource_id,
        'booking[field_1]': that.item.price,
        'booking[field_2]': that.item.product_name,
        'booking[phone]':that.item.amount,
        'booking[description]': "PayPay決済",
        'booking[super_field]': '',
      };

      store.dispatch('getPayPay', {
        params: {
          merchantPaymentId: '',
          amount: {
            amount: that.item.price+that.item.amount,
            currency: "JPY"
          },
          codeType: "ORDER_QR",
          orderDescription: that.item.product_name,
          description: that.item.product_name,
          isAuthorization: false,
          redirectUrl: url+"/?mode=successPayPay",
          redirectType: "WEB_LINK",
        },
        callback: function(res){
          console.log(res)

          // 閉じる
          that.modal_visible = false;

          // 支払ID取得
          let session = {
            merchantPaymentId: res.merchantPaymentId,
            codeId: res.codeId,
            params: params
          };
          store.commit('PAYPAY_SESSION', session);
          window.location.href = res.url;

          // that.$confirm('<strong class="text-left">PayPay支払を開始してよろしいですか？</strong>', 'PayPayで支払う', {
          //     dangerouslyUseHTMLString: true,
          //     confirmButtonText: 'OK',
          //     type: 'info',
          //     center: true,
          //   }).then(() => {
          //     console.log(res)

          //     // 一旦保持
          //     Firebase.db().collection("paypay").doc(session_timestamp)
          //     .set({
          //       merchantPaymentId: res.merchantPaymentId,
          //       codeId: res.codeId,
          //       form: that.form,
          //       status: 'create'
          //     });
          //     window.open(res.url, '_blank');
          //     store.commit('SET_ISLOADING', false);
          //   }).catch(() => {
          // });
          
        }
      });

    },
    payoff() { // ポイント精算
      store.commit('SET_ISLOADING', true);
      
      let that = this;
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
      let params = {
        full_name: that.auth.username,
        start: that.item.start_datetime,
        finish: that.item.finish_datetime,
        resource_id: _resource_id,
        price: that.item.price,
        email: that.auth.email,
        product_name: that.item.product_name,
        amount: that.item.amount,
        description: 'ポイント精算',
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
              params: params,
              callback: function(res2){
                // ポイント更新
                store.commit('UPDATE_USER_CREDIT', credit);
                // that.isPoint=true;
                // if(credit<that.item.price) that.isPoint=false;
                
                // データ取得
                setTimeout(function() {

                  that.$message({
                    type: 'success',
                    message: '予約・ポイント精算を完了しました。',
                  });

                  that.dialog=false;

                  // データ再取得
                  store.dispatch('getUsers', 
                    function(e){

                      // 初期化
                      store.commit('RESET_DATA');
                      // 予約取得
                      store.dispatch('getBookings',{
                        callback: function(res){
                          // 自身の予約
                          store.dispatch('getAgenda',{
                            params: {
                              from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                              user_id: that.auth.user_id,
                              resource_id: params.resource_id,
                            },
                            callback: function(res3) {
                              // 検索終了
                              store.commit('SET_IS_SEARCH', false);
                              store.commit('SET_ISLOADING', false);
                            }
                          });
                        }
                      });
                      
                  });

                }, 1000);
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
  }
}
</script>
