import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

// import config from "../config/google-config"
// import VueGapi from 'vue-gapi'
// Vue.use(VueGapi, config)

import axiosBase from 'axios';
const axios = axiosBase.create({
  // baseURL: 'http://localhost:4005', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'text/html',
    'X-Requested-With': 'XMLHttpRequest',
    'Access-Control-Allow-Origin':'https://localhost:4005',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    Authorization: "Basic " + btoa("susture" + ":" + "susture2525"),
  },
  responseType: 'json',
});

import _ from 'lodash';
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment,
})

import createPersistedState from "vuex-persistedstate";

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
    auth: {
      username: '',
      password: '',
      email: '',
      general: true,
      checksum: ''
    },
    authStatus: false,
    info: {
      browser:'',
      isPersonal: true,
    }
}

const actions = {
  // getMD5: (store,{params}) => {


  //   // store.commit('SET_AUTH_CHECKSUM', 'eff56d8034a71152abe9d45dc8c0d309')
  //   // store.commit('SET_AUTH_CHECKSUM', '63e05e52145c25a984962af126e6baa2') 
  //   // store.commit('SET_ISLOADING', false)

  //   axios.get('/gcf',{
  //     name: 'susturesusture2525'+params['user_name']
  //   }).then((response) => {
  //     // store.commit('SET_USERS', response.data)
  //     console.log('ハッシュ値',response.data.result)
  //     // store.commit('SET_AUTH_CHECKSUM', '63e05e52145c25a984962af126e6baa2')
  //     store.commit('SET_AUTH_CHECKSUM', response.data.result)
  //     store.commit('SET_ISLOADING', false)
  //     // callback(response)
  //   }).catch((error) => {
  //       console.log(error);
  //   });
    
  // },
  loginSupersass: (store,{params}) => {

    // axios.get('/api/login?account=susture&after=General&user[name]=susture387@gmail.com&checksum='+state.auth.checksum,
    axios.post('/api/login',
    {
      account:'susture',
      checksum: params.checksum,
      user: {
        name: params.email
      },
      withCredentials: true,
      // responseType : 'document',
    }).then((response) => {
      console.log('login??',response)
      // store.commit('SET_USERS', response.data)
      // callback(response)
    }).catch((error) => {
        console.log(error);
    });
  },
  getUsers: (store,callback) => {
    axios.get('/supersass/api/users',
    {
      withCredentials: true,
      params: {
        username: 'susture',
        password: 'jmlLq1BhwucEkul_WgmSOA',
      },
      auth: store.state.superSassInfo
    }
    ).then((response) => {
      // console.log('OK',response)
      store.commit('SET_USERS', response.data)
      callback(response)
    }).catch((error) => {
        console.log(error);
    });
  },
  getServiceResources: (store) => {  // 一般の選択項目
    // 
    axios.get('/supersass/api/resources.json',{
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
      axios.get('/supersass/api/bookings.json?slot=true',{
        withCredentials: true,
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
      axios.get('/supersass/api/schedules.json',{
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
      axios.get('/supersass/api/bookings.json',{
        params: params,
        auth: store.state.superSassInfo
      }).then((response) => {
      
        _.forEach(response.data, function(v, key) {
          if(v.start!==null && v.status!==6) {
            // console.log('value check.',v)

            if(!v.res_name){ return; }  // 削除された場合、表示しない

            let description = '';
            let iconColor = '#ffb6c1'  // 一般
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
              // iconColor = '#ffb6c1'
              // color = '#ffb6c1'
            }else{
              // 会員の場合
              isMember = true;
              description = v.field_2_r
              // iconColor = '#67C23A'
              // color = '#67C23A';
            }

            store.state.result.events.push({
              id: v.id,
              // title: v.full_name,
              title: v.res_name+' '+v.full_name,
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
              // allDay: true
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
  addUser: (store,{params,callback}) => {
      // ランダム整数発行
      var _code = getRandomInt(1,9999)
      var _name='susturesusture2525'+params.email;
      // console.log('p name.',_name);

      ////////////////////////
      // supersass新規追加
      ////////////////////////

      // TODO: checksum不具合解消までの間コメント=========================
      // md5
      axios.post('/gcf',{
        name: _name
      }
      ).then((response) => {
        console.log('ハッシュ値',response.data)
        store.commit('SET_AUTH_CHECKSUM', response.data.result)

        // supersass
        axios.post('/api/users/'+_code+'fk.json',{
          account:'susture',
          password:'jmlLq1BhwucEkul_WgmSOA',
          user: {
            full_name: params.displayName,
            name: params.email,
            password: params.displayName,
            super_field: response.data.result,
          },
        }).then((response2) => {
          // console.log('success');
          callback(response2);
        }).catch((error) => {
            console.log(error);
        });  

        // callback(response)
      }).catch((error) => {
          console.log(error);
      });
      // TODO: checksum不具合解消までの間コメント=========================

      // // supersass
      // axios.post('/api/users/'+_code+'fk.json',{
      //   account:'susture',
      //   password:'jmlLq1BhwucEkul_WgmSOA',
      //   checksum: response.data.result,
      //   user: params.user,
      // }).then((response2) => {
      //   // console.log('success');
      //   callback(response2);
      // }).catch((error) => {
      //     console.log(error);
      // });  

  },
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const mutations = {
  onAuthEmailChanged(state, email) {
    state.email = email; //firebase user情報
    state.auth.username=''
    state.auth.email=''
    state.auth.checksum=''
  },
  onUserStatusChanged(state, status) {
    state.authStatus = status;
  },
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
  SET_AUTH (state, auth){
    state.auth.username = auth.displayName;
    state.auth.email = auth.email
  },
  SET_AUTH_ROLE (state, general){
    state.auth.general = general;
  },
  SET_AUTH_CHECKSUM (state, hash){
    state.auth.checksum = hash;
  },
  SET_INFO_BROUSER (state, browser){
    state.info.browser = browser;
  },
  RESET_VUEX_STATE(state) {
    // ローカルストレージ初期化
    Object.assign(state, JSON.parse(localStorage.getItem('state')));
    
  },
}

// TODO: あとでcreateLoggerを外す
export default new Vuex.Store({
  state,
  actions,
  mutations,
  plugins: [createPersistedState()],
  strict: debug,
})



