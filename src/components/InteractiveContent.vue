<template>
  <div :id='"my-container"+item.id' :style="{'border-color':'black !important'}">
      <v-list-item three-line>
        <v-list-item-content :id='"popover-reactive-"+item.id' :ref='"item"+item.id' @click="confirm(item.extendedProps)">
          <v-list-item-subtitle class="d-flex justify-content-start">
            <v-icon 
              class="pt-1"
              color="#03BFA5"
              :style="{'font-size':'10px !important'}"
            >{{ mdiRecordCircleOutline }}</v-icon>
            <p class="sample">{{ item.extendedProps.datetime+' '+item.title }}</p>
            <!--<p v-if="item._context.viewApi.type!='dayGridMonth'">
              {{ item.extendedProps.datetime }}<span class="pl-2">{{ item.extendedProps.studioName }}</span>
            </p> -->
            <!-- <i v-if="item._context.viewApi.type=='timeGridDay'" class="el-icon-circle-plus-outline ml-2" :style="{'color':'#F56C6C','font-weight': 800}" @click="payment(item.extendedProps)"></i> -->
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
  </div>
</template>

<script>
import store from '../store/app';
import moment from "moment"
import _ from 'lodash';
import { mdiRecordCircleOutline } from '@mdi/js'

// import Firebase from 'Firebase'
// import firebase from "@firebase/app";
// import axios from 'axios';
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_51HU17xEL8vDvw6C3KK8sAW82ZkUnlLo7pRjQWkoiMNjjJiiaHOsL6uEpaO7URE55CGJAu3KIxOIy06azOtFVxp8J006cwjspAu');

export default {
  props: {
    item: { 
      type: Object, 
      default: () => {} 
    },
  },
  data() {
    return {
      mdiRecordCircleOutline
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
    search() {
      return store.state.search;
    }
  },
  created: function () {
    // console.log(this.item)
    // let today = this.$moment().format('YYYY-MM-DD');
    // let target_date = moment(this.item.start).utc().format("YYYY-MM-DD");
    // if(today<=target_date){
    //   if(this.item.extendedProps.user_id==this.auth.user_id) this.isTarget=true;
    // }
  },
  methods: {
    confirm(item){
      this.$emit('confirm', item)
    }
    // onClose() {
    //   this.popoverShow = false
    // },
    // onOk() {
    //   let that = this;
    //   this.$confirm('<strong class="text-left">本当に取消してもよろしいですか？</strong>', '予約取消', {
    //     dangerouslyUseHTMLString: true,
    //     confirmButtonText: 'OK',
    //     type: 'warning',
    //     center: true,
    //   }).then(() => {
    //     // store.commit('SET_ISLOADING', true)
    //     store.dispatch('deleteAppointment',{
    //       params: {
    //         id: that.item.id,
    //         created: moment(that.item.created).format("YYYY-MM-DD"),
    //         start: that.item.start,
    //         user_id: that.item.user_id,
    //         // resource_id: that.item.resource_id,
    //       },
    //       callback: function(res){

    //         // 完了メッセージ
    //         that.$message({
    //           type: 'success',
    //           message: '予約を取消しました。',
    //         });

    //         store.commit('SET_ISLOADING', true)
    //         const processA = async function() {
    //           await store.commit('SET_EVENTS', []);
    //           // 予約取得
    //           await store.dispatch('getBookings',{
    //             callback: function(res){
    //               console.log(res)
    //               store.commit('SET_ISLOADING', false)
    //             }
    //           });
    //           // クラス取得
    //           await store.dispatch('getClass',{})
    //         }
    //         const processAll = async function() {
    //           await processA()

    //         }
    //         processAll()

    //       }
    //     });
    //   }).catch(() => {
    //     that.$message({
    //       type: 'info',
    //       message: '予約取消キャンセルしました。'
    //     });          
    //   });
    // },
    // onShow() {
    //   // This is called just before the popover is shown
    //   // Reset our popover form variables
    //   this.input1 = ''
    //   this.input2 = ''
    //   this.input1state = null
    //   this.input2state = null
    //   this.input1Return = ''
    //   this.input2Return = ''
    // },
    // onShown() {
    //   // Called just after the popover has been shown
    //   // Transfer focus to the first input
    //   // this.focusRef(this.$refs.input1)
    // },
    // onHidden() {
    //   // Called just after the popover has finished hiding
    //   // Bring focus back to the button
    //   // this.focusRef(this.$refs.button)
    // },
    // focusRef(ref) {
    //   // console.log(ref)
    //   // Some references may be a component, functional component, or plain element
    //   // This handles that check before focusing, assuming a `focus()` method exists
    //   // We do this in a double `$nextTick()` to ensure components have
    //   // updated & popover positioned first
      
    //   // this.$nextTick(() => {
    //   //   this.$nextTick(() => {
    //   //     ;(ref.$el || ref).focus()
    //   //   })
    //   // })
    // },
    
  }
}
</script>
