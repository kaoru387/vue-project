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
            <!-- <el-badge :value="item.studioName" class="item"></el-badge> -->
          </div>
        </div>
        <v-list-item-subtitle>{{ item.studioName }}</v-list-item-subtitle>
        <!-- <v-list-item-title class="headline mb-1">
          {{ item.title }}<span v-if="item.isReserve" class="ml-2">さん</span>
        </v-list-item-title>
        <v-list-item-subtitle><span class="mr-2">{{ targetDate }}</span>{{ item.datetime }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="item.isReserve">{{ useType }}</v-list-item-subtitle>
        <v-list-item-subtitle><span class="sample">{{ item.description }}</span></v-list-item-subtitle> -->
        <v-btn
          absolute
          dark
          fab
          center
          right
          color="pink"
          small
          @click="payment"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-list-item-content>
      <!-- <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar> -->
    </v-list-item>

    <v-card-actions class="justify-content-end pt-0">
      <v-btn
        :disabled="!isTarget"
        v-if="item.isReserve"
        outlined
        text
        @click="deleteReservation"
      >
        予約取消
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style scoped>
  .item {
    margin-top: 10px;
    margin-right: 0px;
  }
</style>
<script>
import store from '../store/app';
import axios from "axios"
import moment from "moment"

import Firebase from 'Firebase'
import firebase from "@firebase/app";
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe('pk_test_51I1LTfAXJN6gcxR4I1pw3tPbCXFUl8rnbbq0Wcl6dJhQkjb3ZuuASp8GlpCVTZLFfMn4TnWdkZm1nS52N99w5ch400f3oMXvxy');

export default {
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      loading: false,
      title: '',
      isTarget: false,
      useType: '',
      targetDate: '',
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
    payment() {
      store.commit('SET_ISLOADING', true)
      // console.log('pay',this.search.is_stripe)
      var currentUser = Firebase.auth().currentUser;

      let that = this;
      let _start = moment(that.item.start).format("YYYY-MM-DD HH:mm:ss");
      let _finish = moment(_start).add(Number(that.search.hour), 'h').format("YYYY-MM-DD HH:mm:ss");
      
      // スタジオコード取得
      let _resource_id = 794201;
      if(that.search.studio == "ナゴスタジオ") _resource_id = 794202;

      let parms = {
        start: _start,
        finish: _finish,
        resource_id: _resource_id,
        price: that.search.price,
        email: 'stripe@dummy.com',
      }

      // ポイント支払
      if(!that.search.is_stripe){
        if(!currentUser) {
          alert('ポイント精算エラー');
          return;
        }

        parms.email = currentUser.email;

        let credit = store.state.auth.credit.replace(/,/, '');
        credit = Number(credit) - that.search.price;
        const supersass = async function(documentName) {
          await store.dispatch('saveUser',{
            params: {
              credit: credit,
            },
            callback: function(res){
              // console.log('su',res)
              // 予約
              store.dispatch('addAppointment', {
                params: parms,
                callback: function(res2){
                  
                  that.$message({
                    type: 'success',
                    message: '予約に成功しました！ポイント精算',
                  });
                  setTimeout(function(){
                    // 予約
                    store.commit('SET_EVENTS', []);
                    store.dispatch('getBookings',{
                      callback: function(res){
                      }
                    });
                    // 自身の予約
                    store.dispatch('getUserAgenda',{
                      params: {
                        from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_email: store.state.auth.email
                      },
                    });

                    store.dispatch('getUsers',function(e){
                      store.commit('SET_AUTH', currentUser);
                      store.commit('SET_ISLOADING', false)
                      if(that.$route.path!=='/') that.$router.push({path: '/'});
                    })
                  },1000);
                }
              });
            }
          });
        }
        const all = async function() {
          await supersass()
        }
        all()
        return;
      }


      const processA = async function(documentName) {
        const _price_data = {
          currency: "jpy",
          product_data: {
            name: that.search.use_type,
          },
          unit_amount: that.search.price,
        };

        // Stripe Checkout
        const stripe = await stripePromise;
        const response = await firebase.functions().httpsCallable('postStripe');
        await response({
          // path: '/create-checkout-session-ticket',
          method: 'POST',
          params: {
            price_data: _price_data,
            quantity: 1,
          },
          mode: "payment",
          // success_url: "https://localhost:4006/?mode=stripeSuccess",
          success_url: "https://kdev.page/?mode=stripeSuccess",
          cancel_url: "https://www.fandangos-okinawa.com/reservation/?mode=stripeCancel",
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          const session = res.data;
          const sessionId = session.id;
          console.log(sessionId)

          // 一旦保持
          Firebase.db().collection("sessions").doc(parms.email)
          .set({
            sessionId: sessionId,
            params: parms,
            status: 'checkout'
          });

          const result = stripe.redirectToCheckout({
            sessionId: sessionId,
          });
          if (result.error) {
            console.log(result.error.message);
          }
        });
      }
      const processAll = async function() {
        await processA();
      }
      processAll();
      
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
  }
}
</script>
