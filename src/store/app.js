import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex)

import { supersassConfig } from "../config/supersass-config"
import axiosBase from 'axios';
const axios = axiosBase.create({
  // baseURL: 'http://localhost:4005', // バックエンドB のURL:port を指定する
  headers: {
    'Content-Type': 'application/json',
    // 'Content-Type': 'application/xml',
    'X-Requested-With': 'XMLHttpRequest',
    // 'Access-Control-Allow-Origin':'https://localhost:4005',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    // Authorization: "Basic " + btoa("susture" + ":" + "susture2525"),
  },
  responseType: 'json',
  // responseType: 'text/xml'
});

import _ from 'lodash';
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
Vue.use(VueMoment, {
  moment,
})

import createPersistedState from "vuex-persistedstate";

import xml2js from 'xml2js'
const parser = new xml2js.Parser({
        async: false, 
        explicitArray: false
      });
import firebase from "@firebase/app";

// const debug = process.env.NODE_ENV !== 'production'
const debug = process.env.NODE_ENV !== 'development'

const state = {
    result:{
      events: [],
      users: [],
      schedules: [],
      service_resources: [],
      // nonMembers: []
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
    // superSassInfo: {
    //   username: supersassConfig.account,
    //   password: supersassConfig.password,
    //   api_key: supersassConfig.apiKey
    // },
    backuri: '',
    selectDate: '',
    auth: {
      user_id: '',
      username: '',
      password: '',
      email: '',
      checksum: '',
      isMember: false,
      credit: 0,
      supersass: supersassConfig,
      isAdmissionFee: true,
    },
    authStatus: false,
    info: {
      browser:'',
      isPersonal: true,
      isSafariLogin: false,
    }
}

const actions = {
  getMD5: (store,{params,callback}) => {
    // console.log('md',store.state.auth.email,params)
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getHash');
        await httpEvent({ 
          // name: 'susturesusture2525'+store.state.auth.email,
          name: supersassConfig.account+supersassConfig.password+store.state.auth.email,
          headers: {
            // "Access-Control-Allow-Credentials": "true",
            // "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
            // "Authorization": "Basic " + btoa("okaflamencoarts" + ":" + "L7*R3=k<e8b"),
            // "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          callback(res.data)
          // store.commit('SET_USERS', res.data)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  getInfo: (store) => {
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          // path: '/resources',
          path: '/schedules',
          params: {
            // account: 'susture',
            // api_key: 'jmlLq1BhwucEkul_WgmSOA'
            account: supersassConfig.account,
            api_key: supersassConfig.apiKey,
          },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            // "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
            "Authorization": "Basic " + btoa("okaflamencoarts" + ":" + "L7*R3=k<e8b"),
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          console.log('schedules',res);
          // callback(res.data)
          // store.commit('SET_USERS', res.data)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
  },
  getUsers: (store,callback) => {
    // console.log("get users");
    try {
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/users',
          // params: {
          //   username: supersassConfig.account,
          //   password: supersassConfig.apiKey,
          // },
          headers: {
            "Access-Control-Allow-Credentials": "true",
            // "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
            // "Authorization": "Basic " + btoa(supersassConfig.account + ":" + supersassConfig.password),
            "Authorization": "Basic " + btoa("okaflamencoarts" + ":" + supersassConfig.apiKey),
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('get',res);
          callback(res.data)
          store.commit('SET_USERS', res.data)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  getUserAgenda: (store,{params, callback}) => {  // ユーザー予約を取得
    // console.log("get user agenda", params);
    // store.commit('SET_ISLOADING', false)
    try {
      const processA = async function() {
        const httpEvent2 = firebase.functions().httpsCallable('getSSass');
        const d_appoint = httpEvent2({ 
          path: '/agenda',
          method: 'GET',
          params: {
            user: params.email,
            api_key: supersassConfig.apiKey,
            account: supersassConfig.account,
            from: params.from_date,
            slot: true
          },
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res2) => {
          // xml to json
          parser.parseString(res2.data, function (err, result) {
            callback(result.bookings);
          })
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  getClass: (store, {params}) => { //クラスのレッスン
    // store.commit('SET_ISLOADING', true)
    try {
      const processA = async function(schedule_id,studio_name,color) {
        const httpEvent = firebase.functions().httpsCallable('getSSass');
        await httpEvent({ 
          path: '/free/'+schedule_id+'.json',
          params: {
            from: store.state.selectDate + ' 00:00:00',
            checksum: supersassConfig.checksum,
          },
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('free',res);
          _.forEach(res.data.slots, function(v, k) {
            // console.log('free',v);
            let description = v.description;
            let isMember = false;

            // description = description + ' ' +moment(v.start).format("h:mm")+'〜'+moment(v.finish).format("h:mm:ss a");
            let _start = moment(v.start).format("HH:mm");
            let _finish = moment(v.finish).format("HH:mm");
            store.state.result.events.push({
              id: v.id,
              title: v.title,
              start: v.start,
              end: v.finish,
              datetime: _start+'〜'+_finish,
              description: description,
              isMember:isMember,
              studioName: studio_name,
              iconColor: color,
              color: color,
              fontColor: 'black',
              display: '',
              isReserve: false,
              // allDay: true
            })
            // store.commit('SET_ISLOADING', false)
          });
          // callback(res.data)
          // store.commit('SET_USERS', res.data)
        });
      }
      // コザクラス
      const processAll = async function() {
        // await processA(535055,'コザスタジオ','#F3C857')
        await processA(550120,'コザクラス','tomato')
      }
      processAll()
        .then(code => {
          // ナゴクラス
          const processAll2 = async function() {
            // await processA(548481,'ナゴスタジオ','#9DC0AC')
            await processA(550127,'ナゴクラス','blue')
          }
          processAll2().then(code2 => {
            store.commit('SET_ISLOADING', false)
            console.log('success')
            return 'success';
          })
        })
      
    } catch(error){
      console.log(error)
    }
  },
  getBookings: (store) => {
      try {
        const processA = async function(schedule_id, use_type) {
          const httpEvent = firebase.functions().httpsCallable('getSSass');
          await httpEvent({ 
            path: '/bookings',
            params: {
              schedule_id: schedule_id,
              checksum: supersassConfig.checksum,
            },
            headers: {
              "Accept": "application/xml",
              "Content-Type": "application/xml; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            }
          }).then((res) => {
            // console.log('booktest!',res);
            // xml to json
            parser.parseString(res.data, function (err, result) {
              // 個人と団体データ様式が異なるため！
              let _datas =  result.reservations;
              if(_datas==undefined) _datas =  result.appointments;
              _.forEach(_datas, function(reservations, k) {
                _.forEach(reservations, function(v, key) {
                  if(!v['res-name']) return;  // 削除された場合、表示しない

                  // console.log('bookings.',v)

                  let description = v['status-message'];
                  let _start = moment(v['start']['_']).utc().format("HH:mm");
                  let _finish = moment(v['finish']['_']).utc().format("HH:mm");
                  let iconColor = '#ffb6c1'  // 一般
                  let color = '#ffb6c1'
                  let isMember=false;

                  // コザが含まれているか検索
                  iconColor = '#9DC0AC';
                  color = '#9DC0AC';
                  var result = v['res-name'].indexOf('コザ');
                  if(result==-1) {
                    // コザ
                    iconColor = '#F3C857';
                    color = '#F3C857';
                  }

                  store.state.result.events.push({
                    id: v['id']['_'],
                    title: v['full-name'],
                    start: v['start']['_'],
                    end: v['finish']['_'],
                    description: description,
                    datetime: _start+'〜'+_finish,
                    isMember:isMember,
                    studioName: v['res-name'],
                    iconColor: iconColor,
                    color: color,
                    fontColor: 'black',
                    display: '',
                    isReserve: true,
                    created: v['created-on']['_'],
                    user_id: v['user-id']['_'],
                    use_type: use_type
                  })

                })
              })
            });
          });
        }

        // 個人利用
        const processAll = async function() {
          // await processA(534330,'個人利用')
          await processA(549839,'個人利用')
        }
        processAll()
        // 団体利用
        const processAll2 = async function() {
          // await processA(542652,'団体利用')
          await processA(550108,'団体利用')
        }
        processAll2()

        // // 個人利用
        // const processAll3 = async function() {
        //   // await processA(534330,'個人利用')
        //   await processA(550111,'個人利用')
        // }
        // processAll3()
        // // 団体利用
        // const processAll4 = async function() {
        //   // await processA(542652,'団体利用')
        //   await processA(550114,'団体利用')
        // }
        // processAll4()
      } catch(error){
        console.log(error)
      }
  },
  getBooking: (store,{params,callback}) => {  //単一
    console.log("get book",params);
    // store.commit('SET_ISLOADING', false)
    try {
      const processA = async function() {
        const httpEvent2 = firebase.functions().httpsCallable('getSSass');
        const d_appoint = httpEvent2({ 
          path: '/bookings/'+ params.id +'.json',
          method: 'GET',
          params: {
            // schedule_id: 534330,
            schedule_id: supersassConfig.resourceId,
            checksum: supersassConfig.checksum,
          },
          headers: {
            // "Access-Control-Allow-Credentials": "true",
            // "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res2) => {
          console.log('apoi',res2)
          callback(res2);
        });

      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }

  },
  // addAppointment: (store,{params,callback}) => {
  //     // 予約追加
  //     // console.log(store.state.auth)
  //     try {
  //       const processA = async function() {
          
  //         const httpEvent = firebase.functions().httpsCallable('postSSass');
  //         await httpEvent({ 
  //           path: '/bookings.json',
  //           method: 'POST',
  //           params: {
  //             account: supersassConfig.account,
  //             user_id: store.state.auth.user_id,
  //             after: "experience",
  //             'user[name]': store.state.auth.email,
  //             checksum:  store.state.auth.checksum,
  //             // schedule_id: 536129,
  //             // user_id: store.state.auth.user_id,
  //             // checksum: "09f6be878d92eba5cccd8f61923fd24d",
  //             // 'booking[slot_id]': 35868655,
  //             // 'booking[full_name]': "test6",
  //             // 'booking[email]': "kaoru1225@gmail.com",
  //             // booking: {
  //             //   slot_id: '35868655',
  //             //   full_name: "test5",
  //             //   email: "kaoru1225@gmail.com",
  //             // },
  //             // form:true,
  //           },
  //           headers: {
  //             // cookie: 'account=susture;'+'checksum='+store.state.auth.checksum,
  //             // "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
  //             // "Access-Control-Allow-Origin": "*",
  //             // "Access-Control-Allow-Credentials": "true",
  //             // "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
  //             // 'X-Requested-With': 'XMLHttpRequest',
  //             // 'Accept': 'text/plain',
  //             // "Contsent-Type": "application/xml",

  //             "Accept": "*/*",
  //             // "Contsent-Type": "application/json; charset=utf-8",
  //             "Access-Control-Allow-Origin": "*",
  //           }
  //         }).then((res) => {
  //           // console.log('apo',res);
  //           // callback(res)
  //         });
  //       }
  //       const processAll = async function() {
  //         await processA()
  //       }
  //       processAll()
  //     } catch(error){
  //       console.log(error)
  //     }
  // },
  deleteAppointment: (store,{params,callback}) => {
      try {
        // スタジオリソース
        // let _schedule_id = '534330'
        // let _checksum = '09f6be878d92eba5cccd8f61923fd24d';
        // let _schedule_id = '549839'
        // let _checksum = 'f7e678ba113d5789a3cf35a53171f721';

        // 予約削除
        const processA = async function() {
          const httpEvent2 = firebase.functions().httpsCallable('deleteSSass');
          const d_appoint = httpEvent2({ 
            path: '/bookings/'+ params.id +'.json',
            params: {
              schedule_id: supersassConfig.resourceId,
              checksum: supersassConfig.checksum,
            },
            headers: {
              "Accept": "*/*",
              "Contsent-Type": "application/json; charset=utf-8",
              "Access-Control-Allow-Origin": "*",
            }
          }).then((res) => {
            console.log(res)
            callback(res)
          });
          return d_appoint;

        }
        const processAll = async function() {
          return await processA()
        }
        processAll()
      } catch(error){
        console.log(error)
      }
  },
  addUser: (store,{params,callback}) => {

    // ランダム整数発行
    var _code = getRandomInt(1,9999)
    // var _name='susturesusture2525'+params.email;
    // // console.log('p name.',_name);

    // ////////////////////////
    // // supersass新規追加
    // ////////////////////////

    try {
      console.log('user!',params, _code)
      const processA = async function() {
        const httpEvent = firebase.functions().httpsCallable('postSSass');
        await httpEvent({ 
          path: '/users/'+_code+'fk.json',
          method: 'POST',
          params: {
            // account:'susture',
            // password:'jmlLq1BhwucEkul_WgmSOA',
            account: supersassConfig.account,
            password: supersassConfig.apiKey,
            'user[full_name]': params.displayName,
            'user[name]': params.email,
            'user[password]': params.email,
          },
          headers: {
            "Accept": "*/*",
            "Contsent-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          }
        }).then((res) => {
          // console.log('user',res);
          callback(res)
        });
      }
      const processAll = async function() {
        await processA()
      }
      processAll()
    } catch(error){
      console.log(error)
    }
      // // md5
      // axios.post('/gcf/getMD5',{
      //   name: _name
      // }
      // ).then((response) => {
      //   console.log('ハッシュ値',response.data)
      //   store.commit('SET_AUTH_CHECKSUM', response.data.result)

      //   // // supersass
      //   // axios.post('/schedule/users/'+_code+'fk',{
      //   //   account:'susture',
      //   //   password:'jmlLq1BhwucEkul_WgmSOA',
      //   //   user: {
      //   //     full_name: params.displayName,
      //   //     name: params.email,
      //   //     password: params.displayName,
      //   //     super_field: response.data.result,
      //   //   },
      //   // }).then((response2) => {
      //   //   // console.log('success');
      //   //   callback(response2);
      //   // }).catch((error) => {
      //   //     console.log(error);
      //   // });  

      //   // callback(response)
      // }).catch((error) => {
      //     console.log(error);
      // });

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
  // saveUser: (store,{params,callback}) => {
  //   try {
  //     store.state.auth.credit += params.price;
  //     console.log('user!',store.state.auth)
  //     const processA = async function() {
  //       const httpEvent = firebase.functions().httpsCallable('postSSass');
  //       await httpEvent({ 
  //         path: '/users/'+ store.state.auth.user_id+'.json',
  //         method: 'PUT',
  //         params: {
  //           notfound: 'ignore',
  //           'user[name]': store.state.auth.email,
  //           'user[email]': store.state.auth.email,
  //           'user[credit]': store.state.auth.credit,
  //         },
  //         headers: {
  //           "Access-Control-Allow-Credentials": "true",
  //           "Authorization": "Basic " + btoa("susture" + ":" + "susture2525"),
  //           "Accept": "*/*",
  //           "Contsent-Type": "application/json; charset=utf-8",
  //           "Access-Control-Allow-Origin": "*",
  //         }
  //       }).then((res) => {
  //         console.log('apo',res);
  //         callback(res)
  //       });
  //     }
  //     const processAll = async function() {
  //       await processA()
  //     }
  //     processAll()
  //   } catch(error){
  //     console.log(error)
  //   }
  // }
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
    state.auth.isMember=false
    state.auth.user_id='';
    state.auth.credit=0;
    state.auth.supersass = supersassConfig;
    state.info.isSafariLogin = false
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
  SET_SCHEDULES (state, data) {
    state.result.schedules = data
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
    // console.log('get auth',auth)
    state.auth.username = auth.displayName;
    state.auth.email = auth.email
    state.auth.isAdmissionFee = true;
    // state.info.isSafariLogin = false;

    // イベント取得
    let index = _.findIndex(state.result.users, function(o){
      return o.name==auth.email;
    });
    if(index==-1) return;
    // supersassアカウント
    let supersassuser = state.result.users[index]
    state.auth.user_id = supersassuser.id
    state.auth.credit = supersassuser.credit

    // 初回の入会金チェック
    if(supersassuser.super_field==null){
      state.auth.isAdmissionFee = false;
      return;
    }
    // console.log('super',supersassuser)
    // 権限
    if(supersassuser.super_field==1) state.auth.isMember = true;
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
  SET_SAFARI_LOGIN (state, is_login){
    state.info.isSafariLogin = is_login
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



