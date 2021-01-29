<template>
  <el-dialog
    title="商品購入"
    custom-class="dialog_shop"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="95%"
    append-to-body
    @close="closeModal"
    :style = "{'max-width':'375px','margin': '20px auto'}"
    center
  >
  <div v-if="info.browser=='safari' && !info.isSafariLogin" class="mb-5">
    <el-alert
      class="mt-3 mb-3"
      type="error"
      description="申し訳ありません、ご使用のsafariブラウザでは再ログインが必要です。"
      show-icon>
    </el-alert>
    <a :href='supersass.host+"/login?m=1&account="+supersass.account+"&user[name]="+auth.email+"&checksum="+auth.checksum+"&after=/shop/buy/susture"' @click="onLinkClick" target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから再ログインお願いいたします。</a>
  </div>
  <div v-else>
    <el-alert
        :closable="false"
        class="text-left mt-1 mb-1"
        type="info"
        description="ご希望の商品をお選びいただき、決済購入お願いいたします。"
        show-icon>
    </el-alert>
    <!-- <div class="text-right mb-1">
      <button type="button" class="btn btn-light" @click="close">キャンセル</button>
    </div> -->
    <div class="text-center mb-1">
      <a class="text-decoration-underline" :style="{'color':'blue !important'}" rel="noreferrer" @click="onLinkClick">
        キャンセル
      </a>
    </div>
    <iframe :src='supersass.host+"/login?account="+supersass.account+"&after=/shop/buy/susture&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  </div>
  </el-dialog>
</template>

<script>
  import store from '../store/app';
  export default {
    components: {
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
    },
    data () {
      return {
      }
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
    },
    mounted: function () {
      // window.addEventListener('resize', this.handleResize)
    },
    methods: {
      // handleResize: function() {
      //   // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      //   this.width = window.innerWidth;
      //   this.height = window.innerHeight;
      // },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
      onLinkClick() {
        this.close()
        this.$emit('reLoad');
      }
    },
  }
</script>
