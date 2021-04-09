<template>
  <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="searchStudio()">
    <div class="form-row">
      <div class="col-12 pt-0 pb-0">
        <div class="filed">
          <validation-provider name="予約日" rules="required" v-slot="prop">
            <v-text-field 
              class="pl-1"
              name="予約日" 
              v-model="form.date" 
              label="予約日" 
              :error-messages="prop.errors[0]" 
              single-line>
              <template v-slot:append-outer>
                <date-picker v-model="form.date"/>
              </template>
            </v-text-field>
          </validation-provider>
        </div>
      </div>
      <div class="col-12 pt-0 pb-0"> 
        <div class="filed">
          <validation-provider name="スタジオ" rules="required" v-slot="prop">
            <v-select
              name="スタジオ"
              class="text-left pt-3 pr-1"
              v-model="form.studio_name"
              :items="studio_options"
              label="スタジオ"
              :error-messages="prop.errors[0]"
            ></v-select>
            <span class="sample" :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
          </validation-provider> 
        </div>
      </div>
      <div class="col-12 pt-0 pb-0">
        <div class="filed">
          <validation-provider name="利用時間" rules="required" v-slot="prop">
            <v-select
              name="利用時間"
              class="text-left p-1"
              v-model="form.time_zone_name"
              :items="options"
              label="利用時間"
              :error-messages="prop.errors[0]"
            ></v-select>
          </validation-provider> 
        </div>
      </div>
      <div class="col-12 pt-0 pb-0">
        <div class="filed">
          <validation-provider name="人数タイプ" rules="required" v-slot="prop">
            <v-select
              name="人数タイプ"
              class="text-left p-1"
              v-model="form.use_type"
              :items="type_options"
              label="人数タイプ"
              :error-messages="prop.errors[0]"
            ></v-select>
          </validation-provider> 
        </div>
      </div>
      <div class="col-12 pt-0 pb-0">
        <div class="filed">
          <validation-provider name="利用タイプ" rules="required" v-slot="prop">
            <v-select
              name="利用タイプ"
              class="text-left p-1"
              v-model="form.use_name"
              :items="use_options"
              label="利用タイプ"
              :error-messages="prop.errors[0]"
            ></v-select>
          </validation-provider> 
        </div>
      </div>
      <div class="col-12 pt-2">
        <div class="block">
          <el-button class="m-0" type="secondary" :style="{'width':'100%'}" @click="searchStudio" :disabled="loading" round>
            スタジオ空き時間を検索する
          </el-button>
          <el-button v-if="isSearch" class="m-0 mt-5" type="danger" :style="{'width':'100%'}" @click="cancel" :disabled="loading" round>
            検索を中止する
          </el-button>
        </div>
      </div>
    </div>
  </validation-observer>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import axios from "axios"
  import moment from "moment"

  import DatePicker from "./DatePicker";
  import DateTimePicker from "./DateTimePicker";
  // import StudioResource from "./StudioResource";
  // import FreeTimeFullCalendar from "./FreeTimeFullCalendar";
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VeeValidate, { localize } from'vee-validate'
  import ja from 'vee-validate/dist/locale/ja.json';
  localize('ja',ja);
  Vue.use(localize)

  // import Firebase from 'Firebase'
  // import firebase from "@firebase/app";
  // import { loadStripe } from '@stripe/stripe-js';
  // const stripePromise = loadStripe('pk_live_51I1LTfAXJN6gcxR4hNyT76w1LVnMGtnUEmrLgyURu6JRIg8niYPpCjn5XSmrjY9TSZg83XdZ4jt4iX7F88nOkeaN00kzBXdjQa');

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    DatePicker,
    DateTimePicker,
    // FreeTimeFullCalendar,
    // StudioResource
  },
  props: {
    // isSearch: {
    //   type: Boolean,
    //   default: false,
    // },
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
      // targetDate: '',
      // datetime: '',
      modal_visible: false,
      // item: {},
      // search_visible: false,
      // activeName: '',
      // isSearch: false,
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
  watch: {
    selectDate: function (val) {
      this.form.date = val;
    },
  },
  computed: {
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
    height() {
      return window.screen.height;
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
    selectDate() {
      return moment(store.state.selectDate).format('YYYY-MM-DD');
    },
    isSearch() {
      return store.state.isSearch;
    },
  },
  created: function () {
    // 初期値
    this.form.date = this.$moment().format('YYYY-MM-DD');
    this.form.time = moment().format('07:00');
    // this.form.studio_name = this.search.studio_name;
    store.commit('SET_SELECT_RESOURCES', [])
  },
  mounted() { 
  },
  methods: {
    async searchStudio(){
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
        return;
      }
      store.commit('SET_SELECT_SEARCH', this.form);
      this.$emit('searchStudio');

    },
    close () {
      this.closeModal();
      this.$el.scrollTo(0,0);
    },
    cancel: function () {
      store.commit('SET_ISLOADING', true)
      let that = this;
      setTimeout(function(){
        that.$emit('cancel');
      },500);
      // 
    },
    reload() {
    },
    confirm(item) {
      // console.log('kakui', item)
      this.item = item;
      this.modal_visible=true;
    },
    close_modal(){
      this.modal_visible=false;
    },
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
    // payment() { //カード決済
      
    //   this.modal_visible=false;
    //   store.commit('SET_ISLOADING', true)

    //   var currentUser = Firebase.auth().currentUser;

    //   let that = this;
    //   let _start = moment(that.item.start).format("YYYY-MM-DD HH:mm:ss");
    //   let _finish = moment(_start).add(Number(that.item.hour), 'h').format("YYYY-MM-DD HH:mm:ss");
      
    //   // スタジオコード取得
    //   let _resource_id = 794201;
    //   if(that.item.studioName == "ナゴスタジオ") _resource_id = 794202;

    //   let parms = {
    //     full_name: that.auth.username,
    //     start: _start,
    //     finish: _finish,
    //     resource_id: _resource_id,
    //     price: that.item.price,
    //     email: that.auth.email,
    //     product_name: that.item.use_name+' '+that.item.use_type,
    //   }
    //   console.log('params!', parms);
    //   const processA = async function(documentName) {
    //     const _price_data = {
    //       currency: "jpy",
    //       product_data: {
    //         name: that.item.use_type,
    //       },
    //       unit_amount: that.item.price,
    //     };

    //     // Stripe Checkout
    //     const stripe = await stripePromise;
    //     const response = await firebase.functions().httpsCallable('postStripe');
    //     await response({
    //       // path: '/create-checkout-session-ticket',
    //       method: 'POST',
    //       params: {
    //         price_data: _price_data,
    //         quantity: 1,
    //       },
    //       mode: "payment",
    //       // success_url: "https://localhost:4006/?mode=stripeSuccess",
    //       success_url: "https://vue-authentification-b7a7a.firebaseapp.com/?mode=stripeSuccess",
    //       cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
    //     }).then((res) => {
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
    //     await processA();
    //   }
    //   processAll();

    // },
  }
}
</script>
