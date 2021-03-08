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
        <v-list-item-subtitle class="mt-1">料金：¥<span class="ml-1">{{ item.price.toLocaleString() }}</span></v-list-item-subtitle>
        <!-- <v-list-item-title class="headline mb-1">
          {{ item.title }}<span v-if="item.isReserve" class="ml-2">さん</span>
        </v-list-item-title>
        <v-list-item-subtitle><span class="mr-2">{{ targetDate }}</span>{{ item.datetime }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="item.isReserve">{{ useType }}</v-list-item-subtitle>
        <v-list-item-subtitle><span class="sample">{{ item.description }}</span></v-list-item-subtitle> -->
        <!-- <v-btn
          outlined
          rounded
          text
          @click="deleteReservation"
        >
          予約取消
        </v-btn> -->
      </v-list-item-content>
      <!-- <v-list-item-avatar
        tile
        size="80"
        color="grey"
      ></v-list-item-avatar> -->
    </v-list-item>

    <v-card-actions class="justify-content-end p-0">
      <v-btn
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
      // item: {
      //   isReserve: false,
      //   studioName: 'aaa',
      //   datetime: '',
      //   description: ''
      // }
    }
  },
  computed: {
    // selectDate() {
    //   return store.state.selectDate;
    // },
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
    // this.title = this.selectDate+'の予約';
    // console.log('nu', this.auth.credit + this.item.price)
  },
  methods: {
    deleteReservation() {

      let that = this;
      // console.log(that.item.price)
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
                    // 自身の予約
                    store.dispatch('getUserAgenda',{
                      params: {
                        from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
                        user_email: that.auth.email
                      },
                    });
                    store.dispatch('getUsers',function(e){
                      store.commit('SET_ISLOADING', false)
                    });
                  },1200);
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
