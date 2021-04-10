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
      <!-- <td :colspan="headers.length">
        More info about {{ item }}
      </td> -->
      <!-- <template v-slot:item="{item}">
        <tr :class="{'elevation-1 primary': item.isEdit}">
          <td v-for="(value, index) in item" :key="index">
            {{ value }}
          </td>
        </tr>
      </template> -->
      <template slot="no-data" class="p-3">
        <span class="g-font-size-13 g-color-gray-dark-v4">スタジオ予約はありません。</span>   
        <!-- <span class="g-font-size-13 g-color-gray-dark-v4">スタジオ予約はありません。</span>    -->
      </template>
      <template v-slot:item.date="{ item }">
        <div class="mt-2 mb-1">
          <span>{{ item.date }}</span>
          <span class="g-font-size-13 g-color-gray-dark-v4 ml-1">{{ item.datetime }}</span>
        </div>
      </template>
      <template v-slot:item.title="{ item }">
        <div class="mb-2">
          <span class="g-color-gray-dark-v4">{{ item.title }}</span>
        </div>
      </template>
      <template v-slot:item.price="{ item }">
        <span>¥{{ item.price.toLocaleString() }}</span>
      </template>
      <template v-slot:item.isOption="{ item }">
        <div class="form-check-inline m-0">
          <!-- <v-simple-checkbox
            v-model="item.isOption"
            :disabled="true"
          ></v-simple-checkbox> -->
          <span v-if="!item.isOption" class="g-color-gray-dark-v5">
            <span class="mr-2 g-font-size-12">利用なし</span> ¥{{item.hours*140 + item.minutes*70}}
          </span>
          <span v-else class="pl-2">
            <span class="mr-2 g-font-size-12">利用あり</span> ¥{{item.hours*140 + item.minutes*70}}
          </span>
        </div>
      </template>
      <template v-slot:item.isCard="{ item }">
        <el-button
          class="mt-1 mb-1" 
          v-if="!item.isOption"
          :disabled="auth.credit<item.hours*140 + item.minutes*70"
          @click="edit(item)">
          エアコン代精算
        </el-button>
        <v-btn 
          class="mt-1 mb-1" 
          v-else
          :disabled="true"
          text>
          エアコン代精算済
        </v-btn>
        <v-btn 
          v-if="!item.isEdit"
          class="mt-1 mb-1" 
          :disabled="true"
          text>
          終了
        </v-btn>
        <el-button
          class="mt-1 mb-1"  
          v-if="!item.isCard && item.isEdit"
          @click="del(item)">
          予約取消
        </el-button>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
      <!-- <v-text-field
        :value="itemsPerPage"
        label="Items per page"
        type="number"
        min="-1"
        max="15"
        @input="itemsPerPage = parseInt($event, 10)"
      ></v-text-field> -->
    </div>

  <!-- 予約取消 -->
  <v-dialog
    v-model="delconfirm"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">予約取消の確認</v-card-title>

      <v-card-text>
        本当に予約を取消してよろしいですか？
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          text
          @click.stop="delconfirm = false"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="error"
          outlined
          text
          @click="deleteReservation"
        >
          はい
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- エアコン代の支払い確認 -->
  <v-dialog
    v-model="payconfirm"
    max-width="290"
  >
    <v-card>
      <v-card-title class="headline">ポイント精算の確認</v-card-title>
      <div class="text-center">
        <v-list-item-title class="headline mb-2 text-primary">
          ¥ {{ item.price }}
        </v-list-item-title>
      </div>

      <v-card-text>
        エアコン代をポイント精算してよろしいですか？
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          text
          @click.stop="payconfirm = false"
        >
          キャンセル
        </v-btn>
        <v-btn
          color="primary"
          outlined
          text
          @click="payoff"
        >
          ポイント精算する
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</div>
<!-- 
  <tr>
    <th scope="row" class="text-left">
      <span class="g-font-size-12">{{targetDate}}</span>
      <p>{{item.datetime}}</p>
    </th>
    <td class="text-left p-2 align-middle text-secondary">
      <span class="g-font-size-12">{{ item.title }}</span>
    </td>
    <td class="text-right p-1 align-middle text-secondary" :style="{'width':'10%'}">
      <span class="g-font-size-12">¥{{ item.price.toLocaleString() }}</span>
    </td>
    <td class="text-center p-0 align-middle text-secondary" :style="{'width':'20%'}">
      <label v-if="!item.isClass" class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-12 mt-2">
        <input v-model="used.op1" type="checkbox" name='checkbox' class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0" :disabled="true"><i class="fa" data-check-icon="&#xf00c"></i></input>
      </label>
      <v-icon
        v-else
        small
      >
        mdi-minus
      </v-icon>
    </td>
    <td class="text-center p-0 align-middle text-secondary" :style="{'width':'15%'}">
      <v-icon
        v-if="!item.isClass"
        small
        class="mr-2"
        @click="detail"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        v-else
        small
        class="mr-2"
      >
        mdi-minus
      </v-icon>
      <v-icon
        small
        @click="detail"
      >
        mdi-delete
      </v-icon>
    </td>
  </tr> -->
</template>
<!-- <style scoped>
  .item {
    margin-top: 10px;
    margin-right: 0px;
  }
</style> -->
<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

export default {
  // props: {
  //   item: { 
  //     type: Object, 
  //     default: () => {} 
  //   },
  // },
  data() {
    return {
      dialog: false,
      delconfirm: false,
      payconfirm: false,
      // used: {
      //   op1: false,
      // },
      item: {
        price: 0,
      },
      // hours: 0,
      // minutes: 0,
      // isOption: false,
      // optionAmount: 0,
      // targetDate: '',
      // date: '',
      // start: '',
      // finish: '',
      headers: [
        {
          text: '日時',
          align: 'start',
          value: 'date',
          sortable: false, 
        },
        { text: '内容', align: 'start', sortable: false, value: 'title' },
        { text: '料金', align: 'start', sortable: false, value: 'price' },
        { text: 'エアコン利用', sortable: false, value: 'isOption' },
        { text: '' , sortable: false, value: 'isCard' },
        // { text: '', value: 'data-table-expand' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 3,
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
    // billingAmount() {  //エアコン代
    //   return this.hours*140 + this.minutes*70;
    // },
    items() {
      return store.state.result.my;
    },
  },
  created: function () {
    // console.log('my', this.item)

    // // 対象日付
    // this.targetDate = moment(this.item.start).utc().format("MM/DD");

    // // 利用時間を数値変換
    // this.hours = Number(this.item.hours);
    // this.minutes = Number(this.item.minutes);

    // // エアコン利用料
    // if(0<this.item.superField) {
    //   this.optionAmount=this.item.superField;
    //   this.used.op1=true;
    //   this.isOption=true;
    // }

  },
  mounted() {
    // this.title = this.selectDate+'の予約';
    // console.log('nu', this.auth.credit + this.item.price)
  },
  methods: {
    edit(item) {
      // console.log(item);
      this.item.id = item.id;
      this.item.price = item.hours*140 + item.minutes*70;
      this.payconfirm=true;
      // this.$emit('openDetail', this.item);
    },
    del(item) {
      // console.log(item);
      this.item=item;
      this.delconfirm=true;
    },
    payoff() {
      store.commit('SET_ISLOADING', true);

      const that = this;
      let credit = that.auth.credit;
      credit = that.auth.credit - that.item.price;
      // console.log(credit);

      store.dispatch('saveUser',{
        params: {
          credit: credit,
        },
        callback: function(res){
          console.log('save', res);

          // 予約
          store.dispatch('editAppointment', {
            params: {
              id: that.item.id,
              amount: that.item.price
            },
            callback: function(res2){
              // ポイント更新
              store.commit('UPDATE_USER_CREDIT', credit);

              // データ取得
              setTimeout(function() {

                that.$message({
                  type: 'success',
                  message: 'エアコン代ポイント精算完了しました。',
                });

                // 閉じる
                that.payconfirm=false;
               
                // 予約
                // store.commit('SET_EVENTS', []);

                // データ初期化
                store.commit('RESET_DATA');
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

              }, 1000);
            }
          });
        }
      });
    },
    deleteReservation() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      let credit = that.auth.credit;
      credit = Number(that.auth.credit) + Number(that.item.price);

      // エアコン利用の場合、戻す
      if(that.item.isOption) credit = credit + that.item.hours*140 + that.item.minutes*70;

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
              // created: moment(that.item.created).format("YYYY-MM-DD"),
              // start: that.item.start,
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
                store.dispatch('getBookings',{
                  callback: function(res){
                    // 自身の予約
                    store.dispatch('getAgenda',{
                      params: {
                        from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_id: that.auth.user_id,
                        resource_id: that.item.resource_id,
                      },
                      callback: function(res2) {
                        that.delconfirm=false;
                        store.commit('SET_ISLOADING', false);
                      }
                    });

                  }
                });

              },1000);
            }
          });
        }
      });

    },
  }
}
</script>
