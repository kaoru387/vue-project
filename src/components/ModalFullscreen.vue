<template>
  <el-dialog
    title="スタジオ予約"
    custom-class="dialog_category"
    :visible="dialogFormVisible"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    width="90%"
    append-to-body
    @close="close"
    center fullscreen
  >
  <h4 class="text-center text-primary mb-4">
    <span class="sample mb-2">予約日：</span><strong>{{ selectDate }}</strong>
  </h4>
  <el-alert
    :closable="false"
    type="success"
    title="予約日のスタジオ予約"
    description="ご利用のタイプをお選びください。"
    show-icon>
  </el-alert>
  
  <div class="mt-4">
    <b-button block variant="outline-success" @click="general1">個人で利用する</b-button>
  </div>
  <div class="mt-3">
    <b-button block variant="outline-info" @click="general2">グループで利用する</b-button>
  </div>
  <el-divider class="mt-5 mt-3">会員専用</el-divider>
  <div class="mt-5">
    <b-button block variant="outline-warning" @click="login">ログインする</b-button>
  </div>
  <!-- <div class="mt-3">
    <b-button block variant="info">グループで利用する</b-button>
  </div> -->
  <!-- <el-collapse accordion>
    <el-collapse-item name="1">
      <template slot="title">
        ログイン
      </template>
      <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
      <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
    </el-collapse-item>
  </el-collapse> -->
  </el-dialog>
</template>

<script>
  import store from '../store/app';
  import { Dialog } from 'element-ui'
  import moment from "moment";
  import { mdiAccount,mdiKey } from '@mdi/js'

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
        // notifications: false,
        // sound: true,
        // widgets: false,
        // width: window.innerWidth,
        // height: window.innerHeight,
        // year: '2020',
        // month: '12',
        // day: '10',
        selectDate: '',
      }
    },
    mounted: function () {
      window.addEventListener('resize', this.handleResize)
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
      setDate: function(date){
        // 選択日付
        this.year = moment(date).format('yyyy');
        this.month = moment(date).format('MM');
        this.day = moment(date).format('DD');
        // this.selectDate=moment(date).format('YYYY年M月DD日');
        this.selectDate=date;
        store.commit('SET_SELECT_DATE', date);

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
      }
    },
  }
</script>
