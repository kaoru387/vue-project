<template>
  <el-dialog
    title="内容確認"
    custom-class="dialog_category"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    append-to-body
    @close="close"
    :loading="loading"
    width="95%"
    :style = "{'max-width':'375px','margin': '20px auto'}"
    center
  >
    <!-- <span class="font-weight-medium " :style="{'font-size':'20px'}">{{ targetDate + ' ' + item.datetime }}</span> -->
    <div class="d-flex flex-column bd-highlight m-0 mb-3 text-center">
      <div class="p-0 bd-highlight">
        <h4>{{ targetDate }}</h4>
      </div>
      <div class="p-0 bd-highlight">
        <span class="font-weight-medium" :style="{'font-size':'18px'}">{{ item.datetime }}</span>
      </div>
    </div>
    <v-card
      class="mx-auto text-left p-2 mb-1"
      max-width="344"
      outlined
    >
      <v-list-item three-line>
        <v-list-item-content>
          <div class="d-flex justify-content-between mb-2">
            <div>
              <div class="d-flex flex-column bd-highlight m-0">
                <div class="font-weight-medium pt-2" :style="{'text-transform':'capitalize','font-size':'20px'}">
                  {{ item.studioName }}
                </div>
              </div>
            </div>
            <div>
              <div class="d-flex flex-column bd-highlight m-0 text-right">
                <el-badge v-if="auth.username=='' || !auth.isLine" type="danger" class="pt-2 pr-2 bd-highlight" :value="'一般のお客様'"></el-badge>
                <el-badge v-else class="pt-2 pr-2 bd-highlight" type="success" :value="'会員様'"></el-badge>
                <span v-if="auth.username!=='' && auth.isLine" class="p-0 bd-highlight sample">ポイント：{{ auth.credit }}</span></span>
              </div>
            </div>
          </div>
          <v-list-item-subtitle class="mt-1">利用時間：{{ item.hour }}時間</span></v-list-item-subtitle>
          <v-list-item-subtitle class="mt-1">利用ﾀｲﾌﾟ：{{ item.use_type }}</span></v-list-item-subtitle>
          <!-- .toLocaleString() -->
          <v-list-item-title>レンタル料金：¥{{ item.price }}</v-list-item-title>
        </v-list-item-content>
        <v-list-item-avatar
          class="m-0"
          tile
          size="100"
          color="grey"
        >
          <img
            v-if="item.studioName=='ナゴスタジオ'"
            src="http://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_nag.jpg"
            alt="ナゴスタジオ">
          <img
            v-else
            src="http://www.fandangos-okinawa.com/wordpress/wp-content/uploads/2016/10/img_cdd.jpg"
            alt="コザスタジオ">
        </v-list-item-avatar>
      </v-list-item>

      <v-card-actions class="justify-content-end pb-3">
        <el-button v-if="search.is_stripe" :style="{'width':'100%'}" type="primary" @click="payment">
          予約・カード決済する
        </el-button>
        <el-button v-else :style="{'width':'100%'}" type="success" @click="payoff">
          予約・ポイント精算する
        </el-button>
      </v-card-actions>
    </v-card>
  </el-dialog>
</template>

<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"
import { Dialog } from 'element-ui'

// import Firebase from 'Firebase'
// import firebase from "@firebase/app";
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');

export default {
  components: {
    'el-dialog': Dialog,
  },
  props: {
    dialogFormVisible: {
      type: Boolean,
      default: false,
    },
    item: { 
      type: Object, 
      default: () => {} 
    },
    closeModal: {
      type: Function,
      default: function () {},
    },
  },
  data() {
    return {
      loading: false,
      title: '',
      isTarget: false,
      useType: '',
      targetDate: '',
      form: {
        hour: '',
        use_type: ''
      }
    }
  },
  computed: {
    search() {
      return store.state.search;
    },
    auth() {
      return store.state.auth;
    },
  },
  created: function () {
    this.form.hour = this.search.hour;
    this.form.use_type = this.search.use_type;

    // 過去データは取消不可
    // console.log(this.$moment().format('YYYY-MM-DD'), this.item.start)
    if(this.$moment().format('YYYY-MM-DD')<=this.item.start){
      if(this.item.user_id==this.auth.user_id) this.isTarget=true;
    }
    this.targetDate = moment(this.item.start).utc().format("MM月DD日")
    this.useType = this.item.use_type
  },
  mounted() {
    
  },
  methods: {
    applyExperience() {
      this.$emit('apply',this.item);
    },
    payoff() { // ポイント精算

      // this.$confirm('<strong class="text-left">レンタル料金をポイントから精算処理してもよろしいですか？</strong>', 'ポイント精算', {
      //     dangerouslyUseHTMLString: true,
      //     confirmButtonText: 'OK',
      //     type: 'info',
      //     center: true,
      //   }).then(() => {

      //     store.commit('SET_ISLOADING', true)
          
      //     let that = this;
      //     var currentUser = Firebase.auth().currentUser;
      //     if(!currentUser) {
      //       alert('ポイント精算エラー');
      //       return;
      //     }

      //     let _start = moment(that.item.start).format("YYYY-MM-DD HH:mm:ss");
      //     let _finish = moment(_start).add(Number(that.search.hour), 'h').format("YYYY-MM-DD HH:mm:ss");
          
      //     // スタジオコード取得
      //     let _resource_id = 794201;
      //     if(that.search.studio == "ナゴスタジオ") _resource_id = 794202;

      //     let parms = {
      //       start: _start,
      //       finish: _finish,
      //       resource_id: _resource_id,
      //       price: that.search.price,
      //       email: currentUser.email
      //     }

      //     let credit = store.state.auth.credit.replace(/,/, '');
      //     credit = Number(credit) - that.search.price;
      //     const supersass = async function(documentName) {
      //       await store.dispatch('saveUser',{
      //         params: {
      //           credit: credit,
      //         },
      //         callback: function(res){
      //           // console.log('su',res)
      //           // 予約
      //           store.dispatch('addAppointment', {
      //             params: parms,
      //             callback: function(res2){
                    
      //               that.$message({
      //                 type: 'success',
      //                 message: '予約に成功しました！ポイント精算',
      //               });
      //               setTimeout(function(){
      //                 // 予約
      //                 store.commit('SET_EVENTS', []);
      //                 store.dispatch('getBookings',{
      //                   callback: function(res){
      //                   }
      //                 });
      //                 // 自身の予約
      //                 store.dispatch('getUserAgenda',{
      //                   params: {
      //                     from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
      //                     user_email: store.state.auth.email
      //                   },
      //                 });
      //                 store.dispatch('getUsers',function(e){
      //                   store.commit('SET_AUTH', currentUser);
      //                   store.commit('SET_ISLOADING', false)
      //                   if(that.$route.path!=='/') that.$router.push({path: '/'});
      //                 })
      //               },1000);
      //             }
      //           });
      //         }
      //       });
      //     }
      //     const all = async function() {
      //       await supersass()
      //     }
      //     all();
      // }).catch(() => {
      // });

    },
    payment() { //カード決済
      this.$emit('payment')

    },
    deleteReservation() {
      let that = this;
      this.$confirm('<strong class="text-left">本当に取消してもよろしいですか？</strong>', '予約取消', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'OK',
          type: 'warning',
          center: true,
        }).then(() => {
          // store.commit('SET_ISLOADING', true)
          store.dispatch('deleteAppointment',{
            params: {
              id: that.item.id,
              created: moment(that.item.created).format("YYYY-MM-DD"),
              start: that.item.start,
              user_id: that.item.user_id,
              resource_id: that.item.resource_id,
            },
            callback: function(res){
              // that.$emit('reLoad');
              // 完了メッセージ
              that.$message({
                type: 'success',
                message: '予約を取消しました。',
              });
            }
          });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '予約取消キャンセルしました。'
          });          
        });
    },
    close () {
      this.closeModal();
      this.$el.scrollTo(0,0);
    },
  }
}
</script>
