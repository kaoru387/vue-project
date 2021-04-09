<template>
  <v-card
    class="mx-auto text-left p-2 pl-3 pr-3 mb-1"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="d-flex justify-content-between">
          <div class="font-weight-medium" :style="{'text-transform':'capitalize'}">
            {{targetDate}}<span class="ml-2">{{ item.datetime }}</span>
          </div>
          <div>
            <!-- <span class="mr-1">{{ hours + '.' + minutes }}</span>時間 -->
            <!-- <el-badge :value="item.studioName" class="item"></el-badge> -->
          </div>
        </div>
        <div class="d-flex justify-content-between pt-2">
          <p>{{ item.studioName }}</p>
          <div>
            <p>支払済：¥<span class="mr-1">{{ item.price.toLocaleString() }}</span></p>
          </div>
        </div>
        <v-list-item-subtitle>{{ item.product_name }}</v-list-item-subtitle>
        <div class="d-flex justify-content-between pt-2 pb-2">
          <label class="form-check-inline u-check g-color-gray-dark-v5 g-font-size-14 g-pl-25 mt-2">
            <input v-model="used.op1" type="checkbox" name='checkbox' class="d-block u-check-icon-checkbox-v6 g-absolute-centered--y g-left-0" :disabled="isOption"><i class="fa" data-check-icon="&#xf00c"></i></input>
            エアコン利用
          </label>
          <div v-if="used.op1" class="pt-2 g-font-size-14">
            <p v-if="!isOption" class="text-primary">
              <span>請求金額：</span>¥<span class="mr-1">{{ billingAmount }}</span>
            </p>
            <p v-else class="text-secondary">
              <span>支払済：</span>¥<span class="mr-1">{{ optionAmount }}</span>
            </p>
          </div>
        </div>
      </v-list-item-content>
      <!-- <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar> -->
    </v-list-item>

    <v-card-actions class="justify-content-end p-0">
      <v-btn
        v-if="used.op1 && !isOption"
        color="success"
        outlined
        text
        :disabled="auth.credit<billingAmount"
        @click.stop="payconfirm = true"
      >
        ポイント精算する
      </v-btn>
      <v-btn
        :disabled="true"
        outlined
        text
      >
        予約取消
      </v-btn>


      <!-- エアコン代の支払い確認 -->
      <v-dialog
        v-model="payconfirm"
        max-width="290"
      >
        <v-card>
          <v-card-title class="headline">ポイント精算確認</v-card-title>
          <div class="text-center">
            <v-list-item-title class="headline mb-2 text-primary">
              ¥ {{ billingAmount }}
            </v-list-item-title>
          </div>

          <v-card-text>
            本当にポイント精算してよろしいですか？
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

    </v-card-actions>
  </v-card>
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
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      dialog: false,
      delconfirm: false,
      payconfirm: false,
      used: {
        op1: false,
      },
      hours: 0,
      minutes: 0,
      isOption: false,
      optionAmount: 0,
      targetDate: '',
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
    search() {
      return store.state.search;
    },
    auth() {
      return store.state.auth;
    },
    billingAmount() {  //エアコン代
      return this.hours*140 + this.minutes*70;
    }
  },
  created: function () {
    // 対象日付
    this.targetDate = moment(this.item.start).utc().format("MM月DD日");

    // 過去データは取消不可
    // if(this.$moment().format('YYYY-MM-DD')<=this.targetDate) {
    //   if(this.item.user_id==this.auth.user_id) {
    //     this.isTarget=true;
    //     this.isOption=true;
    //   }
    // }
    // this.useType = this.item.use_type

    // 利用時間を数値変換
    this.hours = Number(this.item.hours)
    this.minutes = Number(this.item.minutes)

    console.log(this.item);
    // エアコン利用料
    if(0<this.item.superField) {
      this.optionAmount=this.item.superField;
      this.used.op1=true;
      this.isOption=true;
    }

  },
  mounted() {
    // this.title = this.selectDate+'の予約';
    // console.log('nu', this.auth.credit + this.item.price)
  },
  methods: {
    payoff() {
      store.commit('SET_ISLOADING', true);

      const that = this;
      let credit = that.auth.credit;
      credit = that.auth.credit - that.billingAmount;
      console.log(credit);

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
              amount: that.billingAmount
            },
            callback: function(res2){

              // ポイント更新
              store.commit('UPDATE_USER_CREDIT', credit);
              // that.isPoint=true;
              // if(credit<that.item.price) that.isPoint=false;

              // データ取得
              setTimeout(function() {

                that.$message({
                  type: 'success',
                  message: 'ポイント支払い完了しました。',
                });
                // 閉じる
                that.payconfirm=false;
                // 支払済
                that.used.op1=true;
                that.isOption=true;
                that.optionAmount=that.billingAmount;

                // データ再取得
                store.dispatch('getUsers', 
                  function(e){
                    // 予約取得
                    store.commit('SET_EVENTS', []);
                    // 予約取得
                    store.dispatch('getBookings',{
                      callback: function(res){
                        // 検索終了
                        store.commit('SET_IS_SEARCH', false);
                        if(res) store.commit('SET_ISLOADING', false);
                        // that.$router.push({path: '/about'});
                      }
                    });
                });

              }, 2000);
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
              resource_id: that.item.resource_id,
            },
            callback: function(res) {
              // 完了メッセージ
              that.$message({
                type: 'success',
                message: '予約を取消しました。',
              });
              setTimeout(function(){
                // 予約
                store.commit('SET_EVENTS', []);
                store.dispatch('getBookings',{
                  callback: function(res){
                  }
                });
                // // 自身の予約
                // store.dispatch('getUserAgenda',{
                //   params: {
                //     from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                //     user_email: that.auth.email
                //   },
                // });
                store.dispatch('getUsers',function(e){
                  store.commit('SET_ISLOADING', false)
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
