<template>
  <el-dialog
    title="支払内容の確認"
    custom-class="dialog_category"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
    :loading="loading"
    width="98%"
    :style = "{'max-width':'375px','margin': '20px auto'}"
    center
  >
    <div class="text-center mb-1">
      <span class="font-weight-medium " :style="{'font-size':'20px'}">{{ targetDate + ' ' + item.datetime }}</span>
    </div>
    <!-- <div class="d-flex flex-column bd-highlight m-0 mb-3 text-center">
      <div class="p-0 bd-highlight">
        <h4>{{ targetDate }}</h4>
      </div>
      <div class="p-0 bd-highlight">
        <span class="font-weight-medium" :style="{'font-size':'18px'}">{{ item.datetime }}</span>
      </div>
    </div> -->
    <v-card
      :loading="loading"
      class="mx-auto text-left p-0 mb-1"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <v-list-item-title class="font-weight-bold">
            <div class="font-weight-medium pl-1 pt-0" :style="{'text-transform':'capitalize','font-size':'22px'}">
              {{ item.studioName }}
            </div>
          </v-list-item-title>
          <div class="p-0 pl-3">
            <v-list-item-subtitle>レンタル料金：¥{{ item.price }}</v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">利用時間：{{ item.hour }}時間</span></v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">利用ﾀｲﾌﾟ：{{ item.use_name }}</span></v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">人数ﾀｲﾌﾟ：{{ item.use_type }}</span></v-list-item-subtitle>
            
            <div class="d-flex justify-content-between pt-2 pb-2">
              <label class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-14 g-pl-25 mt-2">
                <input v-model="isOption" type="checkbox" name='checkbox' class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0"><i class="fa" data-check-icon="&#xf00c"></i></input>
                エアコン利用
              </label>
              <div v-if="isOption" class="g-font-size-14">
                <p class="text-secondary m-0 pt-2 pr-4">¥{{ billingAmount }}</p>
              </div>
            </div>
          </div>
        </v-list-item-content>
      </v-list-item>
      <v-list-item class="text-right mt-2">
        <v-list-item-subtitle class="g-font-size-18 font-weight-bold g-color-primary pr-4">支払合計：¥{{ total.toLocaleString() }}</v-list-item-subtitle>
      </v-list-item>
      <v-divider class="mx-4 mb-0"></v-divider>
      <v-card-actions class="justify-content-center pb-2">
        <div class="d-flex bd-highlight">
          <div class="p-0 flex-fill bd-highlight text-center p-3">
            <div class="p-0 bd-highlight mb-2">
              <el-button class="p-3" :style="{'width':'100%'}" type="success" 
                @click="payoff" 
                :disabled="!isPoint" 
                :loading="loading">
                ポイント精算する
              </el-button>
            </div>

            <span v-if="!auth.isPhoneNumber" class="p-0 bd-highlight">
              <!-- <span class="sample" :style="{'color':'red'}">PayPay決済メンテナンス中、誠に申し訳ありません。</span> -->
              <el-button class="mb-3" :style="{'width':'100%'}" type="secondary" 
                @click="paypay">
                <img
                  width="88" height="25"
                  src="/images/Paypay_logo.png"
                  alt="PayPay">
                  <span class="ml-1">PayPay決済する</span>
              </el-button>
            </span>

            <span v-if="!auth.isPhoneNumber" class="bd-highlight">
              <el-button 
                :style="{'width':'100%'}" type="secondary" 
                @click="payment" 
                :loading="loading"
                :disabled="isOption">
                <img
                  width="120" height="22"
                  src="/images/card_5brand.png"
                  alt="stripe">
                <span class="ml-1">カード決済する</span>
              </el-button>
            </span>
            
          </div>
        </div>
      </v-card-actions>
    </v-card>
  </el-dialog>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"
import { Dialog } from 'element-ui'

import Firebase from 'Firebase';

export default {
  components: {
    'el-dialog': Dialog,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    // item: { 
    //   type: Object, 
    //   default: () => {} 
    // },
    closeModal: {
      type: Function,
      default: function () {},
    },
  },
  data() {
    return {
      // dialog: false,
      // title: '',
      // isTarget: false,
      // useType: '',
      // targetDate: '',
      item: {
        studioName: '',
        hour: '',
        use_type: '',
        use_name: '',
        amount: 0,
      },
      isOption: false,
      hours: 0,
      minutes: 0,
      isPoint: true,
      total: 0,
    }
  },
  watch: {
    'isOption': function (val) {
      // エアコン利用
      if(val) {
        this.total += this.billingAmount;
        this.item.amount=this.billingAmount;
      } else {
        this.total = this.item.price;
        this.item.amount=0;
      }
    },
  },
  computed: {
    targetDate() {
      if(!store.state.search.date) return '';
      else return moment(store.state.search.date).format("MM月DD日");
    },
    loading() {
      return store.state.isLoading;
    },
    search() {
      return store.state.search;
    },
    auth() {
      return store.state.auth;
    },
    billingAmount() {  //エアコン代
      return this.hours*140 + this.minutes*70;
    },
  },
  created: function () {

  },
  mounted() {
  
  },
  methods: {
    setItem(item) {

      // 利用時間を数値変換
      this.hours = Number(item.hours);
      this.minutes = Number(item.minutes);

      this.isOption=false;

      // ポイント利用可否
      if(this.auth.credit<item.price) this.isPoint = false;

      this.item = {
        studioName: item.studioName,
        hour: item.hour,
        use_type: item.use_type,
        use_name: item.use_name,
        price: item.price,
        amount: 0,
        start_datetime: item.start_datetime,
        finish_datetime: item.finish_datetime,
        datetime: item.datetime,
        product_name: item.product_name,
        description: '',
      };
      this.total = Number(item.price);
    },
    payoff() { //ポイント精算確認
      this.$emit('confirmPay', 'ポイント精算', this.item);
    },
    payment() { //カード決済
      // this.$emit('payment', this.item);
      this.$emit('confirmPay', 'カード決済', this.item);
    },
    paypay() {  //paypay決済
      this.$emit('confirmPay','PayPay決済', this.item);
    },
    close () {
      this.closeModal();
      this.$el.scrollTo(0,0);
    },
  }
}
</script>
