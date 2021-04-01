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
    <!-- <span class="font-weight-medium " :style="{'font-size':'20px'}">{{ targetDate + ' ' + item.datetime }}</span> -->
    <div class="d-flex flex-column bd-highlight m-0 mb-3 text-center">
      <div class="p-0 bd-highlight">
        <h4>{{ targetDate }}</h4>
      </div>
      <div class="p-0 bd-highlight">
        <span class="font-weight-medium" :style="{'font-size':'18px'}">{{ item.datetime }}</span>
      </div>
    </div>
    <v-card
      :loading="loading"
      class="mx-auto text-left p-0 mb-1"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="d-flex justify-content-end p-2 pt-3 pb-0">
            <div>
              <div class="d-flex flex-column bd-highlight m-0 text-right">
                <!-- <el-badge v-if="auth.username=='' || !auth.isLine" type="danger" class="pt-2 bd-highlight" :value="'一般のお客様'"></el-badge>
                <el-badge v-else class="pt-2 bd-highlight" type="success" :value="'会員様'"></el-badge> -->
                <span v-if="auth.email!==''" class="p-0 bd-highlight sample">ポイント：{{ auth.credit.toLocaleString() }}</span></span>
              </div>
            </div>
          </div>
          <!-- .toLocaleString() -->
          <!-- <div class="d-flex flex-column bd-highlight m-0">
            <div class="font-weight-medium pt-2" :style="{'text-transform':'capitalize','font-size':'20px'}">
              {{ item.studioName }}
            </div>
          </div> -->
          <v-list-item-title class="font-weight-bold">
            <div class="font-weight-medium pl-1 pt-0" :style="{'text-transform':'capitalize','font-size':'22px'}">
              {{ item.studioName }}
            </div>
          </v-list-item-title>
          <div class="p-0 pl-3">
            <v-list-item-subtitle class="font-weight-bold pb-1">レンタル料金：¥{{ item.price }}</v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">利用時間：{{ item.hour }}時間</span></v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">利用ﾀｲﾌﾟ：{{ item.use_name }}</span></v-list-item-subtitle>
            <v-list-item-subtitle class="mt-1">人数ﾀｲﾌﾟ：{{ item.use_type }}</span></v-list-item-subtitle>
          </div>
        </v-list-item-content>
        <v-list-item-avatar
          class="p-4 mr-3"
          tile
          size="100"
          color="grey"
        >
          <img
            v-if="item.studioName=='ナゴスタジオ'"
            src="http://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_nag.jpg"
            alt="ナゴスタジオ">
          <img
            v-else
            src="http://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_cdd.jpg"
            alt="コザスタジオ">
        </v-list-item-avatar>
      </v-list-item>

      <v-card-actions class="justify-content-center pb-2">
        <div class="d-flex bd-highlight">
          <div class="p-0 flex-fill bd-highlight text-center pt-4 pb-4">
            <!-- <span class="p-0 bd-highlight">
              <el-button class="mb-4" :style="{'width':'100%'}" type="secondary" @click="paypay">
                <img
                  width="88" height="25"
                  src="/images/Paypay_logo.png"
                  alt="PayPay">
                  <span class="ml-1">PayPayで支払う</span>
              </el-button>
            </span> -->
            <div class="p-0 bd-highlight mb-4">
              <el-alert
                v-if="!isPoint"
                class="p-1 mb-2"
                type="error"
                description="ポイントが不足しています。"
                show-icon>
              </el-alert>
              <!-- <el-button class="p-3" :style="{'width':'100%'}" type="success" @click="payoff" :disabled="auth.credit<item.price" :loading="loading">
                ポイント精算する
              </el-button> -->
              <!-- <el-button class="p-3" :style="{'width':'100%'}" type="success" 
                @click.stop="dialog = true" 
                :disabled="auth.credit<item.price" 
                :loading="loading">
                ポイント精算する?
              </el-button> -->
              <el-button class="p-3" :style="{'width':'100%'}" type="success" 
                @click="payoff" 
                :disabled="auth.credit<item.price" 
                :loading="loading">
                ポイント精算する
              </el-button>
              
            </div>
            <span class="p-0 bd-highlight">
              <el-button :style="{'width':'100%'}" type="secondary" @click="payment" :loading="loading">
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
    item: { 
      type: Object, 
      default: () => {} 
    },
    closeModal: {
      type: Function,
      default: function () {},
    },
  },
  data() {
    return {
      dialog: false,
      title: '',
      isTarget: false,
      useType: '',
      // targetDate: '',
      form: {
        hour: '',
        use_type: '',
        use_name: '',
      },
      isPoint: true,
    }
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
  },
  created: function () {

    // this.form.hour = this.search.hour;
    // this.form.use_type = this.search.use_type;
    // this.form.use_name = this.search.use_name;

    // // 過去データは取消不可
    // // console.log(this.$moment().format('YYYY-MM-DD'), this.item.start)
    // if(this.$moment().format('YYYY-MM-DD')<=this.item.start){
    //   if(this.item.user_id==this.auth.user_id) this.isTarget=true;
    // }
    // this.targetDate = moment(this.item.start).utc().format("MM月DD日")
    // this.useType = this.item.use_type
  },
  mounted() {
    
    // ポイント
    if(this.auth.credit<this.item.price){
      this.isPoint=false;
    }
  },
  methods: {
    // applyExperience() {
    //   this.$emit('apply',this.item);
    // },
    payoff() { //ポイント精算確認
      this.$emit('confirmPay', 'ポイント精算', this.item);
    },
    payment() { //カード決済
      // this.$emit('payment', this.item);
      this.$emit('confirmPay', 'カード決済', this.item);
    },
    // paypay() {  //paypay決済
    //   this.$emit('paypay',this.item)
    // },
    close () {
      this.closeModal();
      this.$el.scrollTo(0,0);
    },
  }
}
</script>
