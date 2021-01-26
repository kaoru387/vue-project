<template>
  <el-dialog
    :title="info.isPersonal ? '個人利用のお客様' : 'グループ利用のお客様'"
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
  <!-- {{ info.isPersonal + '/' + auth.isMember }} -->
  
  <!-- <div class="sample text-right mb-3">
    <span v-if="auth.username">{{ auth.username }}さん</span>
    <span v-else>ログインなし</span>
  </div> -->
  <!-- <div class="d-flex justify-content-between">
    <h6 class="text-center text-primary mt-2 ml-2">
      <strong>{{ selectDate }}</strong><span class="sample ml-1">のご予約</span>
    </h6>
    <button type="button" class="btn btn-light" @click="close">キャンセル</button>
  </div> -->
  
  <!-- <el-alert
    :closable="false"
    type="success"
    :title=title
    description="ご利用のタイプをお選びください。"
    show-icon>
  </el-alert> -->

    <div v-if="info.browser=='safari' && !info.isSafariLogin" class="mb-5">
      <el-alert
        class="mt-3 mb-3"
        type="error"
        description="申し訳ありません、ご使用のsafariブラウザでは再ログインが必要です。"
        show-icon>
      </el-alert>
      <a :href='supersass.host+"/login?m=1&account="+supersass.account+"&after=/form/susture/ss_login&user[name]="+auth.email+"&checksum="+auth.checksum' @click="onLinkClick" target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから再ログインお願いいたします。</a>
    </div>
    <div v-if="auth.isMember">
      <!-- ログイン必須 -->
      <iframe v-if="info.isPersonal" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
      <iframe v-else-if="!info.isPersonal" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
    </div>
    <div v-else>
      <!-- アカウントなし：ログイン不要 -->
      <iframe v-if="info.isPersonal && auth.email==''" :src='supersass.schedulePath+"/General?m=1"' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
      <iframe v-else-if="!info.isPersonal && auth.email==''" :src='supersass.schedulePath+"/General2?m=1"' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
      <!-- アカウントあり -->
      <iframe v-else-if="info.isPersonal && auth.email!=''" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=General&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
      <iframe v-else-if="!info.isPersonal && auth.email!=''" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=General2&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
    </div>
  </el-dialog>
  
</template>

<script>
  import store from '../store/app';
  import { Dialog } from 'element-ui'
  // import moment from "moment";
  // import { mdiAccount,mdiKey } from '@mdi/js'
  // import firebase from "firebase";

  export default {
    components: {
      'el-dialog': Dialog,
      // 'el-checkbox': Checkbox,
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
        dialog: false,
        // height: window.screen.height-100,
        year: '',
        month: '',
        day: '',
      }
    },
    computed: {
      loading() {
        return store.state.isLoading;
      },
      auth() {
        return store.state.auth;
      },
      selectDate() {
        return store.state.selectDate;
      },
      info() {
        return store.state.info;
      },
      height() {
        return window.innerHeight;
      },
      supersass() {
        return store.state.auth.supersass;
      },
    },
    mounted: function () {
      // window.addEventListener('resize', this.handleResize)
    },
    created: function () {
      // firebase.auth().onAuthStateChanged(function(user) {
      //   if (user) {
      //     // console.log('singin',user)
      //     // User is signed in.
      //   } else {
      //     // No user is signed in.
      //     console.log('no singin')
      //   }
      // });
    },
    methods: {
      // handleResize: function() {
      //   // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      //   this.width = window.innerWidth;
      //   this.height = window.innerHeight;
      // },
      ready: function(){
        // 選択日付
        this.year = this.$moment(this.selectDate).format('yyyy');
        this.month = this.$moment(this.selectDate).format('MM');
        this.day = this.$moment(this.selectDate).format('DD');
      //   // this.selectDate=moment(date).format('YYYY年M月DD日');
      //   this.selectDate=date;
      //   store.commit('SET_SELECT_DATE', date);

      // console.log("https://www.supersaas.com/api/login?m=1&account=susture&after=/schedule/susture/StudioReservation&user[name]="+this.auth.email+"&checksum="+this.auth.checksum)
        
      },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
      login(){
        this.$router.push({path: '/login'});
      },
      general1(){
        this.$router.push({path: '/general1'});
      },
      general2(){
        this.$router.push({path: '/general2'});
      },
      onLoad() {
        
      },
      onLinkClick() {
        store.commit('SET_SAFARI_LOGIN', true)
        this.closeModal();
      }
    },
  }
</script>
