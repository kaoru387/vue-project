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
      <!-- <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          More info about
        </td>
      </template> -->
      <template slot="no-data" class="p-3">
        <span class="g-font-size-13 g-color-gray-dark-v4">クラス予約はありません。</span>   
      </template>
      <template v-slot:item.date="{ item }">
        <span>{{ item.date }}</span>
        <span class="g-font-size-13 g-color-gray-dark-v4 ml-1">{{ item.datetime }}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <!-- <span>¥{{ item.price.toLocaleString() }}</span> -->
        <span v-if="!item.isPaid" class="g-color-gray-dark-v5">
          <span class="mr-2 g-font-size-12">未払い</span> ¥{{item.price.toLocaleString()}}
        </span>
        <span v-else class="pl-2">
          <v-icon small color="#03BFA5"
          >mdi-check-circle</v-icon>
        <span class="mr-2 g-font-size-12">支払済</span> ¥{{item.price.toLocaleString()}}
        </span>
      </template>
      <template v-slot:item.description="{ item }">
        <span class="g-font-size-12">{{ item.description }}</span>
      </template>
      <template v-slot:item.location="{ item }">
        <span class="g-font-size-12">{{ item.location }}</span>
      </template>
      <template v-slot:item.isEdit="{ item }">
        <v-btn
          v-if="!item.isPaid"
          class="mt-1 mb-1"
          outlined
          text
          color="indigo"
          :disabled="auth.credit<item.price"
          @click="confirmPayPoint(item)"
        >
          ポイント精算
        </v-btn>
        <v-btn 
          v-if="!item.isEdit"
          class="mt-1 mb-1" 
          :disabled="true"
          text>
          終了
        </v-btn>
        <el-button 
          v-else
          class="mt-1 mb-1"
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

    <!-- ポイント精算の確認 -->
    <v-dialog
      v-model="payconfirm"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">ポイント精算の確認</v-card-title>

        <v-card-text>
          本当にポイント精算してよろしいですか？
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
            color="success"
            outlined
            text
            @click="payPoint"
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
      // dialog: false,
      delconfirm: false,
      payconfirm: false,
      // used: {
      //   op1: false,
      // },
      // hours: 0,
      // minutes: 0,
      // isOption: false,
      // optionAmount: 0,
      // targetDate: '',
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
        { text: '' , sortable: false, value: 'isEdit' },
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
  },
  methods: {
    confirmDelete(item) { // 予約削除の確認
      this.item=item;
      this.delconfirm=true;
    },
    confirmPayPoint(item) { // ポイント精算の確認
      console.log(item);
      this.item=item;
      this.payconfirm=true;
    },
    payPoint() {
      store.commit('SET_ISLOADING', true);

      const that = this;
      let credit = that.auth.credit;
      credit = that.auth.credit - that.item.price;
      // console.logs(credit);

      store.dispatch('saveUser',{
        params: {
          credit: credit,
        },
        callback: function(res){
          console.log('save', res);

          // 予約
          store.dispatch('editClass', {
            params: {
              id: that.item.id,
              amount: that.item.price,
              resource_id: that.item.resource_id,
            },
            callback: function(res2){

              // ポイント更新
              store.commit('UPDATE_USER_CREDIT', credit);
             
              // データ取得
              setTimeout(function() {

                that.$message({
                  type: 'success',
                  message: 'ポイント精算完了しました。',
                });
                // 閉じる
                that.payconfirm=false;

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


                // // 支払済
                // that.used.op1=true;
                // that.isOption=true;
                // that.optionAmount=that.billingAmount;

                // // データ再取得
                // store.dispatch('getUsers', 
                //   function(e){
                //     // 予約取得
                //     store.commit('SET_EVENTS', []);
                //     // 予約取得
                //     store.dispatch('getBookings',{
                //       callback: function(res){
                //         // 検索終了
                //         store.commit('SET_IS_SEARCH', false);
                //         if(res) store.commit('SET_ISLOADING', false);
                //         // that.$router.push({path: '/about'});
                //       }
                //     });
                // });

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

      // store.dispatch('saveUser',{
      //   params: {
      //     credit: credit,
      //   },
      //   callback: function(res){

          // ポイント更新
          store.commit('UPDATE_USER_CREDIT', credit);
          store.dispatch('deleteAppointment',{
            params: {
              id: that.item.id,
              // created: moment(that.item.created).format("YYYY-MM-DD"),
              // start: that.item.start,
              // user_id: that.item.user_id,
              resourceId: that.item.resource_id,
            },
            callback: function(res) {

              console.log(res)

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

      //   }
      // });

    },
  }
}
</script>
