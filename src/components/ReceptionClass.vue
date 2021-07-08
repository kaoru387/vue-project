<template>
  <div>
    <v-card class="mx-auto text-left p-0 mb-3" outlined>
        <v-card-title class="pb-0" :style="{'line-height':'1.2em'}">{{ item.title }}</v-card-title>
        <v-divider class="mx-4 m-2"></v-divider>
        <v-card-text class="justify-content-between pt-0 pb-3">
          
          <div class="subtitle-1 g-font-size-14">
            <span>{{ item.date }}</span>
            {{ item.start + '-' + item.finish }}
          </div>
          <p class="mt-1 g-font-size-12">{{item.location}}</p>
          <div class="g-font-size-12">{{ item.description }}</div>
        </v-card-text>

        <v-list-item class="text-left mb-3">
          <v-list-item-subtitle class="g-font-size-24 g-color-gray-dark-v4 pl-4">¥{{ item.price }}</v-list-item-subtitle>
          <v-btn
            class="m-2 mr-4"
            outlined
            color="indigo"
            text
            @click="setItem(item)"
          >
            参加申込み
          </v-btn>
        </v-list-item>
       <!-- <v-card-actions class="justify-content-center">
        <div class="d-flex bd-highlight">
          <div class="p-0 flex-fill bd-highlight text-center pt-2 pb-2">
            <span class="p-0 bd-highlight">
              <el-button class="mb-2" :style="{'width':'100%'}" type="secondary" 
                @click="confirmExecute('PayPay決済')" >
                <img
                  width="88" height="25"
                  src="/images/Paypay_logo.png"
                  alt="PayPay">
                  <span class="ml-1">PayPay決済する</span>
              </el-button>
            </span>
            
            <div class="p-0 bd-highlight mt-5 mb-2">
              <el-alert
                class="text-left m-1"
                type="warning"
                description="PayPay決済で参加申込みのお客様は、アカウント作成不要です。どうぞお気軽にお申し込みください！"
                show-icon>
              </el-alert>
            </div>
          </div>
        </div>
      </v-card-actions> -->
    </v-card>

    <!-- <v-data-table
      :headers="headers"
      :items="items"
      sort-by="updated"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="g-color-gray-dark-v2"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.date="{ item }">
        <div class="mt-2 mb-1">
          <span>{{ item.date }}</span>
          <span class="g-font-size-13 ml-1">{{ item.start + '-' + item.finish }}</span>
        </div>
      </template>
      <template v-slot:item.title="{ item }">
        <div class="mb-2">
          <span>{{ item.title }}</span>
        </div>
      </template>
      <template v-slot:item.price="{ item }">
        <span>¥{{ item.price.toLocaleString() }}</span>
      </template>
      <template v-slot:item.description="{ item }">
        <span class="g-font-size-12">{{ item.description }}</span>
      </template>
      <template v-slot:item.location="{ item }">
        <span class="g-font-size-12">{{ item.location }}</span>
      </template>
      <template v-slot:item.isClass="{ item }">
        <v-btn
          class="mt-2 mb-2"
          outlined
          color="indigo"
          text
          @click="confirm(item)"
        >
          参加申込み
        </v-btn>
      </template>

    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div> -->
   
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

export default {
  props: {
    // items: { 
    //   type: Array, 
    //   default: () => {} 
    // },
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      isExecute: false,
      dialog: false,
      // headers: [
      //   {
      //     text: '日時',
      //     align: 'start',
      //     value: 'date',
      //     sortable: false, 
      //   },
      //   { text: 'タイトル', align: 'start', sortable: false, value: 'title' },
      //   { text: '料金', align: 'start', sortable: false, value: 'price' },
      //   { text: '内容', align: 'start', sortable: false, value: 'description' },
      //   { text: '場所', align: 'start', sortable: false, value: 'location' },
      //   { text: '' , sortable: false, value: 'isClass' },
      // ],
      // page: 1,
      // pageCount: 0,
      // itemsPerPage: 3,
      // expanded: [],
      // item: [],
      // title: '',
    }
  },
  watch: {
  },
  computed: {
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
  },
  mounted() {
  },
  methods: {
    // confirmExecute(title) {
    //   // // 対象データ保持
    //   // this.title = title;
    //   // this.isExecute = true;
    //   // this.dialog = false;
    // },
    setItem(item) {
      // // 対象データ保持
      // this.item = item;
      // this.dialog = true;
      this.$emit('setItem', item);
    },
    // reserve() {  // 現地払い、予約のみ
    //   this.$emit('reserve', this.item);
    //   setTimeout(function(){
    //     this.isExecute = false;
    //   },1000);
    // },
    // payoff() {  // 予約・ポイント精算
    //   this.$emit('payoff', this.item);
    //   setTimeout(function(){
    //     this.isExecute = false;
    //   },1000);
    // },
    // paypay() {  // 予約・PayPay決済
    //   this.$emit('paypay', this.item);
    //   setTimeout(function(){
    //     this.isExecute = false;
    //   },1000);
    // },
  }
}
</script>
