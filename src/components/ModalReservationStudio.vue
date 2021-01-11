<template>
  <el-dialog
    :title="info.isPersonal ? '個人利用のお客様' : 'グループ利用のお客様'"
    custom-class="dialog_category"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="100%"
    :style="{'margin':'0 auto','max-width':'360px'}"
    append-to-body
    @close="close"
    :loading="loading"
  >
  <h4 class="text-center text-primary mb-2">
    <strong>{{ selectDate }}</strong><span class="sample m-2">のご予約</span>
  </h4>
  <!-- <el-alert
    :closable="false"
    type="success"
    :title=title
    description="ご利用のタイプをお選びください。"
    show-icon>
  </el-alert> -->
  <div v-if="info.browser=='safari'">
    <el-alert
      class="mt-3 mb-3"
      type="error"
      description="申し訳ありません、ご使用のsafariブラウザではここで予約を行うことができません。別画面へ移動してください。"
      show-icon>
    </el-alert>
    <a v-if="info.isPersonal && !auth.general" :href='"https://schedule.kdev.page/api/login?m=1&account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから別画面へ移動します。</a>
    <a v-else-if="!info.isPersonal && !auth.general" :href='"https://schedule.kdev.page/api/login?account=susture&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum' target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから別画面へ移動します。</a>
    <a v-else-if="info.isPersonal && auth.general" :href='"https://schedule.kdev.page/api/login?account=susture&after=General&user[name]="+auth.email+"&checksum="+auth.checksum' target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから別画面へ移動します。</a>
    <a v-else-if="!info.isPersonal && auth.general" :href='"https://schedule.kdev.page/api/login?account=susture&after=General2&user[name]="+auth.email+"&checksum="+auth.checksum' target="_blank" rel="noreferrer" class="text-primary mb-3">こちらから別画面へ移動します。</a>
  </div>
  <!-- <div v-else hidden> -->
  <div v-else>
    <!-- ログイン -->
    <!-- <iframe v-if="info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum'></iframe>
    <iframe v-else-if="!info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum'></iframe>
    <iframe v-else-if="info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=General&user[name]="+auth.email+"&checksum="+auth.checksum'></iframe>
    <iframe v-else-if="!info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=General2&user[name]="+auth.email+"&checksum="+auth.checksum'></iframe> -->
    
  </div>
  
  <iframe v-if="info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum+"&view=day"' frameborder="0" width="100%" :height=height></iframe>
  <iframe v-else-if="!info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  <iframe v-else-if="info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=General&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  <iframe v-else-if="!info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=General2&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  <!-- 条件指定 -->
  <!-- <iframe v-if="info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/schedule/susture/StudioReservation?m=1&year="+year+"&month="+month+"&day="+day+"&view=day"' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="!info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/schedule/susture/GroupLessons?m=1&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="info.isPersonal && auth.general" :src='"https://schedule.kdev.page/schedule/susture/General?m=1&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="!info.isPersonal && auth.general" :src='"https://schedule.kdev.page/schedule/susture/General2?m=1&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe> -->


  
  <!-- {{info.isPersonal+'---'+auth.general}} -->
  <!-- <iframe v-if="info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height @load="onLoad"></iframe> -->
  
  <!-- Case2 -->
  <!-- <iframe v-if="info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=StudioReservation&user[name]="+auth.email+"&checksum="+auth.checksum+"&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="!info.isPersonal && !auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=GroupLessons&user[name]="+auth.email+"&checksum="+auth.checksum+"&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1&account=susture&after=General&user[name]="+auth.email+"&checksum="+auth.checksum+"&year="+year+"&month="+month+"&day="+day' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="!info.isPersonal && auth.general" :src='"https://schedule.kdev.page/api/login?m=1"+"&year="+year+"&month="+month+"&day="+day+"&account=susture&after=General2&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height @load="onLoad"></iframe> -->
  


  <!-- <iframe v-else-if="info.isPersonal && auth.general" :src='"https://schedule.kdev.page/schedule/susture/General?m=1"' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  <iframe v-else-if="!info.isPersonal && auth.general" :src='"https://schedule.kdev.page/schedule/susture/General2"' frameborder="0" width="100%" :height=height @load="onLoad"></iframe>
  -->
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
        height: window.innerHeight-100,
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
      handleChange(value) {
        console.log(value);
      },
      handleResize: function() {
        // resizeのたびにこいつが発火するので、ここでやりたいことをやる
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      },
      ready: function(){
        // console.log('set',date,this.selectDate)
      //   // 選択日付
        this.year = this.$moment(this.selectDate).format('yyyy');
        this.month = this.$moment(this.selectDate).format('MM');
        this.day = this.$moment(this.selectDate).format('DD');
      //   // this.selectDate=moment(date).format('YYYY年M月DD日');
      //   this.selectDate=date;
      //   store.commit('SET_SELECT_DATE', date);
        
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
    },
  }
</script>
