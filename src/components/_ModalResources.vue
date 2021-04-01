<template>
  <el-dialog
    title="利用可能時間検索"
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
    <!-- <el-alert
      class="mt-3 mb-3"
      type="info"
      description="予約内容を入力してください。"
      show-icon>
    </el-alert> -->
    <validation-observer ref="obs" v-slot="ObserverProps">
      <div class="form-row">
        <div class="col-7 mb-0">
          <div class="filed">
            <span class="demonstration">予約日：</span>
            <validation-provider name="予約日" rules="required" v-slot="prop">
              <v-text-field name="予約日" v-model="form.date" single-line>
                <template v-slot:append-outer>
                  <date-picker v-model="form.date"/>
                </template>
              </v-text-field>
              <span :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
            </validation-provider>
          </div>
        </div>
        <div class="col-5 mb-0"> 
          <div class="filed">
            <span class="demonstration">入室時間：</span>
            <validation-provider name="入室時間" rules="required" v-slot="prop">
              <span :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
            </validation-provider> 
          </div>
        </div>
        <div class="col-12 mb-0">
          <div class="filed">
            <span class="demonstration">利用タイプ：</span>
            <validation-provider name="利用タイプ" rules="required" v-slot="prop">
              <v-autocomplete
                name="利用タイプ"
                v-model="form.use_type"
                :items="type_options"
                dense
                filled
                label="Filled"
              ></v-autocomplete>
              <span :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
            </validation-provider> 
          </div>
        </div>
        <div class="col-12 mb-0">
          <div class="filed">
            <span class="demonstration">時間枠：</span>
            <validation-provider name="時間枠" rules="required" v-slot="prop">
              <el-select name="時間枠" v-model="form.time_zone" placeholder="時間枠選択" :style="{'width':'100%'}">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <span :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
            </validation-provider> 
          </div>
        </div>
        <div class="col-12 mb-0">
          <div class="filed">
            <span class="demonstration">利用スタジオ：</span>
            <validation-provider name="スタジオ" rules="required" v-slot="prop">
              <el-select name="スタジオ" v-model="form.studio" placeholder="スタジオ選択" :style="{'width':'100%'}">
                <el-option
                  v-for="item in studio_options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  :disabled="item.disabled">
                </el-option>
              </el-select>
              <span :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
            </validation-provider> 
          </div>
        </div>

        <div class="col-12 mb-0">
          <div class="block">
            <el-button class="mt-2 mb-2" type="success" :style="{'width': '100%'}" @click="search" :disabled="!ObserverProps.valid">
              検索
            </el-button>
            <!-- <button type="button" @click="submit" :disabled="!ObserverProps.valid">送信</button> -->
          </div>
        </div>

      </div>
    </validation-observer>
    <!-- <v-expansion-panels class="mt-2 mb-5">
      <v-expansion-panel>
        <v-expansion-panel-header>個人利用のお客様</v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          <el-button class="mt-2" type="primary" :style="{'max-eidth': '400px', 'width': '100%'}">
            + 新規予約する
          </el-button>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>団体利用のお客様</v-expansion-panel-header>
        <v-expansion-panel-content>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

          <el-button class="mt-2" type="primary" :style="{'max-eidth': '400px', 'width': '100%'}">
            + 新規予約する
          </el-button>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels> -->

  <!-- {{ info.browser+'/'+info.isPersonal + '/' + info.isSafariLogin  + '/' + auth.email}} -->
    <!-- <div class="text-center mb-1">
      <a class="text-decoration-underline" :style="{'color':'blue !important'}" rel="noreferrer" @click="onLinkClick">
        キャンセル
      </a>
    </div> -->
  </el-dialog>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import { Dialog } from 'element-ui'
  import DatePicker from "components/DatePicker";
  // import moment from "moment";
  // import { mdiAccount,mdiKey } from '@mdi/js'
  // import firebase from "firebase";
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VeeValidate, { localize } from'vee-validate'
  import ja from 'vee-validate/dist/locale/ja.json';
  localize('ja',ja);
  Vue.use(localize)

  export default {
    components: {
      'el-dialog': Dialog,
      ValidationProvider,
      ValidationObserver,
      DatePicker
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
        // menu: false,
        dialog: false,
        // height: window.screen.height-100,
        // year: '',
        // month: '',
        // day: '',
        isSafariLogin: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          },
        },
        type_options: [{
          value: 'スタジオ予約個人',
          label: '個人'
        }, {
          value: 'スタジオ予約グループ',
          label: 'グループ',
        }],
        options: [{
            value: '1:00',
            label: '1時間'
          }, {
            value: '1:30',
            label: '1.5時間',
          }, {
            value: '2:00',
            label: '2時間',
          }
        ],
        studio_options: [{
          value: 'ナゴスタジオ',
          label: 'ナゴスタジオ'
        }, {
          value: 'コザスタジオ',
          label: 'コザスタジオ',
        }],
        form: {
          date: '',
          time: '',
          use_type: '',
          time_zone: '',
          studio: '', 
        },
        menu: {}
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
      // 日付初期値
      this.form.date = this.$moment().format('YYYY-MM-DD');
    },
    methods: {
      search() {
        // 利用可能時間を検索する
        this.$emit('searchFree',this.form);
        // // 初期化
        // this.form = {
        //   time: '',
        //   use_type: '',
        //   time_zone: '',
        //   studio: '', 
        // }
      },
      ready: function(){
        // // 選択日付
        // this.year = this.$moment(this.selectDate).format('yyyy');
        // this.month = this.$moment(this.selectDate).format('MM');
        // this.day = this.$moment(this.selectDate).format('DD');
      },
      close () {
        this.closeModal();
        this.$el.scrollTo(0,0);
      },
      // onLinkClick() {
      //   this.close()
      //   store.commit('SET_SAFARI_LOGIN', true)
      //   this.$emit('reload');
      // },
    },
  }
</script>
