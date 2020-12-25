//import _ from 'lodash'
import Vue from 'vue';
import Vuex from 'vuex';
// import cors from 'cors';
import axiosBase from 'axios';
const axios = axiosBase.create({
  // baseURL: 'http://localhost:4005', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/x-www-form-urlencoded',
    // 'Content-Type': 'application/xml; charset=utf-8',
    'X-Requested-With': 'XMLHttpRequest',
    // 'Content-Type': 'application/json;charset=utf-8',
    // 'Access-Control-Allow-Origin':'https://localhost:4005',
    // 'Access-Control-Allow-Origin':'https://supersaas.com',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    // 'Accept': 'application/json',
    // 'Access-Control-Allow-Headers': 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  },
  responseType: 'json',
});

import _ from 'lodash';
Vue.use(Vuex)

// import GAuth from 'vue-google-oauth2'
// Vue.use(GAuth, {
//   clientId: '121254292316-29p6tbp6bvo0c31qtmubdatce3l112ck.apps.googleusercontent.com',
//   ClientSecret: "0m6e0Mq-Q71OdGDDd0C0JnTU",
//   scope: 'https://www.googleapis.com/auth/spreadsheets'
// })


// google spreadsheet
import VueGapi from 'vue-gapi'
// const clientConfig = {
//   apiKey: ['AIzaSyCgFsVIgq3-bXJtlQKaIRD2OiKe0NBcTuw','onkltar6879bqv4616fa28i048@group.calendar.google.com'],
//   clientId: '121254292316-29p6tbp6bvo0c31qtmubdatce3l112ck.apps.googleusercontent.com',
//   discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4','https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
//   scope: ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/calendar.readonly'],
//   // works only with `ux_mode: "prompt"`
//   refreshToken: true,
// }
const clientConfig = {
  apiKey: ['AIzaSyCgFsVIgq3-bXJtlQKaIRD2OiKe0NBcTuw'],
  clientId: '121254292316-29p6tbp6bvo0c31qtmubdatce3l112ck.apps.googleusercontent.com',
  discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4','https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: ['https://www.googleapis.com/auth/spreadsheets','https://www.googleapis.com/auth/calendar.readonly'],
  // works only with `ux_mode: "prompt"`
  refreshToken: true,
}
Vue.use(VueGapi, clientConfig)

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
    }
}

const actions = {
    // getUsers: (store) => {
    //   // console.log('hi')
    //   axios.get('/supersass/users',
    //   {
    //     // withCredentials: true,
    //     params: {
    //       username: 'susture',
    //       password: 'jmlLq1BhwucEkul_WgmSOA',
    //     },
    //     auth: store.state.superSassInfo
    //   }
    //   ).then((response) => { 
    //     console.log('OK',response)
    //     let dt = _.map(response.data, function(v) {
    //         return {
    //           id: v.id,
    //           address: v.address,
    //           country: v.country,
    //           createdOn: v.createdOn,
    //           credit: v.credit,
    //           email: v.email,
    //           errors: v.errors,
    //           field1: v.field1,
    //           field2: v.field2,
    //           fk: v.fk,
    //           form: v.form,
    //           fullName: v.fullName,
    //           mobile: v.mobile,
    //           name: v.name,
    //           phone: v.phone,
    //           role: v.role,
    //           superField: v.superField
    //         };
    //     });
    //     store.commit('SET_USERS', dt)
    //   }).catch((error) => {
    //       console.log(error);
    //   });
    // },
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
            if(v.start!==null) {
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
}


// TODO: あとでcreateLoggerを外す
export default new Vuex.Store({
  state,
  actions,
  mutations,
  strict: debug,
})
