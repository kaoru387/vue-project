<template>
  <div id="reservation">
    <v-card 
      outlined
      ref="reservationStudio"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <div class="text-center pt-5 pb-0 text-primary">
        <h4>スタジオ空き時間</h4>
      </div>
      <el-alert
        class="mt-2 mb-1 text-left"
        type="success"
        :description="'ご希望の時間帯をお選びください。'"
        show-icon>
      </el-alert>
      <!-- <div class="d-flex bd-highlight">
        <div class="p-2 flex-fill flex-shrink-1 bd-highlight text-right">
          <span class="p-0 bd-highlight">
            <span class="badge border" :style="{'border-color': '#9DC0AC !important','color':'black','font-weight':'500 !important'}">ナゴスタジオ</span>
          </span>
          <span class="p-0 bd-highlight">
            <span class="badge border" :style="{'border-color': '#F3C857 !important','color':'black','font-weight':'500 !important'}">コザスタジオ</span>
          </span>
        </div>
      </div> -->
      <free-time-full-calendar
        v-if="0<items.length"
        :events="items"
        :initialDate="search.date"
        @confirm="confirm"
        @cancel="cancel" />
      </free-time-full-calendar>
      <div class="text-left p-3 pt-5">
        <div class="text-center">
          <h5>検索条件選択</h5>
        </div>
        <!-- <el-alert
          :closable="false"
          type="warning"
          description="選択を変更して、空き時間の表示内容を変更できます。"
          show-icon>
        </el-alert> -->
        <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="searchStudio()">
          <div class="form-row">
            <div class="col-6 p-2 pt-0 pb-0">
              <div class="filed">
                <validation-provider name="予約日" rules="required" v-slot="prop">
                  <v-text-field 
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
            <div class="col-6 p-2 pt-0 pb-0"> 
              <div class="filed">
                <validation-provider name="スタジオ" rules="required" v-slot="prop">
                  <v-select
                    name="スタジオ"
                    class="text-left pt-3"
                    v-model="form.studio_name"
                    :items="studio_options"
                    label="スタジオ"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                  <span class="sample" :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
                </validation-provider> 
                <!-- <validation-provider name="入室時間" rules="required" v-slot="prop">
                  <v-text-field 
                    name="入室時間" 
                    v-model="form.time" 
                    label="入室時間" 
                    :error-messages="prop.errors[0]" single-line>
                    <template v-slot:append-outer>
                      <date-time-picker v-model="form.time"/>
                    </template>
                  </v-text-field>
                </validation-provider>  -->
              </div>
            </div>
            <div class="col-6 p-2 pt-0 pb-0">
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
            <div class="col-6 p-2 pt-0 pb-0">
              <div class="filed">
                <validation-provider name="利用タイプ" rules="required" v-slot="prop">
                  <v-select
                    name="利用タイプ"
                    class="text-left p-1"
                    v-model="form.use_type"
                    :items="type_options"
                    label="利用タイプ"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                </validation-provider> 
              </div>
            </div>
            <!-- <div class="col-12 p-2 pt-0 pb-0">
              <div class="filed">
                <validation-provider name="スタジオ" rules="required" v-slot="prop">
                  <v-select
                    name="スタジオ"
                    class="text-left p-1"
                    v-model="form.studio_name"
                    :items="studio_options"
                    label="スタジオ"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                  <span class="sample" :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
                </validation-provider> 
              </div>
            </div> -->
            <div class="col-12 p-0 text-center">
              <div class="block mb-3">
                <el-button class="m-0" type="warning" :style="{'width': '100%'}" @click="searchStudio">
                  検索し直す
                </el-button>
              </div>
              <!-- <a class="text-decoration-underline" @click="cancel">
                キャンセル
              </a> -->
            </div>
            <!-- <div class="col-12 p-2 pb-0">
              <div class="block">
                <el-button type="secondary" class="m-0 mt-5 mb-3" :style="{'width': '100%'}" @click="cancel">キャンセル</el-button>
              </div>
            </div> -->
          </div>
        </validation-observer>
        
      </div>
    </v-card>
    <studio-resource
      :item="item"
      :dialog-form-visible="modal_visible"
      :close-modal="close_modal"
      @confirm="confirm"
      @payment="payment">
    </studio-resource>
    <v-container v-show="0<items.length">
      <v-card 
        outlined
        tile
        max-width="360px"
        :style="{'margin':'0 auto'}"
        >
        <!-- <div class="text-center pt-5 pb-2 text-primary">
          <h4 class="mt-3 mb-2" id="capa-content" ref="courseContents">ご予約内容確認</h4>
        </div> 
        <el-alert
          v-if="isShort && auth.isAdmissionFee"
          class="mt-2 mb-4 text-left"
          type="warning"
          :description="'ポイント'+shortPoint +'不足しているため、レンタル料金はカード決済でお支払いとなります。'"
          show-icon>
        </el-alert> -->
     
        
        <!-- <studio-resource
          v-for="(item, index) in items"
          :key="'course-detail-'+index" 
          :item="item"
          @reload="reload" />
        </studio-resource> -->
      </v-card>
    </v-container>
    
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import axios from "axios"
  import moment from "moment"

  import DatePicker from "components/DatePicker";
  import DateTimePicker from "components/DateTimePicker";
  import StudioResource from "components/StudioResource";
  import FreeTimeFullCalendar from "components/FreeTimeFullCalendar";
  
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VeeValidate, { localize } from'vee-validate'
  import ja from 'vee-validate/dist/locale/ja.json';
  localize('ja',ja);
  Vue.use(localize)

  import Firebase from 'Firebase'
  import firebase from "@firebase/app";
  import { loadStripe } from '@stripe/stripe-js';
  const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');


export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    DatePicker,
    DateTimePicker,
    FreeTimeFullCalendar,
    StudioResource
  },
  data() {
    return {
      type_options: ['個人','グループ'],
      options: ['1時間','1.5時間','2時間'],
      studio_options: ['ナゴスタジオ','コザスタジオ'],
      form: {
        date: '',
        time: '',
        use_type: '個人',
        time_zone_name: '1時間',
        time_zone: '',
        hour: 1,
        studio_name: '',
        price: 0,
        is_stripe: false,
      },
      isShort: false,
      shortPoint: 0,
      targetDate: '',
      datetime: '',
      modal_visible: false,
      item: {
        datetime: 'wa'
      }
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
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
  },
  created: function () {
    this.form.date = this.search.date;
    this.form.time = this.search.start;
    this.form.studio_name = this.search.studio_name;

    // this.isSafariLogin = localStorage.getItem('isSafariLogin');
    // 日付初期値
    // this.form.date = this.$moment().format('YYYY-MM-DD');
    // this.$nextTick(function() {
    //   store.commit('SET_ISLOADING', false)
    // });
    store.commit('SET_SELECT_RESOURCES', [])
  },
  mounted() {  
  },
  methods: {
    async searchStudio() {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
        return;
      }

      // 利用可能時間を検索する
      store.commit('SET_ISLOADING', true)
      var element = document.getElementById('capa-content');
      var that = this;
      that.isShort = false;
      that.shortPoint = 0;

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

      let _documentName = "個人利用";
      if(that.form.use_type == "グループ") _documentName = "団体利用"

      // 会員で入会金支払い済の場合
      if(that.auth.username!=='' && that.auth.isAdmissionFee && that.auth.isLine) {
        _documentName = "スタジオレンタル（個人利用）";
        if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";
      }
      that.form.document = _documentName;

      store.commit('SET_SELECT_SEARCH', that.form)
      store.commit('SET_SELECT_RESOURCES', [])

      // 利用可能時間を取得
      store.dispatch('getFree',{
        params: that.form,
        callback: function(res){
          store.commit('SET_SELECT_RESOURCES', res)
          store.commit('SET_ISLOADING', false)
        }
      });
        
    },
    ready: function(){
      // // 選択日付
      // this.year = this.$moment(this.selectDate).format('yyyy');
      // this.month = this.$moment(this.selectDate).format('MM');
      // this.day = this.$moment(this.selectDate).format('DD');
    },
    close () {
      this.closeModal();
      this.$el.scrollTo(0,0);
    },
    onLinkClick() {
      this.close()
      store.commit('SET_SAFARI_LOGIN', true)
      this.$emit('reLoad');
    },
    cancel: function () {
      this.$router.replace('/')
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
    payment() { //カード決済
      
      this.modal_visible=false;
      store.commit('SET_ISLOADING', true)

      var currentUser = Firebase.auth().currentUser;

      let that = this;
      let _start = moment(that.item.start).format("YYYY-MM-DD HH:mm:ss");
      let _finish = moment(_start).add(Number(that.item.hour), 'h').format("YYYY-MM-DD HH:mm:ss");
      
      // // スタジオコード取得
      // let _resource_id = 794201;
      // if(that.search.studio == "ナゴスタジオ") _resource_id = 794202;

      let parms = {
        start: _start,
        finish: _finish,
        // resource_id: _resource_id,
        price: that.item.price,
        email: 'stripe@dummy.com',
      }
      console.log(parms)
      const processA = async function(documentName) {
        const _price_data = {
          currency: "jpy",
          product_data: {
            name: that.item.use_type,
          },
          unit_amount: that.item.price,
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
          // success_url: "https://localhost:4006/?mode=stripeSuccess",
          success_url: "https://kdev.page/?mode=stripeSuccess",
          cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          const session = res.data;
          const sessionId = session.id;
          console.log(sessionId)

          // 一旦保持
          Firebase.db().collection("sessions").doc(parms.email)
          .set({
            sessionId: sessionId,
            params: parms,
            status: 'checkout'
          });

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
  }
}
</script>
