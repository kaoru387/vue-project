<template>
  <div>
    <v-data-table
      v-if="items.length"
      :headers="headers"
      :items="items"
      :sort-by="['updated', 'date']"
      :sort-desc="[true, false]"
      multi-sort
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      class="g-color-gray-dark-v2"
      @page-count="pageCount = $event"
    >
      <template slot="no-data" class="p-3">
        <span class="g-font-size-13 g-color-gray-dark-v4">スタジオ予約はありません。</span>   
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
      <template v-slot:item.total="{ item }">
        <span class="mr-2 g-font-size-11 g-color-gray-dark-v5">{{ item.description }}</span><span>¥{{ item.total.toLocaleString() }}</span>
      </template>
      <template v-slot:item.isOption="{ item }">
        <div class="form-check-inline m-0 mt-1">
          <!--  -->
          <span v-if="!item.isOption" class="g-color-gray-dark-v5">
            <span class="g-font-size-12">利用なし</span>
          </span>
          <span v-else class="pl-2">
            <span class="mr-1 g-font-size-12">利用あり</span>
            <span class="g-font-size-11 g-color-gray-dark-v5">支払済 (¥{{ item.option_price }})</span>
            <!-- <v-simple-checkbox
              v-model="item.isOption"
              :disabled="true"
            ></v-simple-checkbox> -->
          </span>
        </div>
      </template>
      <template v-slot:item.isCard="{ item }">
        <el-button
          class="mt-2 mb-2" 
          v-if="!item.isOption"
          :disabled="auth.credit<item.hours*140 + item.minutes*70"
          @click="edit(item)">
          エアコン代精算
        </el-button>
        <!-- <v-btn 
          class="mt-2 mb-2" 
          v-else
          :disabled="true"
          text>
          エアコン代精算済
        </v-btn> -->
        <v-btn 
          v-if="!item.isEdit"
          class="mt-2 mb-2" 
          :disabled="true"
          text>
          終了
        </v-btn>
        <el-button
          class="mt-2 mb-2"  
          v-if="!item.isCard && item.isEdit"
          @click="del(item)">
          予約取消
        </el-button>
      </template>
      <template v-slot:item.updated="{ item }">
        <span class="g-color-gray-dark-v5">{{ item.updated }}</span>
      </template>
    </v-data-table>
    <div class="text-center pt-2">
      <v-pagination
        v-model="page"
        :length="pageCount"
      ></v-pagination>
    </div>

    <!-- 予約取消 -->
    <v-dialog
      v-model="delconfirm"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">予約取消の確認</v-card-title>

        <v-card-text class="pb-2">
          本当に予約を取消してよろしいですか？
        </v-card-text>
        <v-card-text :style="{'color':'blue', 'font-size':'9pt'}">
          お支払い分は、PayPayへ返金されます。
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
            @click="deleteReservationPayPay"
          >
            はい
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 予約取消ポイント変換 -->
    <v-dialog
      v-model="pointconfirm"
      max-width="290"
    >
      <v-card>
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
          <v-list-item-title class="headline mb-2 tg-color-primary">
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

</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

export default {
  data() {
    return {
      dialog: false,
      delconfirm: false,
      pointconfirm: false,
      payconfirm: false,
      item: {
        price: 0,
      },
      headers: [
        {
          text: '日時',
          align: 'start',
          value: 'date',
          sortable: true, 
        },
        { text: '内容', align: 'start', sortable: false, value: 'title' },
        { text: '料金', align: 'start', sortable: false, value: 'total' },
        { text: 'エアコン利用', sortable: false, value: 'isOption' },
        {
          text: '作成日',
          align: 'start',
          value: 'updated',
          sortable: true,
        },
        { text: '' , sortable: false, value: 'isCard' },
        // { text: '', value: 'data-table-expand' },
      ],
      page: 1,
      pageCount: 0,
      itemsPerPage: 2,
      paypayDetails: [],
      isTimeLimit: false,
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
    items() {
      return store.state.result.my;
    },
  },
  created: function () {
    // console.log('my', this.items)
  },
  mounted() {
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
      console.log(item);
      this.item=item;
      // this.delconfirm=true;
      const that = this;
      if(item.description=="PayPay決済"){
        store.commit('SET_ISLOADING', true);
        console.log("delete my class.", item.description);

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
    payoff() {  // エアコン代ポイント精算
      store.commit('SET_ISLOADING', true);

      const that = this;
      let credit = that.auth.credit;
      credit = that.auth.credit - that.item.price;

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

                // // 閉じる
                // that.payconfirm=false;
               
                store.commit('RESET_DATA');
                setTimeout(function(){
                  store.dispatch('getBookings',{
                    callback: function(err, res){
                      // store.commit('SET_ISLOADING', false);
                      // store.commit('SET_BACK_URI', '/schedule');
                      // that.$router.replace('/');

                      // 自身の予約
                      store.dispatch('getAgenda',{
                        params: {
                          // from_date: moment().format('YYYY-MM-DD'),
                          // time: '09:00',
                          // user_id: that.auth.user_id,
                          resource_id: 563549,
                        },
                        callback: function(res2) {
                          console.log(res2)
                          that.payconfirm=false;

                          store.commit('SET_BACK_URI', '/schedule');
                          that.$router.replace('/');

                          store.commit('SET_IS_SEARCH', false);
                          store.commit('SET_ISLOADING', false);
                        }
                      });
                      
                    }
                  });
                },200);

              }, 1000);
            }
          });
        }
      });
    },
    deleteReservationPayPay() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      console.log(that.paypayDetails, that.item);

      const timeStamp = Math.round((new Date()).getTime() / 1000);
      // console.log("timeStamp", timeStamp);


      // PayPay返金
      store.dispatch('cancelPayPay', {
        params: {
          merchantRefundId: '',
          paymentId: that.paypayDetails.paymentId,
          amount: that.paypayDetails.amount,
          requestedAt: timeStamp,
          reason: 'スタジオ予約の取消',
        },
        callback: function(res) {

          // console.log('cancel pay', res);
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

              // that.delconfirm=false;

              // // 自身の予約
              // store.dispatch('getAgenda',{
              //   params: {
              //     resource_id: 563549,
              //   },
              //   callback: function(res4) {
              //     console.log('callback agenda', res4)
              //     store.commit('SET_IS_SEARCH', false);
              //     store.commit('SET_ISLOADING', false);
              //     store.commit('SET_BACK_URI', '/schedule');
              //     that.$router.push('/');
              //   }
              // });

              // データ再取得
              store.commit('RESET_DATA');
              setTimeout(function(){
                store.commit('SET_ISLOADING', true);
                store.dispatch('getBookings',{
                  callback: function(err, res){

                    // 自身の予約
                    store.dispatch('getAgenda',{
                      params: {
                        resource_id: 563549,
                      },
                      callback: function(res2) {
                        console.log(res2)
                        that.delconfirm=false;

                        store.commit('SET_BACK_URI', '/schedule');
                        that.$router.replace('/');

                        store.commit('SET_IS_SEARCH', false);
                        store.commit('SET_ISLOADING', false);
                      }
                    });

                  }
                });
              },400);

            }
          });

        }
      });

    },
    deleteReservation() {
      store.commit('SET_ISLOADING', true);

      let that = this;
      let credit = that.auth.credit;
      // credit = Number(that.auth.credit) + Number(that.item.price);
      credit = Number(that.auth.credit) + Number(that.item.total);

      // エアコン利用の場合、戻す
      // if(that.item.isOption) credit = credit + that.item.hours*140 + that.item.minutes*70;
      // console.log(credit,that.item)

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

              // データ再取得
              store.commit('RESET_DATA');
              setTimeout(function(){
                store.commit('SET_ISLOADING', true);
                store.dispatch('getBookings',{
                  callback: function(err, res){

                    // 自身の予約
                    store.dispatch('getAgenda',{
                      params: {
                        resource_id: 563549,
                      },
                      callback: function(res2) {
                        console.log(res2)
                        that.pointconfirm=false;

                        store.commit('SET_BACK_URI', '/schedule');
                        that.$router.replace('/');

                        store.commit('SET_IS_SEARCH', false);
                        store.commit('SET_ISLOADING', false);
                      }
                    });

                  }
                });
              },400);

            }
          });
        }
      });

    },
  }
}
</script>
