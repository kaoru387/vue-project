<template>
  <v-card
    class="mx-auto text-left p-2 pl-3 pr-3 mb-5"
    max-width="344"
    outlined
  >
    <v-list-item three-line>
      <v-list-item-content>
        <div class="d-flex justify-content-between">
          <div class="font-weight-black overline mb-3" :style="{'text-transform':'capitalize'}">
            {{item.studioName}}
          </div>
          <div>
            <!-- <b-badge v-if="!item.isReserve" pill :style="{'background':item.iconColor}">フラメンコクラス</b-badge>
            <b-badge v-else pill class="badge-success">スタジオ予約</b-badge> -->
            <el-badge v-if="!item.isReserve" value="フラメンコクラス" class="item">
            </el-badge>
            <el-badge v-else value="スタジオ予約" class="item" type="success" />
          </div>
        </div>
        <v-list-item-title class="headline mb-1">
          {{ item.title }}<span v-if="item.isReserve" class="ml-2">さん</span>
        </v-list-item-title>
        <!-- <v-list-item-subtitle v-if="item.isReserve"><span class="mr-2">{{ useType }}</span>{{ item.description }}</v-list-item-subtitle>
        <v-list-item-subtitle v-else>{{ item.description }}</v-list-item-subtitle> -->
        <v-list-item-subtitle><span class="mr-2">{{ targetDate }}</span>{{ item.datetime }}</v-list-item-subtitle>
        <v-list-item-subtitle v-if="item.isReserve">{{ useType }}</v-list-item-subtitle>
        <v-list-item-subtitle><span class="sample">{{ item.description }}</span></v-list-item-subtitle>
        <!-- <v-list-item-subtitle v-if="item.isReserve" class="mt-1">ご予約いただきありがとうございます。</v-list-item-subtitle> -->
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
      <v-btn
        v-if="!item.isReserve"
        color="warning"
        dark
        rounded
        @click="applyExperience"
      >
        体験レッスン申し込み
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
      targetDate: ''
    }
  },
  computed: {
    selectDate() {
      return store.state.selectDate;
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
    this.title = this.selectDate+'の予約';
  },
  methods: {
    applyExperience() {
      this.$emit('apply',this.item);
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
              that.$emit('reLoad');
              // // 予約情報初期化
              // store.commit('SET_EVENTS', [])
              // // 予約取得
              // store.dispatch('getBookings')
              // // コザクラス
              // store.dispatch('getCapaKozaclass')
              // store.commit('SET_ISLOADING', false) 

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
