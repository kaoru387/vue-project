<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="updated"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="g-color-gray-dark-v2"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.id="{ item }">
        <div class="mt-1 mb-1">
          <span class="g-font-size-12 g-color-gray-dark-v4">{{ item.id }}</span>
        </div>
      </template>
      <template v-slot:item.date="{ item }">
        <div class="mb-1">
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
        <span class="g-font-size-12 mb-2">{{ item.location }}</span>
      </template>
      <!-- <template v-slot:item.isClass="{ item }">
        <v-btn
          class="mt-2 mb-2"
          outlined
          color="indigo"
          text
          @click="goDetail(item)"
        >
          詳細
        </v-btn>
      </template> -->
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>
  </div>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

export default {
  props: {
    items: { 
      type: Array, 
      default: () => {} 
    },
  },
  data() {
    return {
      // isPayPoint: false,
      // isReserve: false,
      isExecute: false,
      dialog: false,
      headers: [
        { text: 'ID', align: 'start', sortable: false, value: 'id' },
        {
          text: '日時',
          align: 'start',
          value: 'date',
          sortable: false, 
        },
        { text: 'タイトル', align: 'start', sortable: false, value: 'title' },
        { text: '料金', align: 'start', sortable: false, value: 'price' },
        { text: '内容', align: 'start', sortable: false, value: 'description' },
        { text: '場所', align: 'start', sortable: false, value: 'location' },
        // { text: '' , sortable: false, value: 'isClass' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      expanded: [],
      item: [],
      title: '',
    }
  },
  watch: {
    // 'used.op1': function (val) {
    //   if(!val) return;
    //   if(this.billingAmount<this.auth.credit) return;
    //   // 請求金額あるがポイント不足している場合
    //   this.$message({
    //     type: 'error',
    //     message: 'ポイントが不足しています。',
    //   });
    // },
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
    confirmExecute(title) {
      // 対象データ保持
      this.title = title;
      this.isExecute = true;
      this.dialog = false;
    },
    confirm(item) {
      // 対象データ保持
      this.item = item;
      this.dialog = true;
    },
    goDetail(item) {
      // 対象データ保持
      // this.item = item;
      window.location.href = '/?reseptionId='+item.id;
      // this.dialog = true;
    },
    reserve() {  //予約のみ
      this.$emit('reserve', this.item);
      setTimeout(function(){
        this.isExecute = false;
      },1000);
    },
    payoff() {  //予約・ポイント精算
      this.$emit('payoff', this.item);
      setTimeout(function(){
        this.isExecute = false;
      },1000);
    },
    paypay() {  //予約・PayPay決済
      this.$emit('paypay', this.item);
      setTimeout(function(){
        this.isExecute = false;
      },1000);
    },
    deleteReservation() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      let credit = that.auth.credit;
      credit = Number(that.auth.credit) + Number(that.item.price);

      // エアコン利用の場合、戻す
      if(that.isOption) credit = credit + that.billingAmount;

      store.dispatch('saveUser',{
        params: {
          credit: credit,
        },
        callback: function(res){
          // ポイント更新
          store.commit('UPDATE_USER_CREDIT', credit);

          store.dispatch('deleteAppointment',{
            params: {
              id: that.item.id,
              created: moment(that.item.created).format("YYYY-MM-DD"),
              start: that.item.start,
              // user_id: that.item.user_id,
              resourceId: that.item.resource_id,
            },
            callback: function(res) {
              // 完了メッセージ
              that.$message({
                type: 'success',
                message: '予約を取消しました。',
              });
              setTimeout(function(){
                // データ初期化
                store.commit('RESET_DATA');
                // 予約
                store.commit('SET_EVENTS', []);
                store.dispatch('getBookings',{
                  callback: function(err, res){
                    // 検索終了
                    store.commit('SET_IS_SEARCH', false);
                    store.commit('SET_ISLOADING', false);
                    // // 自身の予約
                    // store.dispatch('getAgenda',{
                    //   params: {
                    //     from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    //     user_id: that.auth.user_id,
                    //     resource_id: that.item.resource_id,
                    //   },
                    //   callback: function(res3) {
                    //     // 検索終了
                    //     store.commit('SET_IS_SEARCH', false);
                    //     store.commit('SET_ISLOADING', false);
                    //   }
                    // });

                  }
                });
                // store.dispatch('getUsers',function(e){
                //   store.commit('SET_ISLOADING', false)
                // });
              },1000);
            }
          });
        }
      });
    },
  }
}
</script>
