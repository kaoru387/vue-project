<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="date"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="g-color-gray-dark-v3"
      @page-count="pageCount = $event"
    >
      <template v-slot:item.date="{ item }">
        <div class="mt-2 mb-1">
          <span>{{ item.date }}</span>
          <span class="g-font-size-13 g-color-gray-dark-v4 ml-1">{{ item.start + '-' + item.finish }}</span>
        </div>
      </template>
      <template v-slot:item.title="{ item }">
        <div class="mb-2">
          <span class="g-color-gray-dark-v4">{{ item.title }}</span>
        </div>
      </template>
      <!-- <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about
        </td>
      </template> -->
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
        <!-- <v-btn
          class="mt-2 mb-2"
          outlined
          text
          color="indigo"
          :disabled="!auth.isPoint"
          @click="confirmPayoff(item)"
        >
          予約・ポイント精算
        </v-btn> -->
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
    </div>

    <!-- ポイント精算確認 -->
    <!-- <v-dialog
      v-model="dialog"
      max-width="360"
    > -->
    <el-dialog
      title="申込み内容の確認"
      custom-class="dialog_category"
      :visible="dialog"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      append-to-body
      @close="dialog = false"
      :loading="loading"
      width="98%"
      :style = "{'max-width':'375px','margin': '20px auto'}"
      center
    >
      <v-card class="mx-auto text-left p-0 mb-3" outlined>
       <v-card-title>{{ item.title }}</v-card-title>

        <v-card-text class="justify-content-between">
          <v-row
            align="center"
            class="mx-0"
          >
            <div class="g-font-size-12">
              料金：¥{{item.price}}
            </div>
          </v-row>
          <div class="my-3 subtitle-1 g-font-size-14">
            <span>{{ item.date }}</span>
            {{ item.start + '-' + item.finish }}
          </div>
          <div class="g-font-size-12">{{ item.description }}</div>
          <p class="mt-1 g-font-size-12">場所：{{item.location}}</p>
        </v-card-text>

        <v-list-item class="text-right">
          <v-list-item-subtitle class="g-font-size-18 font-weight-bold g-color-primary pr-4">支払合計：¥{{ item.price }}</v-list-item-subtitle>
        </v-list-item>
        <v-divider class="mx-4"></v-divider>

        <!-- <v-card-title class="pt-0 pb-0 text-gray">予約・支払い</v-card-title> -->

         <v-card-actions class="justify-content-center">
          <div class="d-flex bd-highlight">
            <div class="p-0 flex-fill bd-highlight text-center pt-2 pb-2">

              <div class="p-0 bd-highlight mb-2">
                <el-button class="p-3" :style="{'width':'100%'}" type="success" 
                  @click="confirmExecute('ポイント精算')"
                  :disabled="item.isPoint" 
                  :loading="loading">
                  ポイント精算する
                </el-button>
              </div>

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
              
              <div class="p-0 bd-highlight mb-2">
                <el-button class="p-3" :style="{'width':'100%'}"
                  @click="confirmExecute('予約のみ')" 
                  :loading="loading">
                  予約のみ
                </el-button>
              </div>
              <!-- <span class="p-0 bd-highlight">
                <el-button class="p-3" :style="{'width':'100%'}"
                  outlined
                  @click.stop="dialog = false">
                  キャンセル
                </el-button>
              </span> -->
              
            </div>
          </div>
        </v-card-actions>


        <!-- <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="dialog = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="indigo"
            outlined
            text
            @click="payoff"
          >
            予約・ポイント精算する
          </v-btn>

        </v-card-actions> -->
      </v-card>
    </el-dialog>
    <!-- </v-dialog> -->

    <!-- 実行確認 -->
    <v-dialog
      v-model="isExecute"
      max-width="360"
    >
      <v-card class="pb-3">
       <v-card-title>{{ title }}確認</v-card-title>

        <v-card-text class="justify-content-between">
          参加申込みありがとうございます。{{ title }}実行してよろしいですか？
        </v-card-text>

       <!--  <v-divider class="mx-4"></v-divider> -->

        <!-- <v-card-title class="pt-0 pb-0 text-gray">予約のみ</v-card-title> -->

        <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="isExecute = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            v-if="title=='予約のみ'"
            color="indigo"
            outlined
            text
            @click="reserve"
          >
            はい
          </v-btn>
          <v-btn
            v-if="title=='ポイント精算'"
            color="indigo"
            outlined
            text
            @click="payoff"
          >
            はい
          </v-btn>
          <v-btn
            v-if="title=='PayPay決済'"
            color="indigo"
            outlined
            text
            @click="paypay"
          >
            はい
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
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
        { text: '' , sortable: false, value: 'isClass' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 3,
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
    // confirmPayoff(item) {
    //   // 対象データ保持
    //   this.item = item;
    //   this.isPayPoint = true;
    // },
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
                  callback: function(res){

                    // 自身の予約
                    store.dispatch('getAgenda',{
                      params: {
                        from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_id: that.auth.user_id,
                        resource_id: that.item.resource_id,
                      },
                      callback: function(res3) {
                        // 検索終了
                        store.commit('SET_IS_SEARCH', false);
                        store.commit('SET_ISLOADING', false);
                      }
                    });

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
