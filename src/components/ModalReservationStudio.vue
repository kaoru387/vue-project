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
  <!-- {{ info.browser+'/'+info.isPersonal + '/' + info.isSafariLogin  + '/' + auth.email}} -->
    <!-- <div class="text-center mb-1">
      <a class="text-decoration-underline" :style="{'color':'blue !important'}" rel="noreferrer" @click="onLinkClick">
        キャンセル
      </a>
    </div> -->

    <!-- 会員専用：個人利用 -->
    <iframe v-if="info.isPersonal" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%AA%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB%EF%BC%88%E5%80%8B%E4%BA%BA%E5%88%A9%E7%94%A8%EF%BC%89&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
    <!-- 会員専用：団体利用 -->
    <iframe v-else-if="!info.isPersonal" :src='supersass.host+"/login?m=1&account="+supersass.account+"&after=%E3%82%B9%E3%82%BF%E3%82%B8%E3%82%AA%E3%83%AC%E3%83%B3%E3%82%BF%E3%83%AB%EF%BC%88%E5%9B%A3%E4%BD%93%E5%88%A9%E7%94%A8%EF%BC%89&user[name]="+auth.email+"&checksum="+auth.checksum' frameborder="0" width="100%" :height=height></iframe>
  
  
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
        isSafariLogin: false,
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
      this.isSafariLogin = localStorage.getItem('isSafariLogin');
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
      // general1(){
      //   this.$router.push({path: '/general1'});
      // },
      // general2(){
      //   this.$router.push({path: '/general2'});
      // },
      onLinkClick() {
        this.close()
        store.commit('SET_SAFARI_LOGIN', true)
        this.$emit('reload');
      }
    },
  }
</script>
