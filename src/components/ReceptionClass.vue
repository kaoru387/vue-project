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
        <v-btn
          class="mt-2 mb-2"
          outlined
          text
          color="indigo"
          :disabled="!auth.isPoint"
          @click="confirmPayoff(item)"
        >
          予約・ポイント精算
        </v-btn>
        <v-btn
          class="mt-2 mb-2"
          outlined
          color="indigo"
          text
          @click="confirmReserve(item)"
        >
          予約のみ
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
    <v-dialog
      v-model="isPayPoint"
      max-width="360"
    >
      <v-card class="pb-3">
       <v-card-title>{{ item.title }}</v-card-title>

        <v-card-text class="justify-content-between">
          <v-row
            align="center"
            class="mx-0"
          >
            <div class="grey--text">
              料金：¥{{item.price}}
            </div>
          </v-row>

          <div class="my-4 subtitle-1">
            <!-- {{start}}-{{finish}} -->
          </div>
          <div>{{ item.description }}</div>
          <p class="mt-3">場所：{{item.location}}</p>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="pt-0 pb-0 text-gray">予約・支払い</v-card-title>

        <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="isPayPoint = false"
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

        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 予約のみ確認 -->
    <v-dialog
      v-model="isReserve"
      max-width="360"
    >
      <v-card class="pb-3">
       <v-card-title>{{ item.title }}</v-card-title>

        <v-card-text class="justify-content-between">
          <v-row
            align="center"
            class="mx-0"
          >
            <div class="grey--text">
              料金：¥{{item.price}}
            </div>
          </v-row>

          <div class="my-4 subtitle-1">
            <!-- {{start}}-{{finish}} -->
          </div>
          <div>{{ item.description }}</div>
          <p class="mt-3">場所：{{item.location}}</p>
        </v-card-text>

        <v-divider class="mx-4"></v-divider>

        <v-card-title class="pt-0 pb-0 text-gray">予約のみ</v-card-title>

        <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="isReserve = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="indigo"
            outlined
            text
            @click="reserve"
          >
            予約する
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
      isPayPoint: false,
      isReserve: false,
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
    // billingAmount() {
    //   return this.item.price;
    // },
    // items() {
    //   return store.state.result.myClass;
    // },
  },
  created: function () {
  },
  mounted() {
  },
  methods: {
    confirmPayoff(item) {
      // 対象データ保持
      this.item = item;
      this.isPayPoint = true;
    },
    confirmReserve(item) {
      // 対象データ保持
      this.item = item;
      this.isReserve = true;
    },
    reserve() {  //予約のみ
      store.commit('SET_ISLOADING', true);
      this.$emit('reserve', this.item);
    },
    payoff() {  //予約・ポイント精算
      store.commit('SET_ISLOADING', true);
      this.$emit('payoff', this.item);
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
