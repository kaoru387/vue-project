<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="items"
      :sort-by="['updated', 'date']"
      :sort-desc="[true, false]"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="g-color-gray-dark-v3"
      @page-count="pageCount = $event"
    >
      <!-- <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about
        </td>
      </template> -->
      <template slot="no-data" class="p-3">
        <span class="g-font-size-13 g-color-gray-dark-v4">クラス予約はありません。</span>   
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
        <div class="mb-1">
          <span v-if="item.isPaid" class="mr-2 g-font-size-12 g-color-gray-dark-v5">{{ item.status }}</span>
          <span v-else class="mr-2 g-font-size-12">現地払い</span>
          <span>¥{{item.price.toLocaleString()}}</span>
        </div>
        <!-- <span>¥{{ item.price.toLocaleString() }}</span> -->
        <!-- <span v-if="!item.isPaid" class="g-color-gray-dark-v5">
          <span class="mr-2 g-font-size-12">未払い</span> ¥{{item.price.toLocaleString()}}
        </span>
        <span v-else class="pl-2">
          <v-icon small color="#03BFA5"
          >mdi-check-circle</v-icon>
        <span class="mr-2 g-font-size-12">支払済</span> ¥{{item.price.toLocaleString()}}
        </span> -->
      </template>
      <template v-slot:item.description="{ item }">
        <span class="g-font-size-12">{{ item.description }}</span>
      </template>
      <template v-slot:item.location="{ item }">
        <span class="g-font-size-12">{{ item.location }}</span>
      </template>
      <template v-slot:item.isEdit="{ item }">
        <!-- <v-btn
          v-if="!item.isPaid"
          class="mt-2 mb-2"
          outlined
          text
          color="indigo"
          :disabled="auth.credit<item.price"
          @click="confirmPayPoint(item)"
        >
          ポイント精算
        </v-btn> -->
        <v-btn 
          v-if="!item.isEdit"
          class="mt-2 mb-2" 
          :disabled="true"
          text>
          終了
        </v-btn>
        <el-button 
          v-else
          class="mt-2 mb-2"
          @click="confirmDelete(item)">
          予約取消
        </el-button>
      </template>
    </v-data-table>

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
      <v-card class="pb-2">
        <v-card-title class="headline">予約取消の確認</v-card-title>

        <v-card-text class="pb-2">
          本当に予約を取消してよろしいですか？
        </v-card-text>
        <v-card-text :style="{'color':'blue', 'font-size':'9pt'}">
          お支払い分は、PayPayへ返金されます。
        </v-card-text>
        <!-- <v-card-text v-if="!isTimeLimit"  :style="{'color':'blue', 'font-size':'9pt'}">
          お支払い分は、PayPayへ返金されます。
        </v-card-text>
        <v-card-text v-else :style="{'color':'red', 'font-size':'9pt'}">
          PayPay返金の有効期限を過ぎましたので、返金については管理者へお問い合わせください。このまま取消した場合、お支払い分はポイントへ変換されます。
        </v-card-text> -->
       
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
            @click="deleteReservationPayPay"
          >
            はい
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ポイント精算の確認 -->
    <v-dialog
      v-model="pointconfirm"
      max-width="290"
    >
      <v-card class="pb-2">
        <v-card-title class="headline">予約取消の確認</v-card-title>

        <v-card-text>
          本当に予約を取消してよろしいですか？
        </v-card-text>
        <v-card-text :style="{'color':'blue', 'font-size':'9pt'}">
          お支払い分は、ポイントへ変換されます。
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            outlined
            text
            @click.stop="pointconfirm = false"
          >
            キャンセル
          </v-btn>
          <v-btn
            color="indigo"
            outlined
            text
            @click="deleteReservation"
          >
            はい
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
  </div>

  <!-- <v-card
    class="mx-auto text-left p-2 pl-3 pr-3 mb-1"
    max-width="344"
    outlined
  >
    <v-card-title>{{ item.title }}</v-card-title>
    <v-card-text class="justify-content-between pb-0 g-font-size-14">
      <div class="font-weight-medium mb-1" :style="{'text-transform':'capitalize'}">
        {{targetDate}}<span class="ml-2">{{ item.datetime }}</span>
      </div>
      <div class="grey--text">
        料金：¥{{item.price}}
      </div>
    </v-card-text>
    <v-card-text class="justify-content-between">
      <div class="pt-3">{{ item.description }}</div>
      <p class="mt-2">場所：{{item.location}}</p>
    </v-card-text>
    <v-card-actions class="justify-content-end">
      <v-btn
        color="gray"
        outlined
        text
        @click.stop="dialog = true"
      >
        予約取消
      </v-btn>
    </v-card-actions>
  </v-card> -->
</template>

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
      delconfirm: false,
      pointconfirm: false,
      // isTimeLimit: false,
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
        {
          text: '作成日',
          align: 'start',
          value: 'updated',
          sortable: true, 
        },
        { text: '' , sortable: false, value: 'isEdit' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 2,
      expanded: [],
      item: [],
      merchantRevertId: '',
      paymentId: '',
      requestedAt: '',
      paypayDetails: [],
    }
  },
  watch: {
  },
  computed: {
    search() {
      return store.state.search;
    },
    auth() {
      return store.state.auth;
    },
    items() {
      return store.state.result.myClass;
    },
  },
  created: function () {
    // 対象日付
    // this.targetDate = moment(this.item.start).utc().format("MM月DD日");
  },
  mounted() {
    // this.title = this.selectDate+'の予約';
    // console.log('nu', this.auth.credit + this.item.price)
    // console.log('nu', this.item)
    // this.isPayPay=false;
    // if(this.item.status=="PayPay決済") this.isPayPay=true;
  },
  methods: {
    confirmDelete(item) {   // 予約削除の確認

      console.log('HI' ,item);
      this.item = item;

      const that = this;
      if(item.status=="PayPay決済"){
        store.commit('SET_ISLOADING', true);
        console.log("delete my class.", item.status);

        // paypay支払状態を取得
        store.dispatch('getPayPayStatus',{
          params: {
            merchantPaymentId: item.super_field
          },
          callback: function(res) {

            console.log(res)
            that.paypayDetails=res;
            
            // if(res.status=="COMPLETED"){
            //   // paypay決済キャンセル可
            //   that.isTimeLimit = false;
            // }else{
            //   // paypay決済キャンセル不可、ポイント変換
            //   that.isTimeLimit = true;
            // }
            that.delconfirm=true;
            store.commit('SET_ISLOADING', false);

            // console.log('params', params);
          }
        });

      } else {
        // ポイント変換、paypay以外
        that.pointconfirm=true;
      }

    },
    deleteReservationPayPay() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      console.log(that.paypayDetails);

      const timeStamp = Math.round((new Date()).getTime() / 1000);
      // console.log("timeStamp", timeStamp);

      // PayPay返金
      store.dispatch('cancelPayPay', {
        params: {
          merchantRefundId: '',
          paymentId: that.paypayDetails.paymentId,
          amount: that.paypayDetails.amount,
          requestedAt: timeStamp,
          reason: 'クラス予約の取消',
        },
        callback: function(res) {

          console.log('cancel pay', res);
          if(res.data.status!=='CREATED') {
            alert('PayPay返金処理に失敗しました！管理者へお問い合わせください。')
            return;
          }
          console.log('cancel pay success!');

          store.dispatch('deleteAppointment',{
            params: {
              id: that.item.id,
              resourceId: that.item.resource_id,
            },
            callback: function(res3) {

              console.log(res3)

              // 完了メッセージ
              that.$message({
                type: 'success',
                message: '予約を取消しました。',
              });

              that.delconfirm=false;

              // 自身の予約
              store.dispatch('getAgenda',{
                params: {
                  user_id: that.auth.user_id,
                  resource_id: that.item.resource_id,
                },
                callback: function(res4) {
                  store.commit('SET_IS_SEARCH', false);
                  store.commit('SET_ISLOADING', false);
                  store.commit('SET_BACK_URI', '/schedule');
                  that.$router.push('/');
                }
              });

            }
          });

        }
      });
    },
    deleteReservation() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      let credit = that.auth.credit;
      credit = Number(that.auth.credit) + Number(that.item.paid);
      console.log('credit', credit);
      console.log(that.paypayDetails);

      // ユーザー情報更新
      store.dispatch('saveUser',{
        params: {
          credit: credit,
        },
        callback: function(res2){

          // ポイント更新
          store.commit('UPDATE_USER_CREDIT', credit);
          store.dispatch('deleteAppointment',{
            params: {
              id: that.item.id,
              resourceId: that.item.resource_id,
            },
            callback: function(res3) {

              console.log(res3)

              // 完了メッセージ
              that.$message({
                type: 'success',
                message: '予約を取消しました。',
              });

              // 自身の予約
              store.dispatch('getAgenda',{
                params: {
                  user_id: that.auth.user_id,
                  resource_id: that.item.resource_id,
                },
                callback: function(res4) {
                  that.pointconfirm=false;
                  store.commit('SET_IS_SEARCH', false);
                  store.commit('SET_ISLOADING', false);
                  store.commit('SET_BACK_URI', '/schedule');
                  that.$router.push('/');
                }
              });

            }
          });
        }
      });

    },


  }
}
</script>
