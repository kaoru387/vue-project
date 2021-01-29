<template>
  <el-dialog
    title="体験レッスン申し込み"
    custom-class="dialog_course"
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
  <!-- <div class="text-center mb-2">
    <a class="text-decoration-underline" :style="{'color':'blue !important'}" rel="noreferrer" @click="onLinkClick">
      キャンセル
    </a>
  </div> -->
  <div v-if="info.browser=='safari' && !info.isSafariLogin && auth.email!==''" class="mb-5">
    <el-alert
      class="mt-3 mb-3"
      type="error"
      description="申し訳ありません、ご使用のsafariブラウザでは再ログインが必要です。"
      show-icon>
    </el-alert>
    <a :href='supersass.host+"/login?m=1&account="+supersass.account+"&user[name]="+auth.email+"&checksum="+auth.checksum+"&after=/schedule/susture/"+studioName+"/"+reservationId+"?m=1"' @click="onLinkClick" rel="noreferrer" class="text-primary mb-3">こちらから再ログインお願いいたします。</a>
  </div>
  <div v-else>
    <el-alert
        :closable="false"
        class="text-left mt-1 mb-3"
        type="info"
        description="新規予約作成してください。"
        show-icon>
    </el-alert>
    <iframe :src='supersass.schedulePath+"/"+studioName+reservationId+"?m=1"' frameborder="0" width="100%" :height=height></iframe>
  </div>
  </el-dialog>
</template>

<script>
  import store from '../store/app';
  import { Dialog } from 'element-ui'
  export default {
    components: {
      'el-dialog': Dialog,
    },
    props: {
      dialogFormVisible: {
        type: Boolean,
        default: false,
      },
      closeModal: {
        type: Function,
        default: function () {},
      },
      title: {
        type: String,
        default: '体験レッスン',
      },
    },
    data () {
      return {
        reservationId: 0,
        studioName: '%E3%82%B3%E3%82%B6%E3%82%AF%E3%83%A9%E3%82%B9/',
        // year: '',
        // month: '',
        // day: '',
        // 入力規則
        required: value => !!value || "必ず入力してください", // 入力必須の制約
        limit_length: value => value.length <= 10 || "10文字以内で入力してください" // 文字数の制約
      }
    },
    created: function(){
      // this.year = this.$moment(this.selectDate).utc().format('yyyy');
      // this.month = this.$moment(this.selectDate).utc().format('MM');
      // this.day = this.$moment(this.selectDate).utc().format('DD');
    },
    computed: {
      loading() {
        return store.state.isLoading;
      },
      height() {
        return window.screen.height;
      },
      auth() {
        return store.state.auth;
      },
      info() {
        return store.state.info;
      },
      supersass() {
        return store.state.auth.supersass;
      },
      // selectDate() {
      //   return store.state.selectDate;
      // },
    },
    mounted: function () {
      // console.log(window.screen.height)
      // window.addEventListener('resize', this.handleResize)
    },
    methods: {
      // handleResize: function() {
      // //   // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      // //   this.width = window.innerWidth;
      //   this.height = window.innerHeight;
      // },
      ready(item) {
        // console.log(item)
        this.reservationId=item.id;
        if(item.studioName=="ナゴスタジオ") this.studioName="%E3%83%8A%E3%82%B4%E3%82%AF%E3%83%A9%E3%82%B9/";
        // // 選択日付
        // this.year = this.$moment(this.selectDate).format('yyyy');
        // this.month = this.$moment(this.selectDate).format('MM');
        // this.day = this.$moment(this.selectDate).format('DD');
      },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
      onLinkClick() {
        this.close()
        store.commit('SET_SAFARI_LOGIN', true)
        this.$emit('reLoad');
      }
    },
  }
</script>
