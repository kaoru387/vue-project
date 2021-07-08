<template>
  <div>
    <div class="text-right pt-3 pb-3">
      <span class="mr-3">入会金：¥{{ sales_amount.toLocaleString() }}</span>
      <span class="mr-3">チケット購入：¥{{ amount.toLocaleString() }}</span>
      <span>スタジオ利用：¥{{ amount.toLocaleString() }}</span>
    </div>
    <v-data-table
      dense
      :headers="headers"
      :items="datas"
      :search="search"
      class="m-1"
    >
      <td :colspan="headers.length">
        More info about {{ item }}
      </td>
    </v-data-table>
  </div>
</template>
<!-- .toLocaleString() -->
<script>
import store from '../store/app';
import moment from "moment-timezone"
import _ from 'lodash';
import Firebase from 'Firebase'
import firebase from "@firebase/app";

export default {
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      search: '',
      headers: [
        { text: 'No' },
        {
          text: '日付',
          align: 'start',
          value: 'date',
        },
        { text: '説明', align: 'start', value: 'product_name' },
        { text: '金額', align: 'start', sortable: false, value: 'price' },
      ],
      datas: [],
      amount: 0,
      sales_amount: 0,
    }
  },
  watch: {
  },
  mounted: function () {
    
  },
  computed: {
    auth() {
      return store.state.auth;
    },
    bookings() {
      return store.state.result.bookings;
    },
    // charges() {
    //   return store.state.result.charges;
    // },
  },
  created: function () {
    console.log('customer!',this.item)
    let that = this;
    // 予約
    // var washingtonRef = Firebase.db().collection("balances").doc(that.item.name);
    // console.log(washingtonRef);
    // washingtonRef.update({
    //      bookings: firebase.firestore.FieldValue.arrayUnion({
    //        product_name: v['product_name'],
    //        date: v['date'],
    //        price: v['price'],
    //        start: v['start'],
    //        finish: v['finish'],
    //        created: v['created'],
    //      })
    // });
    
    _.forEach(that.bookings, function(v, k) {
      if(that.item.name == v.email){
        that.amount += Number(v.price);
        that.datas.push({
          id: v.id,
          date: v.date,
          price: v.price.toLocaleString(),
          product_name: v.product_name,
        })
      }
    })

    // 購入
    _.forEach(that.charges, function(v, k) {
      // console.log(v.created)
      // const t = new Date(v.created);
      // unixtimeはミリなので1000倍
      // console.log(that.$moment(v.created * 1000).format('YYYY-MM-DD'));
      if(that.item.name == v.billing_details.email){
        that.sales_amount += Number(v.amount);
        that.datas.push({
          id: v.id,
          date: that.$moment(v.created * 1000).format('YYYY-MM-DD'),
          price: v.amount.toLocaleString(),
          product_name: v.payment_intent,
        })
      }
    })
    
    // let today = this.$moment().format('YYYY-MM-DD');
    // let target_date = moment(this.item.start).utc().format("YYYY-MM-DD");
    // if(today<=target_date){
    //   if(this.item.extendedProps.user_id==this.auth.user_id) this.isTarget=true;
    // }
  },
  methods: {
    onClose() {
      this.popoverShow = false
    },
    onOk() {
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
            // resource_id: that.item.resource_id,
          },
          callback: function(res){

            // 完了メッセージ
            that.$message({
              type: 'success',
              message: '予約を取消しました。',
            });

            store.commit('SET_ISLOADING', true)
            const processA = async function() {
              await store.commit('SET_EVENTS', []);
              // 予約取得
              await store.dispatch('getBookings',{
                callback: function(res){
                  console.log(res)
                  store.commit('SET_ISLOADING', false)
                }
              });
              // クラス取得
              await store.dispatch('getClass',{})
            }
            const processAll = async function() {
              await processA()

            }
            processAll()

          }
        });
      }).catch(() => {
        that.$message({
          type: 'info',
          message: '予約取消キャンセルしました。'
        });          
      });
    },
    onShow() {
      // This is called just before the popover is shown
      // Reset our popover form variables
      this.input1 = ''
      this.input2 = ''
      this.input1state = null
      this.input2state = null
      this.input1Return = ''
      this.input2Return = ''
    },
    onShown() {
      // Called just after the popover has been shown
      // Transfer focus to the first input
      // this.focusRef(this.$refs.input1)
    },
    onHidden() {
      // Called just after the popover has finished hiding
      // Bring focus back to the button
      // this.focusRef(this.$refs.button)
    },
    focusRef(ref) {
      // console.log(ref)
      // Some references may be a component, functional component, or plain element
      // This handles that check before focusing, assuming a `focus()` method exists
      // We do this in a double `$nextTick()` to ensure components have
      // updated & popover positioned first
      
      // this.$nextTick(() => {
      //   this.$nextTick(() => {
      //     ;(ref.$el || ref).focus()
      //   })
      // })
    }
  }
}
</script>
