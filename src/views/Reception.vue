  <template>
    <div class="g-mb-50 g-mb-50">
      <el-page-header @back="drawerOpen" content="参加者募集" title="戻る" class="pt-3 pl-1 pb-2"></el-page-header>
      <header class="text-center g-width-60x--md mx-auto g-mt-10 g-mb-20">
        <h2 class="h3 u-heading-v2__title g-color-gray-dark-v2 text-uppercase g-font-weight-700">申込み内容の確認</h2>
      </header>
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
            <p class="mt-1 g-font-size-12">{{item.location}}</p>
          </v-card-text>

          <v-list-item class="text-right mt-4 mb-3">
            <v-list-item-subtitle class="g-font-size-18 font-weight-bold g-color-primary pr-4">支払合計：¥{{ item.price }}</v-list-item-subtitle>
          </v-list-item>
          <v-divider class="mx-4"></v-divider>

         <v-card-actions class="justify-content-center">
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
                <!-- <el-button class="p-3" :style="{'width':'100%'}"
                  @click="confirmExecute('現地払い')" 
                  :loading="loading">
                  現地払い
                </el-button> -->
              </div>
            </div>
          </div>
        </v-card-actions>

      </v-card>

    <!-- 実行確認 -->
    <v-dialog
      v-model="isExecute"
      max-width="360"
    >
      <v-card class="pb-3">
       <v-card-title>{{ title }}確認</v-card-title>

        <v-card-text class="justify-content-between">
          参加申込みありがとうございます。{{ title }}を実行してよろしいですか？
        </v-card-text>

        <v-card-actions class="justify-content-center mt-3">
          <v-btn
            outlined
            text
            @click.stop="isExecute = false"
          >
            キャンセル
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
import _ from 'lodash';

export default {
  props: {
    items: { 
      type: Array, 
      default: () => {} 
    },
  },
  data() {
    return {
      resource_id: 563549,
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
  },
  computed: {
    loading() {
      return store.state.isLoading;
    },
    auth() {  
      return store.state.auth;
    },
    receptionId() {
      return store.state.receptionId;
    },
    classes() {
      return store.state.result.classes;
    },
    supersass() {
      return store.state.auth.supersass;
    },
  },
  beforeRouteEnter (to, from, next) {
    //ページの更新
    // console.log('beforeRouteEnter /r', store.state.backuri, '-' , to.fullPath);
    if(to.fullPath=='/reception') {
      store.commit('SET_BACK_URI', '');
      next();
    }
  },
  created: function () {

    // 対象データ取得
    let that = this;
    let index =_.findIndex(this.classes, function(o) { 
      return o.id == that.receptionId; 
    })

    if(index != -1){
      that.item=that.classes[index]
    }
    store.commit('SET_ISLOADING', false);
  },
  mounted() {
  },
  methods: {
    drawerOpen() {
      store.commit('SET_BACK_URI', '/backReception');
      this.$router.push({path: '/'});
    },
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

      let url = this.supersass.baseHost;
      let that = this;

      // 金額を数値変換
      let _price = 0;
      if(3<that.item.price.length){
        _price = Number(that.item.price.replace(/,/, ''));
      }else{
        _price = Number(that.item.price);
      }

      let params = {
        'schedule_id': that.resource_id,
        // 'booking[full_name]': that.supersass.account,
        'booking[full_name]': '一般',
        'booking[slot_id]': that.item.id,
        'booking[field_1]': _price,
        'booking[field_2]': that.item.title,
        'booking[address]': 'PayPay決済',
        'booking[super_field]': '',
      }
      // console.log(params);
      store.dispatch('getPayPay', {
          params: {
            merchantPaymentId: '',
            amount: {
              amount: _price,
              currency: "JPY"
            },
            codeType: "ORDER_QR",
            orderDescription: that.item.title,
            isAuthorization: false,
            redirectUrl: url+"/?mode=successPayPay",
            redirectType: "WEB_LINK",
          },
          callback: function(res){
            // console.log(res)

            // 支払ID取得
            let session = {
              merchantPaymentId: res.merchantPaymentId,
              codeId: res.codeId,
              params: params
            };
            store.commit('PAYPAY_SESSION', session);
            console.log('session!!!')
            window.location.href = res.url;             
          }
      });

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
