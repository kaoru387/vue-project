<template>
  <v-container fluid>
    <h4 class="pl-3">個人利用</h4>
    <v-alert
      text
      type="info"
    >
      <span class="sample">予約日：</span><strong class="mr-2">{{ selectDate }}</strong>
    </v-alert>
    <el-alert
      class="mb-3"
      type="success"
      description="スタジオと時間を選択して、予約作成してください。"
      show-icon>
    </el-alert>
    <div class="p-0 text-right mr-2 mb-2">
      <router-link to="/">キャンセル</router-link>
    </div>
    <iframe :src='"https://www.supersaas.jp/schedule/susture/General?year="+year+"&month="+month+"&day="+day+"&view=day"' width="100%" :height=height></iframe>
  </v-container>
</template>

<script>
  import store from '../store/app';
  import moment from "moment";

  export default {
    data: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
      year: moment(store.state.selectDate).format('yyyy'),
      month:  moment(store.state.selectDate).format('MM'),
      day:  moment(store.state.selectDate).format('DD'),
    }),
    computed: {
      selectDate() {
        return store.state.selectDate;
      }
    },
  }
</script>
