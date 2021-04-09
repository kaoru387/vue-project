<template>
  <div :id='"my-container"+item.id' :style="{'border-color':'black !important'}">
    <v-list-item three-line>
      <v-list-item-content :id='"popover-reactive-"+item.id' :ref='"item"+item.id'>
        <v-list-item-subtitle class="d-flex justify-content-start">
          <p class="sample">{{ item.extendedProps.datetime+' '+item.title }}</p>
          <!-- <a v-if="item.extendedProps.isEdit && !item.extendedProps.isCard" class="text-decoration-underline sample" @click="deleteReservation">
            取消
          </a> -->
          <!-- <v-icon 
            class="pt-1"
            color="#03BFA5"
            :style="{'font-size':'10px !important'}"
          >{{ mdiRecordCircleOutline }}</v-icon> -->

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
    // confirm(item){
    //   this.$emit('confirm', item)
    // },
    deleteReservation() {

      let that = this;
      let price = that.item.extendedProps.price;
      // console.log(store.state.auth.credit, Number(price));
      this.$confirm('<strong class="text-left">本当に取消してもよろしいですか？</strong>', '予約取消', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'OK',
          type: 'warning',
          center: true,
        }).then(() => {
          store.commit('SET_ISLOADING', true)
          // ポイント戻す
          // let credit = store.state.auth.credit.replace(/,/, '');
          // credit = Number(credit) + Number(that.item.price.replace(/,/, ''));
          let credit = 0;
          credit = store.state.auth.credit + Number(price);
          console.log('credit', credit);
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
                    // 予約
                    store.commit('SET_EVENTS', []);
                    store.dispatch('getBookings',{
                      callback: function(res){
                        store.dispatch('getUsers',function(e){
                          that.$emit('close');
                          store.commit('SET_ISLOADING', false)
                        });
                      }
                    });
                    // // 自身の予約
                    // store.dispatch('getUserAgenda',{
                    //   params: {
                    //     from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                    //     user_email: that.auth.email
                    //   },
                    // });
                    
                  },1000);
                }
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
