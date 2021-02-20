<template>
  <div id="reservation">
    <v-card 
      ref="reservationStudio"
      tile
      max-width="360px"
      :style="{'margin':'0 auto'}"
      >
      <div class="text-center pt-5 pb-0 text-primary">
        <h4>スタジオ予約検索</h4>
      </div> 
      <div class="text-left p-3 pt-2">
        <el-alert
          :closable="false"
          type="info"
          description="検索して、利用可能な時間からお選びください。"
          show-icon>
        </el-alert>
        <validation-observer ref="observer" v-slot="ObserverProps" tag="form" @submit.prevent="searchStudio()">
          <div class="form-row">
            <div class="col-6 p-2 pb-0">
              <div class="filed">
                <validation-provider name="予約日" rules="required" v-slot="prop">
                  <v-text-field 
                    name="予約日" 
                    v-model="form.date" 
                    label="予約日" 
                    :error-messages="prop.errors[0]" 
                    single-line>
                    <template v-slot:append-outer>
                      <date-picker v-model="form.date"/>
                    </template>
                  </v-text-field>
                </validation-provider>
              </div>
            </div>
            <div class="col-6 p-2 pb-0"> 
              <div class="filed">
                <validation-provider name="入室時間" rules="required" v-slot="prop">
                  <v-text-field 
                    name="入室時間" 
                    v-model="form.time" 
                    label="入室時間" 
                    :error-messages="prop.errors[0]" single-line>
                    <template v-slot:append-outer>
                      <date-time-picker v-model="form.time"/>
                    </template>
                  </v-text-field>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="利用タイプ" rules="required" v-slot="prop">
                  <v-select
                    name="利用タイプ"
                    class="text-left p-1"
                    v-model="form.use_type"
                    :items="type_options"
                    label="利用タイプ"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="時間枠" rules="required" v-slot="prop">
                  <v-select
                    name="時間枠"
                    class="text-left p-1"
                    v-model="form.time_zone_name"
                    :items="options"
                    label="時間枠"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                </validation-provider> 
              </div>
            </div>
            <div class="col-12 p-2 pb-0">
              <div class="filed">
                <validation-provider name="スタジオ" rules="required" v-slot="prop">
                  <v-select
                    name="スタジオ"
                    class="text-left p-1"
                    v-model="form.studio"
                    :items="studio_options"
                    label="スタジオ"
                    :error-messages="prop.errors[0]"
                  ></v-select>
                  <span class="sample" :style="{'color': 'red'}">{{ prop.errors[0] }}</span>
                </validation-provider> 
              </div>
            </div>

            <div class="col-12 p-2 pb-0">
              <div class="block">
                <el-button class="m-0" type="warning" :style="{'width': '100%'}" @click="searchStudio">
                  検索
                </el-button>
                <el-button type="secondary" class="m-0 mt-5 mb-3" :style="{'width': '100%'}" @click="cancel">キャンセル</el-button>
              </div>
            </div>

          </div>
        </validation-observer>
      </div>
    </v-card>
    <v-container v-show="0<items.length">
      <span class="font-weight-medium" :style="{'color':'#5469d4','font-size':'20px'}">レンタル料金：¥{{ form.price.toLocaleString() }}</span>
        <h4 class="mt-3 mb-2" id="capa-content" ref="courseContents">利用可能時間</h4>
        <el-alert
          class="mt-2 mb-2"
          type="success"
          description="ご希望の時間をお選びください。"
          show-icon>
        </el-alert>
        <el-alert
          v-if="isShort"
          class="mt-2 mb-4"
          type="warning"
          :description="'ポイント不足しています。 あと'+shortPoint +'ポイント不足'"
          show-icon>
        </el-alert>
        
        <studio-resource
          v-for="(item, index) in items"
          :key="'course-detail-'+index" 
          :item="item"
          @reload="reload" />
        </studio-resource>
    </v-container>
  </div>
</template>

<script>
  import Vue from 'vue'
  import store from '../store/app';
  import axios from "axios"
  import firebase from "Firebase";

  import DatePicker from "components/DatePicker";
  import DateTimePicker from "components/DateTimePicker";
  import StudioResource from "components/StudioResource";
  import { ValidationProvider, ValidationObserver } from 'vee-validate';
  import VeeValidate, { localize } from'vee-validate'
  import ja from 'vee-validate/dist/locale/ja.json';
  localize('ja',ja);
  Vue.use(localize)

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
    DatePicker,
    DateTimePicker,
    StudioResource
  },
  data() {
    return {
      type_options: ['個人','グループ'],
      options: ['1時間','1.5時間','2時間'],
      studio_options: ['ナゴスタジオ','コザスタジオ'],
      form: {
        date: '',
        time: '',
        use_type: '',
        time_zone_name: '',
        time_zone: '',
        hour: 1,
        studio: '',
        price: 0,
        is_stripe: false,
      },
      isShort: false,
      shortPoint: 0,
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   //ページの更新
  //   console.log('beforeRouteEnter kata-');
  //   next();
  // },
  computed: {
    loading() {
      return store.state.isLoading;
    },
    auth() {
      return store.state.auth;
    },
    items() {
      return store.state.result.resources;
    },
    search() {
      return store.state.search;
    },
  },
  created: function () {
    // this.isSafariLogin = localStorage.getItem('isSafariLogin');
    // 日付初期値
    // this.form.date = this.$moment().format('YYYY-MM-DD');
    this.$nextTick(function() {
      store.commit('SET_ISLOADING', false)
    });
    store.commit('SET_SELECT_RESOURCES', [])
  },
  mounted() {  
  },
  methods: {
    // getDocName(){
    //   let that = this;
    //   const processA = async function() {
    //     let _documentName = "個人利用";
    //     if(that.search.use_type == "グループ") _documentName = "団体利用"
    //     // 会員で入会金支払い済の場合
    //     if(that.auth.username!=='' && that.auth.isAdmissionFee) {
    //       _documentName = "スタジオレンタル（個人利用）";
    //       if(that.search.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";
    //     }
    //     return await _documentName;
    //   };
    //   return processA()
    // },
    async searchStudio() {

      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
        return;
      }

      // 利用可能時間を検索する
      store.commit('SET_ISLOADING', true)
      var element = document.getElementById('capa-content');
      var that = this;
      that.isShort = false;
      that.shortPoint = 0;
      that.form.is_stripe=false;

       // 時間変換
      switch (that.form.time_zone_name) {
        case '1時間':
          that.form.time_zone='1:00'
          that.form.hour=1
          break;
        case '1.5時間':
          that.form.time_zone='1:30'
          that.form.hour=1.5
          break;
        case '2時間':
          that.form.time_zone='2:00'
          that.form.hour=2
          break;
      }

      let _documentName = "個人利用";
      if(that.form.use_type == "グループ") _documentName = "団体利用"

      // 会員以外は即決済
      if(that.auth.username=='') that.form.is_stripe = true;

      // 会員で入会金支払い済の場合
      if(that.auth.username!=='' && that.auth.isAdmissionFee) {
        _documentName = "スタジオレンタル（個人利用）";
        if(that.form.use_type == "グループ") _documentName = "スタジオレンタル（団体利用）";
      }

      // console.log(_documentName)
      firebase.db().collection("schedules").doc(_documentName)
      .get().then(function(querySnapshot) {
          if (querySnapshot.exists) {
            let resource = querySnapshot.data()
            let price = resource.resources[that.form.time_zone].price
            // 決済以外（ポイント精算）
            if(!that.form.is_stripe){
              let credit = that.auth.credit.replace(/,/, '');
              if(Number(credit)<=price){
                that.isShort = true;
                that.shortPoint = price - Number(credit);
                // 不足している場合は即決済
                that.form.is_stripe = true;
              }  
            }
            that.form.price = price;
            store.commit('SET_SELECT_SEARCH', that.form)
            // 利用可能時間を取得
            store.dispatch('getFree',{
              params: that.form,
              callback: function(res){
                setTimeout(function(){
                  // console.log('time')  
                  element.scrollIntoView({block: "center", inline: "nearest"});
                  store.commit('SET_ISLOADING', false)
                },2000);
              }
            });
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });
        
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
    onLinkClick() {
      this.close()
      store.commit('SET_SAFARI_LOGIN', true)
      this.$emit('reLoad');
    },
    cancel: function () {
      this.$router.replace('/')
    },
    reload() {

    }
  }
}
</script>
