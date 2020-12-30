import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from "vuex-persistedstate"

import auth from "./module/auth"
import config from "./module/config"
import VueGapi from 'vue-gapi'
Vue.use(VueGapi, config)

import axiosBase from 'axios';
const axios = axiosBase.create({
  // baseURL: 'http://localhost:4005', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  responseType: 'json',
});

import _ from 'lodash';
Vue.use(Vuex)

import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment,
})

// const debug = process.env.NODE_ENV !== 'production'
const debug = process.env.NODE_ENV !== 'development'

const state = {
    result:{
      events: [],
      users: [],
      service_resources: [],
      nonMembers: []
      // list:{},
      // pagenate:{},
    },
    master:{},
    form:{
    },
    isLoading: true,
    page:1,
    total:1,
    totalPages:1,
    query:{
        limit:10,
    },
    superSassInfo: {
      username: 'susture',
      password: 'susture2525'
    },
    backuri: '',
    selectDate: '',
}

const actions = {
    getUsers: (store) => {
      // console.log('hi')
      axios.get('/supersass/users',
      {
        // withCredentials: true,
        params: {
          username: 'susture',
          password: 'jmlLq1BhwucEkul_WgmSOA',
        },
        auth: store.state.superSassInfo
      }
      ).then((response) => {
        // callback(response);
        console.log('OK',response)
        // let dt = _.map(response.data, function(v) {
        //     return {
        //       id: v.id,
        //       address: v.address,
        //       country: v.country,
        //       createdOn: v.createdOn,
        //       credit: v.credit,
        //       email: v.email,
        //       errors: v.errors,
        //       field1: v.field1,
        //       field2: v.field2,
        //       fk: v.fk,
        //       form: v.form,
        //       fullName: v.fullName,
        //       mobile: v.mobile,
        //       name: v.name,
        //       phone: v.phone,
        //       role: v.role,
        //       superField: v.superField
        //     };
        // });
        store.commit('SET_USERS', response.data)
      }).catch((error) => {
          console.log(error);
      });
    },
    getServiceResources: (store) => {  // 一般の選択項目
      // 
      axios.get('/supersass/resources.json',{
        withCredentials: true,
        params: {
          schedule_id: 535588,
          username: 'susture',
          password: 'jmlLq1BhwucEkul_WgmSOA'
        },
        auth: store.state.superSassInfo
      }).then((response) => {
        // console.log('test',response)
        store.commit('SET_SERVICE_RESOURCES', response.data)
        // console.log("get resource!")
      }).catch((error) => {
          console.log(error);
      });

    },
    getNonMembers: (store) => {
        axios.get('/supersass/bookings.json?slot=true',{
          params: {
            schedule_id: 535588
          },
          auth: store.state.superSassInfo
        }).then((response) => {
          let dt = _.map(response.data, function(v) {
              return {
                id: v.id,
                fullName: v.full_name,
                userId: v.user_id
              };
          });
          store.commit('SET_NONMEMBERS', dt)
          // console.log("get nonMembers!")
        }).catch((error) => {
            console.log(error);
        });
    },
    getDatas: (store,callback) => {
        // console.log("get datas!",store)
        store.commit('SET_ISLOADING', true)
        axios.get('/supersass/schedules.json',{
          auth: store.state.superSassInfo
        }).then((response) => {
          callback(response);
        })  
        .then(() => {
          // store.commit('SET_ISLOADING', false)
        }).catch((error) => {
            console.log(error);
        });

    },
    getBookings: (store,params) => {
        
        // 非会員は取得しない
        if(params.schedule_id === 535588) return;

        let that = this;
        // store.commit('SET_ISLOADING', true)
        axios.get('/supersass/bookings.json',{
          params: params,
          auth: store.state.superSassInfo
        }).then((response) => {
        
          _.forEach(response.data, function(v, key) {
            if(v.start!==null && v.status!==6) {
              // console.log('value check.',v)

              let description = '';
              let iconColor = '#ffb6c1'  // 非会員
              let color = '#ffb6c1'
              let isMember=false;

              // コザ以外＝ナゴ
              // if(params.schedule_id !== 534330) {
              if(v.res_name == 'ナゴスタジオ') {
                iconColor = '#9DC0AC';
                color = '#9DC0AC';
              }else if(v.res_name == 'コザスタジオ') {
                iconColor = '#F3C857';
                color = '#F3C857';
              }

              // 非会員チェック
              const nonMember = _.find(store.state.result.nonMembers, { userId: v.user_id }); 
              if(nonMember){
                //一般の場合
                // description = v.status_message
                description = '一般'
                iconColor = '#ffb6c1'
                color = '#ffb6c1'
              }else{
                // 会員の場合
                isMember = true;
                description = v.field_2_r
                // iconColor = '#67C23A'
                // color = '#67C23A';
              }

              store.state.result.events.push({
                id: v.id,
                title: v.full_name,
                start: v.start,
                end: v.finish,
                description: description,
                isMember:isMember,
                studioName: v.res_name,
                iconColor: iconColor,
                color: color,
                fontColor: 'black',
                display: '',
                isGoogle: false,
              })

            }
          })

        })  
        .then(() => {
          // store.commit('SET_ISLOADING', false)
        }).catch((error) => {
            console.log(error);
        });
    },
}

const mutations = {
  SET_USERS (state, data) {
    state.result.users = data
  },
  SET_SERVICE_RESOURCES (state, data) {
    state.result.service_resources = data
  },
  SET_NONMEMBERS (state, data) {
    state.result.nonMembers = data
  },
  SET_EVENTS (state, data) {
    state.result.events = data
  },  
  SET_ISLOADING (state, flg){
    state.isLoading = flg
  },
  SET_BACK_URI (state, data){
    state.backuri = data
  },
  SET_SELECT_DATE (state, data){
    state.selectDate = data
  },
}

// TODO: あとでcreateLoggerを外す
export default new Vuex.Store({
  modules: {
    auth
  },
  state,
  actions,
  mutations,
  strict: debug,
  plugins: [createPersistedState({
    key: "xxxproject",     // プロジェクト単位の一意の識別子
    paths: ["auth.login"], // auth.js の loginキーは再度アクセスしても保持するようにする
    storage: localStorage  // 今回は localStorage に保存することにする
  })]
})
